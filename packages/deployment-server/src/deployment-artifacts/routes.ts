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

const destination = join(fileURLToPath(import.meta.url), '../../../uploads')
const TWENTY_FIVE_MEGABYTES = 26_214_400

export default function deploymentArtifactsRoutes (router: Router): void {
  const upload = multer({
    limits: {
      fileSize: TWENTY_FIVE_MEGABYTES
    },
    storage: multer.diskStorage({
      destination,
      filename: (_req, file, cb) => {
        cb(null, randomUUID() + extname(file.originalname))
      }
    })
  })

  router.post(
    '/deployment-artifacts',
    upload.single('file'),
    async (req, res: Response<CreateArtifactResponseBody>, next) => {
      try {
        if (req.file == null) {
          return res.sendStatus(400)
        }

        const host = req.get('host')

        if (host == null) {
          return res.sendStatus(500)
        }

        const { protocol, originalUrl: url } = req

        const artifactUri = `${protocol}://${host}${url}/${req.file.filename}`
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
