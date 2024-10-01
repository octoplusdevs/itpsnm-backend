import { UserNotFoundError } from '@/use-cases/errors/user-not-found'
import { makeGetUserUseCase } from '@/use-cases/factories/make-get-user-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function get(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    email: z.string(),
  })

  const { email } = registerBodySchema.parse(request.query)

  try {
    const getUserUseCase = makeGetUserUseCase()
    const user = await getUserUseCase.execute({
      email
    })
    return reply.send(user)

  } catch (err) {
    if (err instanceof UserNotFoundError) {
      return reply.status(409).send({ message: err.message })
    }

    return reply.status(500).send(err)
  }

}
