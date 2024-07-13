import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { StudentNotFoundError } from '@/use-cases/errors/student-not-found';
import { CourseNotFoundError } from '@/use-cases/errors/course-not-found';
import { LevelNotFoundError } from '@/use-cases/errors/level-not-found';
import { EnrollmentAlreadyExistsError } from '@/use-cases/errors/enrollment-already-exists';
import { makeCreateEnrollmentUseCase } from '@/use-cases/factories/make-enrollment-use-case';

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createEnrollmentSchema = z.object({
    identityCardNumber: z.string(),
    courseId: z.number(),
    levelId: z.number(),
  });
  const {
    identityCardNumber,
    courseId,
    levelId,
  } = createEnrollmentSchema.parse(request.body);

  try {
    const createEnrollmentUseCase = makeCreateEnrollmentUseCase();
    let enrollment = await createEnrollmentUseCase.execute({
      identityCardNumber,
      courseId,
      levelId,
    });

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

  return reply.status(201).send();
}
