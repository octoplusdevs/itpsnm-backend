import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeFetchUsersUseCase } from '@/use-cases/factories/make-fetch-users-use-case';

export async function fetch(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    query: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
  })

  const { query = "", page = 1 } = registerBodySchema.parse(request.query)

  try {
    const fetchUserUseCase = makeFetchUsersUseCase();
    let users = await fetchUserUseCase.execute({
      query,
      page
    });

    return reply.status(200).send(users)

  } catch (err) {
    return reply.status(500).send(err);
  }

}
