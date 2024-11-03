import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeUpdateEnrollmentUseCase } from '@/use-cases/factories/update-enrollment-use-case';
import { EnrollementState } from '@prisma/client';
import { StudentNotFoundError } from '@/use-cases/errors/student-not-found';
import { CourseNotFoundError } from '@/use-cases/errors/course-not-found';
import { LevelNotFoundError } from '@/use-cases/errors/level-not-found';
import { EnrollmentNotFoundError } from '@/use-cases/errors/enrollment-not-found';
import { IdentityCardNumberNotExistsError } from '@/use-cases/errors/id-card-not-exists-error';
import { IdentityCardNumberHasInUseExistsError } from '@/use-cases/errors/id-card-already-in-use-error';
import { ClassNotExists } from '@/use-cases/errors/class-not-exists-error';
import { makeGetInvoiceUseCase } from '@/use-cases/factories/make-get-invoice-use-case';
import { makeGetEnrollmentByIdentityCardUseCase } from '@/use-cases/factories/make-get-enrollment-by-identity-card-use-case';
import { StudentHasOutstanding } from '@/use-cases/errors/student-has-outstanding-error';

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const createEnrollmentSchema = z.object({
    identityCardNumber: z.string(),
    courseId: z.number().optional(),
    levelId: z.number().optional(),
    docsState: z.nativeEnum(EnrollementState),
    paymentState: z.nativeEnum(EnrollementState),
    classeId: z.number().optional(),
    employeeId: z.number(),
    startDate: z.date().default(new Date("01-09-2023")),
  });


  try {
    const { id } = request.params as { id: number };
    const {
      identityCardNumber,
      courseId,
      docsState,
      paymentState,
      classeId,
      startDate,
      levelId,
      employeeId,
    } = createEnrollmentSchema.parse(request.body);

    const getEnrollmentUseCase = makeGetEnrollmentByIdentityCardUseCase()
    let { enrollment: enroll } = await getEnrollmentUseCase.execute({ identityCardNumber })

    const getInvoiceUseCase = makeGetInvoiceUseCase()
    let findInvoices = await getInvoiceUseCase.execute({ enrollmentId: enroll.id!, type: "ENROLLMENT_CONFIRMATION", status: "PENDING" })

    if(findInvoices.invoice?.length! > 0){
      throw new StudentHasOutstanding()
    }

    const updateEnrollmentUseCase = makeUpdateEnrollmentUseCase();
    const enrollment = await updateEnrollmentUseCase.execute({
      id: Number(id),
      identityCardNumber,
      classeId,
      courseId,
      docsState,
      levelId,
      paymentState
    });


    return reply.status(200).send(enrollment);
  } catch (err) {
    // console.log(err)
    if (err instanceof LevelNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    if (err instanceof StudentHasOutstanding) {
      return reply.status(409).send({ message: err.message });
    }
    if (err instanceof StudentNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    if (err instanceof CourseNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    if (err instanceof LevelNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    if (err instanceof EnrollmentNotFoundError) {
      return reply.status(409).send({ message: err.message });
    }
    if (err instanceof IdentityCardNumberHasInUseExistsError) {
      return reply.status(409).send({ message: err.message });
    }
    if (err instanceof IdentityCardNumberNotExistsError) {
      return reply.status(409).send({ message: err.message });
    }

    if (err instanceof ClassNotExists) {
      return reply.status(409).send({ message: err.message });
    }

    return reply.status(500).send({ error: err });
  }
}
