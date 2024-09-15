import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreateNoteUseCase } from '@/use-cases/factories/make-create-note-use-case'
import { NoteAlreadyExistsError } from '@/use-cases/errors/note-already-exists-error'
import { EnrollmentNotFoundError } from '@/use-cases/errors/enrollment-not-found'
import { SubjectNotFoundError } from '@/use-cases/errors/subject-not-found'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createNoteBodySchema = z.object({
    pf1: z.number().default(0),
    pf2: z.number().default(0),
    pft: z.number().default(0),
    ps1: z.number().default(0),
    ps2: z.number().default(0),
    pst: z.number().default(0),
    pt1: z.number().default(0),
    pt2: z.number().default(0),
    ptt: z.number().default(0),
    nee: z.number().default(0),
    resource: z.number().optional(),
    level: z.enum(['CLASS_10', 'CLASS_11', 'CLASS_12', 'CLASS_13']),
    enrollmentId: z.number(),
    subjectId: z.number(),
  });

  const { pf1, nee, pf2, pft, ps1, ps2, pst, pt1, pt2, ptt, resource, level, enrollmentId, subjectId } = createNoteBodySchema.parse(request.body)
  try {
    console.log("1111")
    const createNoteUseCase = makeCreateNoteUseCase()

    const { note } = await createNoteUseCase.execute({
      pf1, nee, pf2, pft, ps1, ps2, pst, pt1, pt2, ptt,
      resource,
      level,
      enrollmentId,
      subjectId
    })
    return reply.status(200).send(note)
  } catch (err) {
    if (err instanceof NoteAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof EnrollmentNotFoundError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof SubjectNotFoundError) {
      return reply.status(409).send({ message: err.message })
    }
    console.log(err)
    return reply.status(500).send({ message: 'Internal Server Error' })
  }

}
