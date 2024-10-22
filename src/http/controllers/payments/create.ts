import { EnrollmentNotFoundError } from '@/use-cases/errors/enrollment-not-found';
import { InvoiceNotFoundError } from '@/use-cases/errors/invoice-not-found';
import { PaymentAlreadyExistsError } from '@/use-cases/errors/payment-already-exists-error';
import { TransactionNotFoundError } from '@/use-cases/errors/transaction-not-found';
import { makeCreatePaymentUseCase } from '@/use-cases/factories/make-create-payment-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createPaymentBodySchema = z.object({
    enrollmentId: z.number().int().nonnegative(),
    invoiceId: z.number().int().nonnegative(),
    employeeId: z.number().int().nonnegative(),
    transactionNumber: z.string(),
  });

  // Validação do corpo da requisição
  const parsedBody = createPaymentBodySchema.safeParse(request.body);
  if (!parsedBody.success) {
    return reply.status(400).send({ message: 'Invalid request data.', errors: parsedBody.error.errors });
  }

  const { enrollmentId, invoiceId, employeeId, transactionNumber } = parsedBody.data;

  try {
    const createPaymentUseCase = makeCreatePaymentUseCase();
    await createPaymentUseCase.execute({
      enrollmentId,
      invoiceId,
      employeeId,
      transactionNumber
    });
    return reply.status(201).send();
  } catch (err: unknown) {
    // Type assertion para acessar 'message'
    const error = err as Error;

    // Mapeando erros a códigos de status HTTP
    const errorMapping = {
      [PaymentAlreadyExistsError.name]: 409,
      [InvoiceNotFoundError.name]: 404,
      [TransactionNotFoundError.name]: 404,
      [EnrollmentNotFoundError.name]: 404,
    };

    const statusCode = errorMapping[error.name] || 500;
    return reply.status(statusCode).send({ message: error.message });
  }
}
