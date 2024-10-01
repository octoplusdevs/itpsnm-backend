import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeFetchEmployeesUseCase } from '@/use-cases/factories/make-fetch-employees-use-case';

export async function fetch(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    query: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
  })

  const { page = 1 } = registerBodySchema.parse(request.query)

  try {
    const fetchEmployeesUseCase = makeFetchEmployeesUseCase();
    let employees = await fetchEmployeesUseCase.execute({
      page
    });

    return reply.status(200).send(employees)

  } catch (err) {
    return reply.status(500).send(err);
  }

}
