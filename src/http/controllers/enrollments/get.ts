import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeGetEnrollmentUseCase } from '@/use-cases/factories/make-get-enrollment-use-case';
import { EnrollmentNotFoundError } from '@/use-cases/errors/enrollment-not-found';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found';

export async function get(request: FastifyRequest, reply: FastifyReply) {
  const createEnrollmentSchema = z.object({
    id: z.coerce.number(),
  });
  const {
    id,
  } = createEnrollmentSchema.parse(request.params);

  try {
    const getEnrollmentUseCase = makeGetEnrollmentUseCase();
    let enrollment = await getEnrollmentUseCase.execute({
      enrollmentId: Number(id)
    });

    return reply.status(201).send(enrollment)

  } catch (err) {
    if (err instanceof EnrollmentNotFoundError) {
      return reply.status(404).send({ message: err.message });
    } else if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    return reply.status(500).send(err);
  }

  return reply.status(201).send();
}
