import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { StudentNotFoundError } from '@/use-cases/errors/student-not-found';
import { CourseNotFoundError } from '@/use-cases/errors/course-not-found';
import { LevelNotFoundError } from '@/use-cases/errors/level-not-found';
import { EnrollmentAlreadyExistsError } from '@/use-cases/errors/enrollment-already-exists';
import { makeCreateEnrollmentUseCase } from '@/use-cases/factories/make-enrollment-use-case';
import { makeCreateInvoiceUseCase } from '@/use-cases/factories/make-create-invoice-use-case';
import { makeGetItemPriceByNameUseCase } from '@/use-cases/factories/make-get-item-prices-by-name-use-case';
import { MonthName } from '@prisma/client';
import { ItemPriceNotFoundError } from '@/use-cases/errors/item-price-not-found copy';
import { EmployeeNotFoundError } from '@/use-cases/errors/employee-not-found';


export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createEnrollmentSchema = z.object({
    identityCardNumber: z.string(),
    courseId: z.number(),
    levelId: z.number(),
    employeeId: z.number().default(935),
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
      employeeId
    });

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
      type: "ENROLLMENT",
      enrollmentId: enrollment.enrollment.id!,
      employeeId,
      dueDate: new Date(),
      issueDate: new Date(),
      items
    })
    return reply.status(201).send(enrollment)

  } catch (err) {
    if (err instanceof StudentNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    if (err instanceof CourseNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    if (err instanceof LevelNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    if (err instanceof EnrollmentAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }
    if (err instanceof ItemPriceNotFoundError) {
      return reply.status(409).send({ message: err.message });
    }
    if (err instanceof EmployeeNotFoundError) {
      return reply.status(409).send({ message: err.message });
    }
    return reply.status(500).send(err);
  }
}
