import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeFetchEnrollmentUseCase } from '@/use-cases/factories/make-fetch-enrollment-use-case';

export async function fetch(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    docsState: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
    paymentState: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
    page: z.coerce.number().int().positive().optional(),
  })

  const { paymentState, docsState,  page = 1 } = registerBodySchema.parse(request.query)

  try {
    const fetchEnrollmentUseCase = makeFetchEnrollmentUseCase();
    let enrollments = await fetchEnrollmentUseCase.execute({
      docsState: docsState || 'PENDING',
      paymentState: paymentState || 'PENDING',
      page
    });

    return reply.status(200).send(enrollments)

  } catch (err) {
    return reply.status(500).send({ err });
  }

}
