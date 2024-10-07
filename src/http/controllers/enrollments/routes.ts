import { FastifyInstance } from 'fastify'
import { create } from './create'
import { destroy } from './destroy'
import { get } from './get'
import { fetch } from './fetch'
import { accessControlMiddleware } from '@/http/middlewares/verify-user-role'
import { Role } from '@prisma/client'
import { update } from './update'

export async function enrollmentsRoutes(app: FastifyInstance) {
  app.post('/enrollments', create)
  app.get('/enrollments/all', fetch)
  app.delete('/enrollments/:id',{ preHandler: accessControlMiddleware([Role.ADMIN])}, destroy)
  app.put('/enrollments/:id', update)
  app.get('/enrollments', get)
}
