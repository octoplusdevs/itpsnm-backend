import { FastifyInstance } from 'fastify'
import { create } from './create'
import { destroy } from './destroy'
import { get } from './get'
import { fetch } from './fetch'
import { getByIdentityCard } from './get-by-identity-card'

export async function enrollmentsRoutes(app: FastifyInstance) {
  app.post('/enrollments', create)
  app.get('/enrollments', fetch)
  app.delete('/enrollments/:id', destroy)
  app.get('/enrollment', get)
}
