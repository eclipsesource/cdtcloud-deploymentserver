import { Router } from 'express'
import { validate } from '../util/validate'

export default (router: Router): void => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.get('/devices', validate({}), async (req, res) => {
    req.log.info('GET /devices')

    res.json([
      {
        id: '1',
        name: 'Device 1',
        type: 'device',
        status: 'online',
        last_seen: '2020-01-01T00:00:00.000Z',
        last_seen_at: '2020-01-01T00:00:00.000Z',
        last_seen_ip: ''
      }
    ]
    )
  })
}
