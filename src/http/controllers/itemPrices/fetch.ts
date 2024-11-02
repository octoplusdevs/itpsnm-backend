import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeFetchItemPricesUseCase } from '@/use-cases/factories/make-fetch-item-prices-use-case';

export async function fetch(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    query: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
  })

  const { query = "", page = 1 } = registerBodySchema.parse(request.query)

  try {
    const fetchItemPricesUseCase = makeFetchItemPricesUseCase();
    let itemPrices = await fetchItemPricesUseCase.execute({
      query,
      page
    });

    return reply.status(200).send(itemPrices)

  } catch (err) {
    return reply.status(500).send(err);
  }

}
