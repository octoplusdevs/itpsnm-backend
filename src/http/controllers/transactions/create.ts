import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { TransactionWasUsedError } from '@/use-cases/errors/transaction-was-used-error';
import { makeCreateTransactionUseCase } from '@/use-cases/factories/make-create-transaction-use-case';
import { EmployeeNotFoundError } from '@/use-cases/errors/employee-not-found';
import { EnrollmentNotFoundError } from '@/use-cases/errors/enrollment-not-found';
import { PaymentNotFoundError } from '@/use-cases/errors/payment-not-found';

export async function createTransaction(request: FastifyRequest, reply: FastifyReply) {
  const createTransactionSchema = z.object({
    transactionNumber: z.string(),
    amount: z.number(),
    date: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    }),
    enrollmentId: z.number(),
    employeeId: z.number(),
    paymentId: z.number().optional(),
  });

  const { transactionNumber, paymentId, amount, date, enrollmentId, employeeId } = createTransactionSchema.parse(request.body);

  try {
    const createTransactionUseCase = makeCreateTransactionUseCase();
    await createTransactionUseCase.execute({
      transactionNumber,
      amount,
      date: new Date(date),
      enrollmentId,
      paymentId,
      employeeId
    });

    return reply.status(201).send();
  } catch (err) {
    // console.log(err)
    if (
      err instanceof TransactionWasUsedError ||
      err instanceof EmployeeNotFoundError ||
      err instanceof EnrollmentNotFoundError ||
      err instanceof PaymentNotFoundError
    ) {
      return reply.status(409).send({ message: err.message });
    }

    return reply.status(500).send({ message: 'Internal server error.' });
  }
}
