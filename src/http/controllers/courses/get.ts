import { CourseNotFoundError } from '@/use-cases/errors/course-not-found'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { makeGetCourseUseCase } from '@/use-cases/factories/make-get-course-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function get(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    id: z.coerce.number(),
  })

  const { id } = registerBodySchema.parse(request.params)

  try {
    const getCourseUseCase = makeGetCourseUseCase()
    const course = await getCourseUseCase.execute({
      courseId: id
    })
    return reply.send(course)

  } catch (err) {
    if (err instanceof CourseNotFoundError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    return reply.status(500).send(err)
  }

}
