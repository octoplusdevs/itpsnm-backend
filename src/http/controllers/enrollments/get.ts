import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeGetEnrollmentUseCase } from '@/use-cases/factories/make-get-enrollment-use-case';
import { EnrollmentNotFoundError } from '@/use-cases/errors/enrollment-not-found';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found';

export async function get(request: FastifyRequest, reply: FastifyReply) {
  const createEnrollmentSchema = z.object({
    enrollmentNumber: z.coerce.number().optional(),
    identityCardNumber: z.coerce.string().optional(),
  });
  const {
    enrollmentNumber,
    identityCardNumber
  } = createEnrollmentSchema.parse(request.query);

  try {
    const getEnrollmentUseCase = makeGetEnrollmentUseCase();
    let enrollment = await getEnrollmentUseCase.execute({
      enrollmentNumber,
      identityCardNumber
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
