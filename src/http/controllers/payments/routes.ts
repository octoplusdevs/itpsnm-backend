import { FastifyInstance } from 'fastify'
import { payment } from './upload'

export async function paymentsRoutes(app: FastifyInstance) {
  app.post('/payments/enrollments', payment)
}
