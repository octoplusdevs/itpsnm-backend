import { makeFindTransactionsByStudentUseCase } from '@/use-cases/factories/make-find-transactions-by-student-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function findTransactionsByStudent(request: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({
    page: z.coerce.number().int().positive().optional().default(1),
  });
  const paramsSchema = z.object({
    enrollmentId: z.coerce.number(),
  });

  const { enrollmentId } = paramsSchema.parse(request.params);
  const { page } = querySchema.parse(request.query);

  try {
    const findTransactionsByStudentUseCase = makeFindTransactionsByStudentUseCase();
    const transactions = await findTransactionsByStudentUseCase.execute({ enrollmentId, page });

    return reply.status(200).send(transactions);
  } catch (err) {
    return reply.status(404).send({ message: 'No transactions found for this student.' });
  }
}
