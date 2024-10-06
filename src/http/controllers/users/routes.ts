import { FastifyInstance } from 'fastify'
import { fetch } from './fetch'
import { blockUser } from './block'
import { resetPassword } from './reset-password'
import { get } from './get'
import { accessControlMiddleware } from '@/http/middlewares/verify-user-role'
import { Role } from '@prisma/client'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/users',{ preHandler: accessControlMiddleware([Role.ADMIN])}, fetch)
  app.get('/user',{ preHandler: accessControlMiddleware([Role.ADMIN])}, get)
  app.post('/users/block',{ preHandler: accessControlMiddleware([Role.ADMIN])}, blockUser)
  app.post('/users/reset-password',{ preHandler: accessControlMiddleware([Role.ADMIN])}, resetPassword)
}
