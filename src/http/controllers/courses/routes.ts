import { FastifyInstance } from 'fastify'
import { create } from './create'
import { destroy } from './destroy'

export async function coursesRoutes(app: FastifyInstance) {
  app.post('/courses', create)
  app.delete('/courses/:id', destroy)
}
