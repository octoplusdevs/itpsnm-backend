import { makeSearchManyNotesUseCase } from '@/use-cases/factories/make-search-many-notes-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function searchMany(request: FastifyRequest, reply: FastifyReply) {
  const searchManyBodySchema = z.object({
    studentId: z.number().optional(),
    subjectId: z.number().optional(),
    level: z.enum(['CLASS_10', 'CLASS_11', 'CLASS_12', 'CLASS_13']).optional(),
  })

  const criteria = searchManyBodySchema.parse(request.query)

  try {
    const searchManyNotesUseCase = makeSearchManyNotesUseCase()
    const notes = await searchManyNotesUseCase.execute(criteria)
    return reply.status(200).send({ notes })
  } catch (err) {
    return reply.status(500).send({ message: 'Internal Server Error' })
  }
}
