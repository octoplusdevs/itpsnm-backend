import { FastifyInstance } from 'fastify'
import { create } from './add-note'
// import { destroy } from './destroy'
import { searchMany } from './search-many'
import { getNoteWithFullGrades } from './get-note-with-full-grades'

export async function notesRoutes(app: FastifyInstance) {
  app.post('/notes', create)

  // app.delete('/notes/:id', destroy)

  app.get('/notes/search', searchMany)

  app.get('/notes/:studentId/grades', getNoteWithFullGrades)
}
