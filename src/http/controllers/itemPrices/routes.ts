import { FastifyInstance } from 'fastify'
// import { create } from './create'
// import { destroy } from './destroy'
import { fetch } from './fetch'
import { get } from './get'

export async function itemPricesRoutes(app: FastifyInstance) {
  // app.post('/item-prices', create)
  app.get('/item-prices', fetch)
  // app.delete('/item-prices/:id', destroy)
  app.get('/item-prices/:id', get)
}
