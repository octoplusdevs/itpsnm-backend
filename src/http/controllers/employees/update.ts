import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PhoneAlreadyExistsError } from '@/use-cases/errors/phone-already-exists-error';
import { IdentityCardNumberAlreadyExistsError } from '@/use-cases/errors/id-card-already-exists-error';
import { makeUpdateEmployeeUseCase } from '@/use-cases/factories/make-update-employee-use-case';

interface UpdateEmployeeParams {
  id: number;
}

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const updateBodySchema = z.object({
    fullName: z.string().optional(),
    dateOfBirth: z.coerce.date().optional(),
    emissionDate: z.coerce.date().optional(),
    expirationDate: z.coerce.date().optional(),
    gender: z.enum(['MALE', 'FEMALE']).optional(),
    identityCardNumber: z.string().optional(),
    maritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED']).optional(),
    phone: z.string().optional(),
    residence: z.string().optional(),
    alternativePhone: z.string().optional(),
  });

  try {
    const { id } = request.params as { id: number };
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
    } = updateBodySchema.parse(request.body);

    const updateEmployeeUseCase = makeUpdateEmployeeUseCase();
    const employee = await updateEmployeeUseCase.execute({
      id: Number(id), // Converte o ID para número
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

    return reply.status(200).send(employee);
  } catch (err) {
    if (err instanceof PhoneAlreadyExistsError ||
      err instanceof IdentityCardNumberAlreadyExistsError) {
      return reply.status(409).send({ message: err?.message });
    }

    return reply.status(500).send({ error: err });
  }
}
