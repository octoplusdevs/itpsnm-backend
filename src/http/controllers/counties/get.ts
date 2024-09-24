import { CountyNotFoundError } from '@/use-cases/errors/county-not-found'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found'
import { makeGetCountyUseCase } from '@/use-cases/factories/make-get-county-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function get(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    id: z.coerce.number(),
  })

  const { id } = registerBodySchema.parse(request.params)

  try {
    const getCountyUseCase = makeGetCountyUseCase()
    const county = await getCountyUseCase.execute({
      countyId: id
    })
    return reply.send(county)

  } catch (err) {
    if (err instanceof CountyNotFoundError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }
    return reply.status(500).send(err)
  }

}
