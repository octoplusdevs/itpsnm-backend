import { CourseAlreadyExistsError } from '@/use-cases/errors/course-already-exists-error'
import { makeCourseUseCase } from '@/use-cases/factories/make-course-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
  })

  const { name } = registerBodySchema.parse(request.body)

  try {
    const courseUseCase = makeCourseUseCase()
    await courseUseCase.execute({
      name,
    })
  } catch (err) {
    if (err instanceof CourseAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    return reply.status(500).send(err)
  }

  return reply.status(201).send()
}
