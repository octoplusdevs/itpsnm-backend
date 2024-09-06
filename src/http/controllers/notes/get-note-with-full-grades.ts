import { EnrollmentNotFoundError } from '@/use-cases/errors/enrollment-not-found'
import { makeGetEnrollmentUseCase } from '@/use-cases/factories/make-get-enrollment-use-case'
import { makeGetNoteWithFullGradesUseCase } from '@/use-cases/factories/make-get-note-with-full-grades-use-case'
import { makeStudentUseCase } from '@/use-cases/factories/make-student-use-case'
import { LevelName } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getNoteWithFullGrades(request: FastifyRequest, reply: FastifyReply) {
  // Definição do esquema de validação para os parâmetros
  const getNoteWithFullGradesParamsSchema = z.object({
    enrollmentId: z.coerce.number(),
  })

  const getNoteWithFullGradesBodySchema = z.object({
    classLevel: z.nativeEnum(LevelName)  // Use z.nativeEnum para enums
  })

  const { classLevel } = getNoteWithFullGradesBodySchema.parse(request.query)
  const { enrollmentId } = getNoteWithFullGradesParamsSchema.parse(request.params)
  try {
    // Criação do caso de uso
    const getNoteWithFullGradesUseCase = makeGetNoteWithFullGradesUseCase()
    const getStudentByEnrollmentId = makeGetEnrollmentUseCase()
    // Execução do caso de uso
    const { enrollment } = await getStudentByEnrollmentId.execute({ enrollmentId })
    const { note } = await getNoteWithFullGradesUseCase.execute({ studentId: enrollment?.student?.id, classLevel })
    // Retorno da resposta
    if (note) {
      return reply.status(200).send({
        notes: note
      })
    } else {
      return reply.status(404).send({ message: 'Note not found' })
    }
  } catch (err) {
    if (err instanceof EnrollmentNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    return reply.status(500).send({ message: 'Internal Server Error' })
  }
}
