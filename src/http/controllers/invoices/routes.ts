import { FastifyInstance } from 'fastify'
import { create } from './create'

export async function invoicesRoutes(app: FastifyInstance) {
  app.post('/invoices', create)
}
