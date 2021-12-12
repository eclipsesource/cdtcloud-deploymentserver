import { Type, Static } from '@sinclair/typebox'
import { randomUUID } from 'crypto'
import { Router } from 'express'
import { createReadStream } from 'fs'
import { pipeline } from 'stream/promises'
import { validate } from '../util/validate'
import multer from 'multer'
import { extname, join } from 'path'

const destination = 'uploads/'

export default function deploymentArtifactsRoutes (router: Router): void {
  const upload = multer({
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
    async (req, res, next) => {
      try {
        if (req.file == null) {
          return res.sendStatus(400)
        }

        const host = req.get('host')

        if (host == null) {
          return res.sendStatus(500)
        }

        const { protocol, originalUrl: url } = req

        const artifactUri =
          `${protocol}://${host}${url}/${req.file.filename}`
        return res.json({ artifactUri })
      } catch (e) {
        next(e)
      }
    }
  )

  const params = Type.Object({
    artifactId: Type.String()
  }, { additionalProperties: false })

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
