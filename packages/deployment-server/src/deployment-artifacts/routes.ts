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

import { Type, Static } from '@sinclair/typebox'
import { randomUUID } from 'crypto'
import { Router, Response } from 'express'
import { createReadStream } from 'fs'
import { pipeline } from 'stream/promises'
import { validate } from '../util/validate'
import multer from 'multer'
import { extname, join } from 'path'
import { fileURLToPath } from 'url'
import { CreateArtifactResponseBody } from '.'
import { env } from 'node:process'
import { storageEngine as GoogleCloudStorage } from 'multer-cloud-storage'

const destination = join(fileURLToPath(import.meta.url), '../../../uploads')
const TWENTY_FIVE_MEGABYTES = 26_214_400

const filename: Parameters<typeof multer['diskStorage']>[0]['filename'] = (_req, file, cb) => {
  cb(null, randomUUID() + extname(file.originalname))
}

const storage = env.GOOGLE_CLOUD_PROJECT != null
  ? GoogleCloudStorage({
    projectId: env.GOOGLE_CLOUD_PROJECT,
    keyFilename: '.gcs_key.json',
    filename,
    bucket: env.GOOGLE_CLOUD_BUCKET,
    uniformBucketLevelAccess: true,
    acl: 'publicRead'
  })
  : multer.diskStorage({
    destination,
    filename
  })

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Multer {
      interface File {
        // GCS link
        linkUrl?: string
      }
    }
  }
}

export default function deploymentArtifactsRoutes (router: Router): void {
  const upload = multer({
    limits: {
      fileSize: TWENTY_FIVE_MEGABYTES
    },
    storage
  })

  router.post(
    '/deployment-artifacts',
    upload.single('file'),
    async (req, res: Response<CreateArtifactResponseBody>, next) => {
      try {
        if (req.file == null) {
          return res.sendStatus(400)
        }

        let host = req.get('host')

        if (host == null) {
          return res.sendStatus(500)
        }

        const url = req.originalUrl
        let protocol = req.protocol

        // Adjust host and protocol in case of proxies
        if (req.headers['x-forwarded-host'] != null) {
          host = req.headers['x-forwarded-host'] as string
        }

        if (req.headers['x-forwarded-proto'] != null) {
          protocol = req.headers['x-forwarded-proto'] as string
        }

        const artifactUri = req.file.linkUrl ?? `${protocol}://${host}${url}/${req.file.filename}`
        return res.json({ artifactUri })
      } catch (e) {
        next(e)
      }
    }
  )

  const params = Type.Object(
    {
      artifactId: Type.String()
    },
    { additionalProperties: false }
  )

  router.get(
    '/deployment-artifacts/:artifactId',
    validate<unknown, Static<typeof params>>({ params }),
    async (req, res, next) => {
      try {
        const filename = req.params.artifactId
        const filePath = join(destination, filename)

        if (filePath.indexOf(destination) !== 0) {
          return res.sendStatus(404)
        }

        return await pipeline(createReadStream(filePath), res)
      } catch (e) {
        next(e)
      }
    }
  )
}
