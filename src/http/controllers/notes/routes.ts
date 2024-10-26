import { FastifyInstance } from 'fastify'
import { create } from './add-note'
// import { destroy } from './destroy'
import { searchMany } from './search-many'
import { getNoteWithFullGrades } from './get-note-with-full-grades'
import { accessControlMiddleware } from '@/http/middlewares/verify-user-role'
import { Role } from '@prisma/client'
import { filterTuitionInvoicesMiddleware } from '@/http/middlewares/verify-pending-invoices'

export async function notesRoutes(app: FastifyInstance) {
  app.post('/notes', { preHandler: accessControlMiddleware([Role.ADMIN, Role.TEACHER]) }, create)

  // app.delete('/notes/:id', destroy)

  app.get('/notes/search', {
    preHandler: [
      accessControlMiddleware([Role.ADMIN, Role.TEACHER, Role.STUDENT]),
      filterTuitionInvoicesMiddleware
    ]
  }, searchMany)

  app.get('/notes/:enrollmentId/grades', {
    preHandler: [
      accessControlMiddleware([Role.ADMIN, Role.TEACHER, Role.STUDENT]),
      filterTuitionInvoicesMiddleware
    ]
  }, getNoteWithFullGrades)
}
