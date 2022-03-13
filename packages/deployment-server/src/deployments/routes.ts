/********************************************************************************
    Copyright (c) 2022 EclipseSource and others.

    This program and the accompanying materials are made available under the
    terms of the Eclipse Public License v. 2.0 which is available at
    http://www.eclipse.org/legal/epl-2.0.

    This Source Code may also be made available under the following Secondary
    Licenses when the conditions for such availability set forth in the Eclipse
    Public License v. 2.0 are satisfied: GNU General Public License, version 2
    with the GNU Classpath Exception which is available at
    https://www.gnu.org/software/classpath/license.html.

    SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
********************************************************************************/
import prisma, { DeployRequest } from '@prisma/client'
import { Static, Type } from '@sinclair/typebox'
import { Router } from 'express'
import { addDeployRequest, getServerForConnector } from '../connectors/queue'
import { getAvailableDevice, getLeastLoadedDevice, isDeployable, updateDeviceStatus } from '../devices/service'
import { IdParams, idParams } from '../util/idParams'
import { validate } from '../util/validate'
import { closeDeploymentStream, createDeploymentStream, getDeploymentStream, hasDeploymentStream } from './service'

const { DeviceStatus, DeployStatus } = prisma

export default function deploymentRequestsRoutes (router: Router): void {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.get('/deployments', async (req, res, next) => {
    try {
      const deploymentRequests = await req.db.deployRequest.findMany({
        include: {
          device: {
            include: {
              type: true
            }
          }
        }
      }
      )
      return res.json(deploymentRequests)
    } catch (e) {
      next(e)
    }
  })

  router.get('/deployments/:id', validate<DeployRequest, IdParams>({ params: idParams }), async (req, res, next) => {
    try {
      const deploymentRequest =
        await req.db.deployRequest.findUnique({
          where: { id: req.params.id },
          include: {
            device: {
              include: {
                type: true
              }
            }
          }
        })

      if (deploymentRequest == null) {
        return res.sendStatus(404)
      }

      return res.json(deploymentRequest)
    } catch (e) {
      next(e)
    }
  })

  const postBody = Type.Object({
    deviceTypeId: Type.String({ format: 'uuid' }),
    artifactUri: Type.String({ format: 'uri' })
  }, { additionalProperties: false })

  router.post('/deployments',
    validate<DeployRequest | Error, {}, Static<typeof postBody>>({ body: postBody }),
    async (req, res, next) => {
      try {
        // Find an available device
        let device = await getAvailableDevice(req.body.deviceTypeId)

        // If no device is available, get the first one with the minimal amount of in-progress deploymentRequests
        if (device == null) {
          [device] = await getLeastLoadedDevice(req.body.deviceTypeId)
        }

        if (device == null) {
          return res.status(503).json({
            name: 'Type not available',
            message: 'No device available to serve requests for this type'
          })
        }

        if (!await isDeployable(device)) {
          await req.db.issue.create({
            data: {
              deviceTypeId: req.body.deviceTypeId
            }
          })

          return res.status(502).json({
            name: 'Device queue is full',
            message: 'The Request cannot be deployed, because the queue is full.'
          })
        }
        const deploymentRequest = await req.db.deployRequest.create({
          data: {
            device: {
              connect: {
                id: device.id
              }
            },
            status: DeployStatus.PENDING,
            artifactUrl: req.body.artifactUri
          }
        })

        await updateDeviceStatus({ id: deploymentRequest.deviceId })

        // Open a websocket for the connector to pipe the output/error to
        const stream = createDeploymentStream(deploymentRequest)
        if (stream != null) {
          for (const client of stream.clients) {
            client.send('Deployment ' + DeployStatus.PENDING)
          }
        }

        // Send deploymentRequest to device
        await addDeployRequest(device, deploymentRequest)

        return res.json(deploymentRequest)
      } catch (e) {
        next(e)
      }
    })

  const putBody = Type.Object({
    status: Type.Enum(DeployStatus)
  }, { additionalProperties: false })

  router.put('/deployments/:id',
    validate<DeployRequest, IdParams>({ body: putBody, params: idParams }),
    async (req, res, next) => {
      try {
        const deploymentRequest = await req.db.deployRequest.update({
          where: { id: req.params.id },
          data: req.body,
          include: { device: { include: { connector: true } } }
        })

        await updateDeviceStatus({ id: deploymentRequest.deviceId })

        const stream = getDeploymentStream(deploymentRequest)
        if (stream != null) {
          for (const client of stream.clients) {
            client.send('Deployment ' + deploymentRequest.status)
          }
        }

        if (deploymentRequest.status === DeployStatus.RUNNING) {
          const connectorStream = getServerForConnector(deploymentRequest.device.connector)

          if (connectorStream != null) {
            for (const client of connectorStream.clients) {
              client.send(JSON.stringify({ type: 'monitor.start', data: { device: { id: deploymentRequest.device.id } } }))
            }

            await req.db.device.update({
              where: { id: deploymentRequest.deviceId },
              data: { status: DeviceStatus.MONITORING }
            })
          }
        }

        const finalStates: ReadonlyArray<(typeof DeployStatus)[keyof typeof DeployStatus]> =
          Object.freeze([
            DeployStatus.SUCCESS,
            DeployStatus.FAILED,
            DeployStatus.TERMINATED
          ])

        if (
          finalStates.includes(deploymentRequest.status) &&
          hasDeploymentStream(deploymentRequest)
        ) {
          await closeDeploymentStream(deploymentRequest)
        }

        return res.json(deploymentRequest)
      } catch (e) {
        next(e)
      }
    })
}
