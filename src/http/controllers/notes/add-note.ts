import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreateNoteUseCase } from '@/use-cases/factories/make-create-note-use-case'
import { NoteAlreadyExistsError } from '@/use-cases/errors/note-already-exists-error'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createNoteBodySchema = z.object({
    p1: z.number().optional(),
    p2: z.number().optional(),
    exam: z.number().optional(),
    resource: z.number().optional(),
    mester: z.enum(['FIRST', 'SECOND', 'THIRD']),
    level: z.enum(['CLASS_10', 'CLASS_11', 'CLASS_12', 'CLASS_13']),
    studentId: z.number(),
    subjectId: z.number(),
  })

  const { p1, p2, exam, resource, mester, level, studentId, subjectId } = createNoteBodySchema.parse(request.body)

  try {
    const createNoteUseCase = makeCreateNoteUseCase()
    await createNoteUseCase.execute({
      p1,
      p2,
      exam,
      resource,
      mester,
      level,
      studentId,
      subjectId
    })
  } catch (err) {
    if (err instanceof NoteAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    return reply.status(500).send({ message: 'Internal Server Error' })
  }

  return reply.status(201).send({ message: 'Note created successfully' })
}
