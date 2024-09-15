import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { EnrollmentNotFoundError } from '@/use-cases/errors/enrollment-not-found';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found';
import { makeGetEnrollmentByIdentityCardUseCase } from '@/use-cases/factories/make-get-enrollment-by-identity-card-use-case';

export async function getByIdentityCard(request: FastifyRequest, reply: FastifyReply) {
  const createEnrollmentSchema = z.object({
    identityCardNumber: z.string(),
  });
  const {
    identityCardNumber,
  } = createEnrollmentSchema.parse(request.params);

  try {
    const getEnrollmentUseCase = makeGetEnrollmentByIdentityCardUseCase();
    let enrollment = await getEnrollmentUseCase.execute({
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
