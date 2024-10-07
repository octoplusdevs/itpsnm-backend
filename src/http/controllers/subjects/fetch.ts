import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeFetchSubjectUseCase } from '@/use-cases/factories/make-fetch-subjects-use-case';

export async function fetch(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    query: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
  })

  const { query = "", page = 1 } = registerBodySchema.parse(request.query)

  try {
    const fetchSubjectUseCase = makeFetchSubjectUseCase();
    let subjects = await fetchSubjectUseCase.execute({
      name: query,
      page
    });

    return reply.status(200).send(subjects)

  } catch (err) {
    return reply.status(500).send(err);
  }

}
