import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    payload: {}
    user: {
      role: 'ADMIN' | 'MEMBER'
      sub: string
    }
  }
}
