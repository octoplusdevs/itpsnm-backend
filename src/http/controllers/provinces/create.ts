import { ProvinceAlreadyExistsError } from '@/use-cases/errors/province-already-exists-error'
import { makeProvinceUseCase } from '@/use-cases/factories/make-province-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
  })

  const { name } = registerBodySchema.parse(request.body)

  try {
    const provinceUseCase = makeProvinceUseCase()
    await provinceUseCase.execute({
      name,
    })
  } catch (err) {
    if (err instanceof ProvinceAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    return reply.status(500).send(err)
  }

  return reply.status(201).send()
}
