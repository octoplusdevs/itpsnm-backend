import { AdminCantChangeOtherAdminsPasswordError } from '@/use-cases/errors/admin-cant-update-password-others-admin-error'
import { IncorrectPasswordError } from '@/use-cases/errors/password-is-incorrect'
import { StudentCanOnlyChangeTheirPasswordError } from '@/use-cases/errors/student-can-only-update-password-himselferror'
import { UserInvalidError } from '@/use-cases/errors/user-is-invalid-error'
import { makeResetUserPasswordUseCase } from '@/use-cases/factories/make-reset-user-password-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function resetPassword(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    email: z.string(),
    currentPassword: z.string().optional(),
    newPassword: z.string().default("123456"),
  })

  const { email, currentPassword, newPassword } = registerBodySchema.parse(request.body)

  try {
    const resetUserPasswordUseCase = makeResetUserPasswordUseCase()
    console.log("AAAAAA",request.user?.id)
    await resetUserPasswordUseCase.execute({
      email,
      currentPassword,
      newPassword,
      loggedInUserId: request.user?.id,
      loggedInUserRole: request.user.role,
    })
  } catch (err) {
    if (err instanceof UserInvalidError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof IncorrectPasswordError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof AdminCantChangeOtherAdminsPasswordError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof StudentCanOnlyChangeTheirPasswordError) {
      return reply.status(409).send({ message: err.message })
    }
    return reply.status(500).send(err)
  }

  return reply.status(201).send()
}
