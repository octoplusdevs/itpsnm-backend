import { FastifyInstance } from 'fastify'
import { upload } from './upload'

export async function documentsRoutes(app: FastifyInstance) {
  app.post('/uploads/enrollments', upload)
}
