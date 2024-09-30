import { FastifyInstance } from 'fastify'
import { fetch } from './fetch'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/users', fetch)
}
