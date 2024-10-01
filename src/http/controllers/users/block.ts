import { UserInvalidError } from '@/use-cases/errors/user-is-invalid-error'
import { makeBlockUserUseCase } from '@/use-cases/factories/make-block-user-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function blockUser(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    status: z.boolean(),
    email: z.string(),
  })

  const { email, status } = registerBodySchema.parse(request.body)

  try {
    const blockUserUseCase = makeBlockUserUseCase()
    await blockUserUseCase.execute({
      email, status,
    })
  } catch (err) {
    if (err instanceof UserInvalidError) {
      return reply.status(409).send({ message: err.message })
    }
    return reply.status(500).send(err)
  }

  return reply.status(201).send()
}
