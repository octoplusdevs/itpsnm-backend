import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { StudentNotFoundError } from '@/use-cases/errors/student-not-found';
import { CourseNotFoundError } from '@/use-cases/errors/course-not-found';
import { LevelNotFoundError } from '@/use-cases/errors/level-not-found';
import { EnrollmentAlreadyExistsError } from '@/use-cases/errors/enrollment-already-exists';
import { makeCreateInvoiceUseCase } from '@/use-cases/factories/make-create-invoice-use-case';
import { makeGetItemPriceByNameUseCase } from '@/use-cases/factories/make-get-item-prices-by-name-use-case';
import { MonthName, PeriodType } from '@prisma/client';
import { makeGetEnrollmentUseCase } from '@/use-cases/factories/make-get-enrollment-use-case';
import { ItemPriceNotFoundError } from '@/use-cases/errors/item-price-not-found copy';
import { EnrollmentNotFoundError } from '@/use-cases/errors/enrollment-not-found';
import { ConfirmationOnlyForStudentsEnrolled } from '@/use-cases/errors/county-already-exists-error copy';
import { makeUpdateEnrollmentUseCase } from '@/use-cases/factories/update-enrollment-use-case';


export async function confirmation(request: FastifyRequest, reply: FastifyReply) {
  const createEnrollmentSchema = z.object({
    levelId: z.number(),
    employeeId: z.number().optional(),
    enrollmentNumber: z.coerce.number().optional(),
    identityCardNumber: z.coerce.string().optional(),
    classeId: z.number().optional(),
    period: z.nativeEnum(PeriodType),
  });

  const {
    identityCardNumber,
    enrollmentNumber,
    levelId,
    period,
    classeId,
    employeeId
  } = createEnrollmentSchema.parse(request.body);

  try {
    const getEnrollmentUseCase = makeGetEnrollmentUseCase();
    const createInvoiceUseCase = makeCreateInvoiceUseCase();
    let { enrollment } = await getEnrollmentUseCase.execute({
      identityCardNumber, enrollmentNumber
    });

    if (!enrollment.isEnrolled) {
      throw new ConfirmationOnlyForStudentsEnrolled()
    }
    let itemsForPay = ["Matrícula", "Ficha de Propina", "Cartão PVC", "Propina"]
    let getItemPriceUseCase = makeGetItemPriceByNameUseCase()
    let items: {
      month?: MonthName[] | null;
      qty: number;
      itemPriceId: number;
      createdAt?: Date;
      updatedAt?: Date;
    }[] = [];
    for (let itemName of itemsForPay) {
      let newItem = await getItemPriceUseCase.execute({ itemName, levelId })
      items.push({
        qty: 1,
        itemPriceId: newItem.itemPrice?.id!
      })
    }
    await createInvoiceUseCase.execute({
      type: "ENROLLMENT_CONFIRMATION",
      enrollmentId: enrollment.id!,
      employeeId: employeeId ?? 935,
      dueDate: new Date(),
      issueDate: new Date(),
      items
    })
    const updateEnrollmentUseCase = makeUpdateEnrollmentUseCase();

    const updatedEnrollment = await updateEnrollmentUseCase.execute({
      id: enrollment.id,
      identityCardNumber: enrollment.identityCardNumber,
      classeId: classeId ?? enrollment.classeId!,
      courseId: enrollment.courseId!,
      docsState: "PENDING",
      paymentState: "PENDING",
      levelId,
      period
    });
    return reply.status(201).send(updatedEnrollment)

  } catch (err) {
    if (err instanceof StudentNotFoundError) {
      return reply.status(404).send({ message: err.message });
    } else if (err instanceof CourseNotFoundError) {
      return reply.status(404).send({ message: err.message });
    } else if (err instanceof LevelNotFoundError) {
      return reply.status(404).send({ message: err.message });
    } else if (err instanceof EnrollmentAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    } else if (err instanceof ItemPriceNotFoundError) {
      return reply.status(409).send({ message: err.message });
    } else if (err instanceof EnrollmentNotFoundError) {
      return reply.status(409).send({ message: err.message });
    }else if (err instanceof ConfirmationOnlyForStudentsEnrolled) {
      return reply.status(409).send({ message: err.message });
    }

    return reply.status(500).send(err);
  }
}
