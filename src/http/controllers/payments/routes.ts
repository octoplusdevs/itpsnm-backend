import { FastifyInstance } from 'fastify'
import { create } from './create'

export async function paymentsRoutes(app: FastifyInstance) {
  app.post('/payments', create)
}
