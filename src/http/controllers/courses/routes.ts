import { FastifyInstance } from 'fastify'
import { create } from './create'
import { destroy } from './destroy'
import { fetch } from './fetch'
import { get } from './get'

export async function coursesRoutes(app: FastifyInstance) {
  app.post('/courses', create)
  app.get('/courses', fetch)
  app.delete('/courses/:id', destroy)
  app.get('/courses/:id', get)
}
