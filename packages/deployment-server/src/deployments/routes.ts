import { DeployStatus, DeployRequest } from '.prisma/client'
import { Static, Type } from '@sinclair/typebox'
import { Router } from 'express'
import { addDeployRequest } from '../connectors/queue'
import { getAvailableDevice, getLeastLoadedDevice } from '../devices/service'
import { IdParams, idParams } from '../util/idParams'
import { validate } from '../util/validate'
import { closeDeploymentStream, createDeploymentStream } from './service'

export default function deploymentRequestsRoutes (router: Router): void {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.get('/deployments', async (req, res, next) => {
    try {
      const deploymentRequests = await req.db.deployRequest.findMany()
      return res.json(deploymentRequests)
    } catch (e) {
      next(e)
    }
  })

  router.get('/deployments/:id', validate<DeployRequest, IdParams>({ params: idParams }), async (req, res, next) => {
    try {
      const deploymentRequest =
        await req.db.deployRequest.findUnique({
          where: { id: req.params.id }
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
    validate<DeployRequest, {}, Static<typeof postBody>>({ body: postBody }),
    async (req, res, next) => {
      try {
      // Find an available device
        let device = await getAvailableDevice(req.body.deviceTypeId)

        // If no device is available, get the first one with the minimal amount of in-progress deploymentRequests
        if (device == null) {
          device = await getLeastLoadedDevice(req.body.deviceTypeId)
        }

        if (device == null) {
          return res.sendStatus(503)
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

        // Open a websocket for the connector to pipe the output/error to
        createDeploymentStream(deploymentRequest)

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
          data: req.body
        })

        const finalStates: readonly DeployStatus[] =
          Object.freeze([
            DeployStatus.SUCCESS,
            DeployStatus.FAILED,
            DeployStatus.TERMINATED
          ])

        if (finalStates.includes(deploymentRequest.status)) {
          await closeDeploymentStream(deploymentRequest)
        }

        return res.json(deploymentRequest)
      } catch (e) {
        next(e)
      }
    })
}
