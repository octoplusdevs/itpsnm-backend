import { CountyAlreadyExistsError } from '@/use-cases/errors/county-already-exists-error'
import { makeCountyUseCase } from '@/use-cases/factories/make-county-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
  })

  const { name } = registerBodySchema.parse(request.body)

  try {
    const countyUseCase = makeCountyUseCase()
    await countyUseCase.execute({
      name,
    })
  } catch (err) {
    if (err instanceof CountyAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    return reply.status(500).send(err)
  }

  return reply.status(201).send()
}
