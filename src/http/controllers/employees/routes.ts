import { FastifyInstance } from 'fastify'
import { create } from './create'
import { fetch } from './fetch'

export async function employeesRoutes(app: FastifyInstance) {
  // app.post('/employees', create)
  app.get('/employees', fetch)
}
