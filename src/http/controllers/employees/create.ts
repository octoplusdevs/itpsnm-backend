import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PhoneAlreadyExistsError } from '@/use-cases/errors/phone-already-exists-error';
import { IdentityCardNumberAlreadyExistsError } from '@/use-cases/errors/id-card-already-exists-error';
import { makeCreateEmployeeUseCase } from '@/use-cases/factories/make-create-employee-use-case';

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createBodySchema = z.object({
    fullName: z.string(),
    dateOfBirth: z.coerce.date(),
    emissionDate: z.coerce.date(),
    expirationDate: z.coerce.date(),
    gender: z.enum(['MALE', 'FEMALE']),
    identityCardNumber: z.string(),
    maritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED']),
    phone: z.string(),
    residence: z.string(),
    alternativePhone: z.string().optional(),
  });

  try {
    const {
      fullName,
      dateOfBirth,
      emissionDate,
      expirationDate,
      gender,
      identityCardNumber,
      maritalStatus,
      phone,
      residence,
      alternativePhone,
    } = createBodySchema.parse(request.body);

    const createEmployeeUseCase = makeCreateEmployeeUseCase();
    const employee = await createEmployeeUseCase.execute({
      fullName,
      dateOfBirth,
      emissionDate,
      expirationDate,
      gender,
      identityCardNumber,
      maritalStatus,
      phone,
      residence,
      alternativePhone,
    });

    return reply.status(201).send(employee);
  } catch (err) {
    if (
      err instanceof PhoneAlreadyExistsError ||
      err instanceof IdentityCardNumberAlreadyExistsError
    ) {
      return reply.status(409).send({ message: err?.message });
    }

    return reply.status(500).send({ error: err });
  }
}
