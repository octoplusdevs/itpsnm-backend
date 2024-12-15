import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeUpdateEnrollmentUseCase } from '@/use-cases/factories/update-enrollment-use-case';
import { EnrollementState, PAY_STATUS, PeriodType } from '@prisma/client';
import { makeGetInvoiceUseCase } from '@/use-cases/factories/make-get-invoice-use-case';
import { makeGetEnrollmentByIdentityCardUseCase } from '@/use-cases/factories/make-get-enrollment-by-identity-card-use-case';
import { GetPaymentUseCase } from '@/use-cases/payment/get-payment';
import { PrismaPaymentRepository } from '@/repositories/prisma/prisma-payments-repository';
import { PaymentBelongsToAnotherStudentError } from '@/use-cases/errors/payment-belongs-other-student';
import { PaymentNotPaidError } from '@/use-cases/errors/payment-not-paid';
import { PaymentWasUsedError } from '@/use-cases/errors/payment-was-used';
import { StudentHasOutstanding } from '@/use-cases/errors/student-has-outstanding-error';
import { EnrollmentNotFoundError } from '@/use-cases/errors/enrollment-not-found';
import { handleKnownErrors } from '@/utils/error-handler';
import { PaymentTypeIsNotValidError } from '@/use-cases/errors/payment-is-not-valid';
import { makeFindInvoiceUseCase } from '@/use-cases/factories/make-find-invoice-use-case';

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const createEnrollmentSchema = z.object({
    identityCardNumber: z.string(),
    period: z.nativeEnum(PeriodType),
    courseId: z.number(),
    levelId: z.number(),
    docsState: z.nativeEnum(EnrollementState),
    paymentState: z.nativeEnum(EnrollementState),
    paymentId: z.number().optional(),
    classeId: z.number().optional(),
    employeeId: z.number(),
    startDate: z.date().default(new Date('01-09-2023')),
  });

  try {
    const { id } = request.params as { id: number };
    const {
      identityCardNumber,
      courseId,
      docsState,
      paymentState,
      paymentId,
      classeId,
      levelId,
      period,
    } = createEnrollmentSchema.parse(request.body);

    const enrollment = await validateEnrollment(identityCardNumber);

    await checkOutstandingInvoices(enrollment.id!);

    const newPaymentState = await processPaymentState(paymentState, paymentId, enrollment.id);

    const updateEnrollmentUseCase = makeUpdateEnrollmentUseCase();
    const updatedEnrollment = await updateEnrollmentUseCase.execute({
      id: Number(id),
      identityCardNumber,
      classeId,
      courseId,
      docsState,
      levelId,
      paymentState: newPaymentState,
      isEnrolled: docsState === EnrollementState.APPROVED && newPaymentState === EnrollementState.APPROVED,
      period,
    });

    // TODO: Refatorar para useCase
    let payment = new PrismaPaymentRepository();
    await payment.updatePaymentUsed(paymentId!, true);


    return reply.status(200).send(updatedEnrollment);
  } catch (err) {
    return handleKnownErrors(err, reply);
  }
}

async function validateEnrollment(identityCardNumber: string) {
  const getEnrollmentUseCase = makeGetEnrollmentByIdentityCardUseCase();
  const { enrollment } = await getEnrollmentUseCase.execute({ identityCardNumber });

  if (!enrollment) {
    throw new EnrollmentNotFoundError();
  }

  return enrollment;
}

async function checkOutstandingInvoices(enrollmentId: number) {
  const getInvoiceUseCase = makeGetInvoiceUseCase();

  const pendingEnrollmentInvoices = await getInvoiceUseCase.execute({
    enrollmentId,
    type: 'ENROLLMENT',
    status: 'PENDING',
  });

  const pendingConfirmationInvoices = await getInvoiceUseCase.execute({
    enrollmentId,
    type: 'ENROLLMENT_CONFIRMATION',
    status: 'PENDING',
  });

  if (pendingEnrollmentInvoices.invoice?.length || pendingConfirmationInvoices.invoice?.length) {
    throw new StudentHasOutstanding();
  }
}

async function processPaymentState(paymentState: EnrollementState, paymentId?: number, enrollmentId?: number) {
  if (!paymentState || !paymentId) return paymentState;

  const getPaymentUseCase = new GetPaymentUseCase(new PrismaPaymentRepository());
  const { payment } = await getPaymentUseCase.execute({ paymentId });

  if (!payment || payment.enrollmentId !== enrollmentId) {
    throw new PaymentBelongsToAnotherStudentError();
  }

  if (payment.status !== PAY_STATUS.PAID) {
    throw new PaymentNotPaidError(payment.status);
  }

  if (payment.used) {
    throw new PaymentWasUsedError();
  }

  const findInvoiceUseCase = makeFindInvoiceUseCase()

  const paidConfirmationInvoices = await findInvoiceUseCase.execute({ invoiceId: payment.invoiceId! });

  if (!(paidConfirmationInvoices.invoice?.type === "ENROLLMENT" || paidConfirmationInvoices.invoice?.type === "ENROLLMENT_CONFIRMATION")) {
    throw new PaymentTypeIsNotValidError();
  }



  return EnrollementState.APPROVED;
}
