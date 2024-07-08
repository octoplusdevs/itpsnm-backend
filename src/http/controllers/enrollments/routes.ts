import { FastifyInstance } from 'fastify'
import { create } from './create'

export async function coursesRoutes(app: FastifyInstance) {
  app.post('/enrollments', create)
}
