import { makeGetNoteWithFullGradesUseCase } from '@/use-cases/factories/make-get-note-with-full-grades-use-case'
import { LevelName } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getNoteWithFullGrades(request: FastifyRequest, reply: FastifyReply) {
  // Definição do esquema de validação para os parâmetros
  const getNoteWithFullGradesParamsSchema = z.object({
    studentId: z.number(),
    classLevel: z.nativeEnum(LevelName)  // Use z.nativeEnum para enums
  })

  // Desestruturação dos parâmetros
  const { studentId, classLevel } = getNoteWithFullGradesParamsSchema.parse(request.params)

  try {
    // Criação do caso de uso
    const getNoteWithFullGradesUseCase = makeGetNoteWithFullGradesUseCase()
    // Execução do caso de uso
    const note = await getNoteWithFullGradesUseCase.execute({ studentId, classLevel })
    // Retorno da resposta
    if (note) {
      return reply.status(200).send(note)
    } else {
      return reply.status(404).send({ message: 'Note not found' })
    }
  } catch (err) {
    return reply.status(500).send({ message: 'Internal Server Error' })
  }
}
