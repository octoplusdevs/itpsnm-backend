import { FastifyInstance } from 'fastify'
import { create } from './create'
import { destroy } from './destroy'
import { fetch } from './fetch'
import { get } from './get'

export async function coursesRoutes(app: FastifyInstance) {
  app.post('/classes', create)
  app.get('/classes', fetch)
  app.delete('/classes/:id', destroy)
  app.get('/classes/:id', get)
  app.put('/classes/:id', get)
}
