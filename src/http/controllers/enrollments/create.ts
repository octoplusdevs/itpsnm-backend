import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { StudentNotFoundError } from '@/use-cases/errors/student-not-found';
import { CourseNotFoundError } from '@/use-cases/errors/course-not-found';
import { LevelNotFoundError } from '@/use-cases/errors/level-not-found';
import { EnrollmentAlreadyExistsError } from '@/use-cases/errors/enrollment-already-exists';
import { makeCreateEnrollmentUseCase } from '@/use-cases/factories/make-enrollment-use-case';
import { makeCreateInvoiceUseCase } from '@/use-cases/factories/make-create-invoice-use-case';

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createEnrollmentSchema = z.object({
    identityCardNumber: z.string(),
    courseId: z.number(),
    levelId: z.number(),
    employeeId: z.number().optional(),
  });
  const {
    identityCardNumber,
    courseId,
    levelId,
    employeeId
  } = createEnrollmentSchema.parse(request.body);

  try {
    const createEnrollmentUseCase = makeCreateEnrollmentUseCase();
    const createInvoiceUseCase = makeCreateInvoiceUseCase();
    let enrollment = await createEnrollmentUseCase.execute({
      identityCardNumber,
      courseId,
      levelId,
    });

    await createInvoiceUseCase.execute({
      type: "ENROLLMENT",
      enrollmentId: enrollment.enrollment.id!,
      employeeId: employeeId ?? 935,
      dueDate: new Date(),
      issueDate: new Date(),
      items: [
        {
          itemPriceId: 35,
          qty: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          itemPriceId: 37,
          qty: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          itemPriceId: 38,
          qty: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          itemPriceId: 36,
          month: ["SEPTEMBER"],
          qty: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ]
    })
    return reply.status(201).send(enrollment)

  } catch (err) {
    if (err instanceof StudentNotFoundError) {
      return reply.status(404).send({ message: err.message });
    } else if (err instanceof CourseNotFoundError) {
      return reply.status(404).send({ message: err.message });
    } else if (err instanceof LevelNotFoundError) {
      return reply.status(404).send({ message: err.message });
    } else if (err instanceof EnrollmentAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }
    return reply.status(500).send(err);
  }
}
