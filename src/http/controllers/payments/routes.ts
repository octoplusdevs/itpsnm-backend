import { FastifyInstance } from 'fastify'
import { create } from './create'
import { approvePayment } from './approve'

export async function paymentsRoutes(app: FastifyInstance) {
  app.post('/payments', create)
  app.post('/payments/approve', approvePayment)
}
