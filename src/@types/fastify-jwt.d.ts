import '@fastify/jwt'
import { Role } from '@prisma/client'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    payload: {}
    user: {
      role: Role
    }
  }
}
