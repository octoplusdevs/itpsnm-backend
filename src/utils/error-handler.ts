import { ClassNotExists } from "@/use-cases/errors/class-not-exists-error";
import { CourseNotFoundError } from "@/use-cases/errors/course-not-found";
import { EnrollmentNotFoundError } from "@/use-cases/errors/enrollment-not-found";
import { IdentityCardNumberHasInUseExistsError } from "@/use-cases/errors/id-card-already-in-use-error";
import { IdentityCardNumberNotExistsError } from "@/use-cases/errors/id-card-not-exists-error";
import { LevelNotFoundError } from "@/use-cases/errors/level-not-found";
import { PaymentBelongsToAnotherStudentError } from "@/use-cases/errors/payment-belongs-other-student";
import { PaymentTypeIsNotValidError } from "@/use-cases/errors/payment-is-not-valid";
import { PaymentNotFoundError } from "@/use-cases/errors/payment-not-found";
import { PaymentNotPaidError } from "@/use-cases/errors/payment-not-paid";
import { PaymentWasUsedError } from "@/use-cases/errors/payment-was-used";
import { StudentHasOutstanding } from "@/use-cases/errors/student-has-outstanding-error";
import { StudentNotFoundError } from "@/use-cases/errors/student-not-found";
import { FastifyReply } from "fastify";

export function handleKnownErrors(err: unknown, reply: FastifyReply) {
  const errorMap = new Map([
    [StudentNotFoundError, 404],
    [CourseNotFoundError, 404],
    [LevelNotFoundError, 404],
    [EnrollmentNotFoundError, 409],
    [IdentityCardNumberNotExistsError, 409],
    [IdentityCardNumberHasInUseExistsError, 409],
    [ClassNotExists, 409],
    [StudentHasOutstanding, 409],
    [PaymentNotPaidError, 409],
    [PaymentWasUsedError, 409],
    [PaymentNotFoundError, 404],
    [PaymentBelongsToAnotherStudentError, 409],
    [PaymentTypeIsNotValidError, 409],
  ]);

  for (const [ErrorClass, statusCode] of errorMap) {
    if (err instanceof ErrorClass) {
      return reply.status(statusCode).send({ message: err.message });
    }
  }

  return reply.status(500).send({ message: 'Internal Server Error', error: err });
}
