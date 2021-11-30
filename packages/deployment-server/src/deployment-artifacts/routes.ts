import { Type, Static } from '@sinclair/typebox'
import { randomUUID } from 'crypto'
import { Router } from 'express'
import { createReadStream } from 'fs'
import { pipeline } from 'stream/promises'
import { validate } from '../util/validate'
import multer from 'multer'

export default function deploymentArtifactsRoutes (router: Router): void {
  const upload = multer({
    storage: multer.diskStorage({
      destination: 'uploads/',
      filename: (_req, _file, cb) => {
        cb(null, randomUUID())
      }
    })
  })

  router.post('/deployment-artifacts', upload.single('file'), async (req, res, next) => {
    try {
      if (req.file == null) {
        return res.sendStatus(400)
      }

      const artifactUri = `${req.protocol}://${req.get('host') ?? ''}${req.originalUrl}/${req.file.filename}`
      return res.json({ artifactUri })
    } catch (e) {
      console.error(e)
      next(e)
    }
  })

  const params = Type.Object({
    artifactId: Type.String({ format: 'uuid' })
  }, { additionalProperties: false })

  router.get('/deployment-artifacts/:artifactId', validate<unknown, Static<typeof params>>({ params }), async (req, res, next) => {
    try {
      const filename = req.params.artifactId

      // validation rejects escape attempts
      const filePath = `uploads/${filename}`

      return await pipeline(
        createReadStream(filePath),
        res
      )
    } catch (e) {
      next(e)
    }
  })
}
