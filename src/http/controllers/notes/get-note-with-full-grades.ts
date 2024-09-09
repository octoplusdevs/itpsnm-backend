import { EnrollmentNotFoundError } from '@/use-cases/errors/enrollment-not-found'
import { makeGetNoteWithFullGradesUseCase } from '@/use-cases/factories/make-get-note-with-full-grades-use-case'
import { LevelName, Mester } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getNoteWithFullGrades(request: FastifyRequest, reply: FastifyReply) {
  // Definição do esquema de validação para os parâmetros
  const getNoteWithFullGradesParamsSchema = z.object({
    enrollmentId: z.coerce.number(),
  })

  const getNoteWithFullGradesQueriesSchema = z.object({
    level: z.nativeEnum(LevelName),  // Use z.nativeEnum para enums
    mester: z.nativeEnum(Mester).default('FIRST'), // Use z.nativeEnum para enums
    subjectId: z.coerce.number()  // Use z.nativeEnum para enums
  })

  const { level, mester, subjectId } = getNoteWithFullGradesQueriesSchema.parse(request.query)
  const { enrollmentId } = getNoteWithFullGradesParamsSchema.parse(request.params)
  try {
    // Criação do caso de uso
    const getNoteWithFullGradesUseCase = makeGetNoteWithFullGradesUseCase()
    // const getEnrollmentUseCase = makeGetEnrollmentUseCase()
    // Execução do caso de uso
    // const { enrollment } = await getEnrollmentUseCase.execute({ enrollmentId })

    const { note } = await getNoteWithFullGradesUseCase.execute({
      enrollmentId, level,
      mester: mester,
      subjectId: subjectId
    })
    // Retorno da resposta
    return reply.status(200).send({
      notes: note
    })


  } catch (err) {
    if (err instanceof EnrollmentNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    return reply.status(500).send({ message: 'Internal Server Error' })
  }
}
