import { FastifyInstance } from 'fastify'
import { create } from './create'
import { destroy } from './destroy'
import { get } from './get'
import { fetch } from './fetch'
import { accessControlMiddleware } from '@/http/middlewares/verify-user-role'
import { Role } from '@prisma/client'

export async function enrollmentsRoutes(app: FastifyInstance) {
  app.post('/enrollments', create)
  app.get('/enrollments/all', fetch)
  app.delete('/enrollments/:id',{ preHandler: accessControlMiddleware([Role.ADMIN])}, destroy)
  app.get('/enrollments', get)
}
