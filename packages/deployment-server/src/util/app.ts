import express from 'express'
import { pinoHttp } from './logger'
import deviceRoutes from '../devices'

export const app = express()

app.disable('x-powered-by')
app.disable('etag')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(pinoHttp)

deviceRoutes(app)
