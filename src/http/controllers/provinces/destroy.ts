import { ProvinceNotFoundError } from '@/use-cases/errors/province-not-found'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { makeDestroyProvinceUseCase } from '@/use-cases/factories/make-destroy-province-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function destroy(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    id: z.coerce.number(),
  })

  const { id } = registerBodySchema.parse(request.params)

  try {
    const provinceUseCase = makeDestroyProvinceUseCase()
    await provinceUseCase.execute({
      id,
    })
  } catch (err) {
    if (err instanceof ProvinceNotFoundError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    return reply.status(500).send(err)
  }

  return reply.status(201).send()
}
