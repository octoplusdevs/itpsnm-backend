import { makeFindTransactionByNumberUseCase } from '@/use-cases/factories/make-find-transaction-by-number-use-case';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

export async function findTransactionByNumber(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    transactionNumber: z.string(),
  });

  const { transactionNumber } = paramsSchema.parse(request.params);

  try {
    const findTransactionByNumberUseCase = makeFindTransactionByNumberUseCase();
    const transaction = await findTransactionByNumberUseCase.execute(transactionNumber);

    return reply.status(200).send(transaction);
  } catch (err) {
    return reply.status(404).send({ message: 'Transaction not found.' });
  }
}
