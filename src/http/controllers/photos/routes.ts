import { FastifyInstance } from 'fastify'
import { upload } from './upload'

export async function photosRoutes(app: FastifyInstance) {
  app.post('/uploads/photos', upload)
}
