import { FastifyInstance } from 'fastify'
import { create } from './create'

export async function studentsRoutes(app: FastifyInstance) {
  app.post('/students', create)
}
