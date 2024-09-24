import { ProvinceNotFoundError } from '@/use-cases/errors/province-not-found'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { makeGetProvinceUseCase } from '@/use-cases/factories/make-get-province-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function get(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    id: z.coerce.number(),
  })

  const { id } = registerBodySchema.parse(request.params)

  try {
    const getProvinceUseCase = makeGetProvinceUseCase()
    const province = await getProvinceUseCase.execute({
      provinceId: id
    })
    return reply.send(province)

  } catch (err) {
    if (err instanceof ProvinceNotFoundError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    return reply.status(500).send(err)
  }

}
