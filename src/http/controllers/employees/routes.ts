import { FastifyInstance } from 'fastify'
import { create } from './create'
import { fetch } from './fetch'
import { update } from './update'
import { fetchById } from './fetch-by-id'
import { accessControlMiddleware } from '@/http/middlewares/verify-user-role'
import { Role } from '@prisma/client'

export async function employeesRoutes(app: FastifyInstance) {
  app.put('/employees/:id',{ preHandler: accessControlMiddleware([Role.ADMIN])}, update)
  app.get('/employees/:id',{ preHandler: accessControlMiddleware([Role.ADMIN])}, fetchById)
  app.post('/employees',{ preHandler: accessControlMiddleware([Role.ADMIN])}, create)
  app.get('/employees',{ preHandler: accessControlMiddleware([Role.ADMIN])}, fetch)
}
