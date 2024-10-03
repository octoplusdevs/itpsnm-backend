import { FastifyInstance } from 'fastify'
import { create } from './create'
import { fetch } from './fetch'
import { update } from './update'
import { fetchById } from './fetch-by-id'

export async function employeesRoutes(app: FastifyInstance) {
  app.put('/employees/:id', update)
  app.get('/employees/:id', fetchById)
  app.post('/employees', create)
  app.get('/employees', fetch)
}
