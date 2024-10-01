import { UserInvalidError } from '@/use-cases/errors/user-is-invalid-error'
import { makeResetUserPasswordUseCase } from '@/use-cases/factories/make-reset-user-password-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function resetPassword(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    email: z.string(),
    password: z.string().default("123456"),
  })

  const { email, password } = registerBodySchema.parse(request.body)

  try {
    const resetUserPasswordUseCase = makeResetUserPasswordUseCase()
    await resetUserPasswordUseCase.execute({
      email,
      password
    })
  } catch (err) {
    if (err instanceof UserInvalidError) {
      return reply.status(409).send({ message: err.message })
    }
    return reply.status(500).send(err)
  }

  return reply.status(201).send()
}
