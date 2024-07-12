import { FastifyInstance } from 'fastify'
import { create } from './create'

export async function enrollmentsRoutes(app: FastifyInstance) {
  app.post('/enrollments', create)
}
