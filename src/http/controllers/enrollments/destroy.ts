import { EnrollmentNotFoundError } from '@/use-cases/errors/enrollment-not-found'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { makeDestroyEnrollmentUseCase } from '@/use-cases/factories/make-destroy-enrollment-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function destroy(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    id: z.coerce.number(),
  })

  const { id } = registerBodySchema.parse(request.params)

  try {
    const enrollmentUseCase = makeDestroyEnrollmentUseCase()
    await enrollmentUseCase.execute({
      enrollmentId: id
    })
  } catch (err) {
    if (err instanceof EnrollmentNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    return reply.status(500).send(err)
  }

  return reply.status(201).send()
}
