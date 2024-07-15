import { FastifyInstance } from 'fastify'
import { create } from './create'
import { destroy } from './destroy'
import { get } from './get'
import { fetch } from './fetch'

export async function enrollmentsRoutes(app: FastifyInstance) {
  app.post('/enrollments', create)
  app.get('/enrollments', fetch)
  app.delete('/enrollments/:id', destroy)
  app.get('/enrollments/:id', get)
}
