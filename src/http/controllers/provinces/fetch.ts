import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeFetchProvinceUseCase } from '@/use-cases/factories/make-fetch-province-use-case';

export async function fetch(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    query: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
  })

  const { query = "", page = 1 } = registerBodySchema.parse(request.query)

  try {
    const fetchProvinceUseCase = makeFetchProvinceUseCase();
    let provinces = await fetchProvinceUseCase.execute({
      name: query,
      page
    });

    return reply.status(200).send(provinces)

  } catch (err) {
    return reply.status(500).send(err);
  }

}
