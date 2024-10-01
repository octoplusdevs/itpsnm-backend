import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeFetchUsersUseCase } from '@/use-cases/factories/make-fetch-users-use-case';
import { Role } from '@prisma/client';

export async function fetch(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    role: z.nativeEnum(Role).default("STUDENT"),
    page: z.coerce.number().int().positive().optional(),
  })

  const { role, page = 1 } = registerBodySchema.parse(request.query)

  try {
    const fetchUserUseCase = makeFetchUsersUseCase();
    let users = await fetchUserUseCase.execute({
      role,
      page
    });

    return reply.status(200).send(users)

  } catch (err) {
    return reply.status(500).send(err);
  }

}
