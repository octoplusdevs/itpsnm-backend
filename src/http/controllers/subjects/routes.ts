import { FastifyInstance } from 'fastify'
import { create } from './create'
import { destroy } from './destroy'
import { fetch } from './fetch'
import { get } from './get'

export async function subjectsRoutes(app: FastifyInstance) {
  // app.post('/subjects', create)
  app.get('/subjects', fetch)
  // app.delete('/subjects/:id', destroy)
  app.get('/subjects/:id', get)
}
