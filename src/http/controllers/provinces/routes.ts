import { FastifyInstance } from 'fastify'
import { create } from './create'
import { destroy } from './destroy'
import { fetch } from './fetch'

export async function provincesRoutes(app: FastifyInstance) {
  app.post('/provinces', create)
  app.get('/provinces', fetch)
  app.delete('/provinces/:id', destroy)
}
