import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeFetchCountyUseCase } from '@/use-cases/factories/make-fetch-county-use-case';

export async function fetch(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    query: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
  })

  const { query = "", page = 1 } = registerBodySchema.parse(request.query)

  try {
    const fetchCountyUseCase = makeFetchCountyUseCase();
    let counties = await fetchCountyUseCase.execute({
      name: query,
      page
    });

    return reply.status(200).send(counties)

  } catch (err) {
    return reply.status(500).send(err);
  }

}
