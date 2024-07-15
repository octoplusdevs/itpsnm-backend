import { FastifyInstance } from 'fastify'
import { create } from './create'
import { fetch } from './fetch'

export async function studentsRoutes(app: FastifyInstance) {
  app.post('/students', create)
  app.get('/students', fetch)
}
