import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreateNoteUseCase } from '@/use-cases/factories/make-create-note-use-case'
import { NoteAlreadyExistsError } from '@/use-cases/errors/note-already-exists-error'
import { EnrollmentNotFoundError } from '@/use-cases/errors/enrollment-not-found'
import { SubjectNotFoundError } from '@/use-cases/errors/subject-not-found'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createNoteBodySchema = z.object({
    pf1: z.number().optional(),
    pf2: z.number().optional(),
    pft: z.number().optional(),
    ps1: z.number().optional(),
    ps2: z.number().optional(),
    ims: z.number().optional(),
    pst: z.number().optional(),
    pt1: z.number().optional(),
    pt2: z.number().optional(),
    ptt: z.number().optional(),
    nee: z.number().optional(),
    resource: z.number().optional(),
    level: z.enum(['CLASS_10', 'CLASS_11', 'CLASS_12', 'CLASS_13']),
    enrollmentId: z.number(),
    subjectId: z.number(),
  });

  const { pf1, nee, pf2, pft, ps1, ps2, ims, pst, pt1, pt2, ptt, resource, level, enrollmentId, subjectId } = createNoteBodySchema.parse(request.body)
  try {
    const createNoteUseCase = makeCreateNoteUseCase()

    const { note } = await createNoteUseCase.execute({
      pf1, nee, pf2, pft, ps1, ps2, pst, pt1, ims, pt2, ptt,
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
    // console.log(err)
    return reply.status(500).send({ message: 'Internal Server Error' })
  }

}
