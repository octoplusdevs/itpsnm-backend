import { FastifyInstance } from 'fastify'
import { create } from './create'
import { destroy } from './destroy'
import { fetch } from './fetch'
import { get } from './get'

export async function countiesRoutes(app: FastifyInstance) {
  app.post('/counties', create)
  app.get('/counties', fetch)
  app.delete('/counties/:id', destroy)
  app.get('/counties/:id', get)
}
