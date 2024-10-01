import { FastifyInstance } from 'fastify'
import { fetch } from './fetch'
import { blockUser } from './block'
import { resetPassword } from './reset-password'
import { get } from './get'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/users', fetch)
  app.get('/user', get)
  app.post('/users/block', blockUser)
  app.post('/users/reset-password', resetPassword)
}
