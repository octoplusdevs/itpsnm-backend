import { FastifyInstance } from 'fastify'
import { create } from './create'
import { fetch } from './fetch'
import { Role } from '@prisma/client'
import { accessControlMiddleware } from '@/http/middlewares/verify-user-role'

export async function studentsRoutes(app: FastifyInstance) {
  app.post('/students', create)
  app.get('/students',{ preHandler: accessControlMiddleware([Role.ADMIN, Role.TEACHER, Role.EMPLOYEE])}, fetch)
}
