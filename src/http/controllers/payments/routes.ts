import { FastifyInstance } from 'fastify'
import { payment } from './upload'

export async function documentsRoutes(app: FastifyInstance) {
  app.post('/payments/enrollments', payment)
}
