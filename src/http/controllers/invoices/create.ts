import { EmployeeNotFoundError } from '@/use-cases/errors/employee-not-found';
import { EnrollmentNotFoundError } from '@/use-cases/errors/enrollment-not-found';
import { makeCreateInvoiceUseCase } from '@/use-cases/factories/make-create-invoice-use-case';
import { InvoiceType, MonthName } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function create(request: FastifyRequest, reply: FastifyReply) {

  const createPaymentBodySchema = z.object({
    enrollmentId: z.number().int().nonnegative(),
    levelId: z.number().int().nonnegative(),
    employeeId: z.number().int().nonnegative(),
    dueDate: z.coerce.date(),
    type: z.nativeEnum(InvoiceType),
    issueDate: z.coerce.date(),
    items: z.object({
      month: z.nativeEnum(MonthName).array(),
      qty: z.number().int().nonnegative(),
      itemPriceId: z.number().int().nonnegative(),
    }).array().min(1),
  });
  // Validação do corpo da requisição
  const parsedBody = createPaymentBodySchema.safeParse(request.body);
  if (!parsedBody.success) {
    return reply.status(400).send({ message: 'Invalid request data.', errors: parsedBody.error.errors });
  }
  const { enrollmentId, employeeId, dueDate, items, issueDate, type } = parsedBody.data;

  try {
    let createInvoiceUseCase = makeCreateInvoiceUseCase()
    const invoice = await createInvoiceUseCase.execute({
      enrollmentId,
      employeeId,
      dueDate,
      items,
      issueDate,
      type
    });

    return reply.status(201).send(invoice);
  } catch (err) {
    if (err instanceof EnrollmentNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    if (err instanceof EmployeeNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    console.error(err)
    return reply.status(500).send({ message: 'Internal Server Error' })
  }
}
