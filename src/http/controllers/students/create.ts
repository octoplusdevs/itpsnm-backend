import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PhoneAlreadyExistsError } from '@/use-cases/errors/phone-already-exists-error';
import { AlternativePhoneAlreadyExistsError } from '@/use-cases/errors/alternative-phone-already-exists-error';
import { EmailAlreadyExistsError } from '@/use-cases/errors/email-already-exists-error';
import { IdentityCardNumberAlreadyExistsError } from '@/use-cases/errors/id-card-already-exists-error';
import { ProvinceNotFoundError } from '@/use-cases/errors/province-not-found';
import { CountyNotFoundError } from '@/use-cases/errors/county-not-found';
import { makeStudentUseCase } from '@/use-cases/factories/make-student-use-case';


export async function create(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    fullName: z.string(),
    dateOfBirth: z.coerce.date(),
    email: z.string().email(),
    emissionDate: z.coerce.date(),
    expirationDate: z.coerce.date(),
    father: z.string(),
    gender: z.enum(['MALE', 'FEMALE']),
    height: z.number(),
    identityCardNumber: z.string(),
    maritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED']),
    mother: z.string(),
    password: z.string(),
    residence: z.string(),
    phone: z.number(),
    type: z.enum(['SCHOLARSHIP', 'REGULAR']),
    alternativePhone: z.number(),
    provinceId: z.number(),
    countyId: z.number(),
  });

  try {
    const {
      alternativePhone,
      countyId,
      dateOfBirth,
      email,
      emissionDate,
      expirationDate,
      father,
      fullName,
      gender,
      height,
      identityCardNumber,
      maritalStatus,
      mother,
      password,
      phone,
      provinceId,
      residence,
      type
    } = registerBodySchema.parse(request.body);

    const studentUseCase = makeStudentUseCase();
    await studentUseCase.execute({
      alternativePhone,
      countyId,
      dateOfBirth,
      email,
      emissionDate,
      expirationDate,
      father,
      fullName,
      gender,
      height,
      identityCardNumber,
      maritalStatus,
      mother,
      password,
      phone,
      provinceId,
      residence,
      type
    });

    return reply.status(201).send();
  } catch (err) {
    if (err instanceof PhoneAlreadyExistsError ||
        err instanceof AlternativePhoneAlreadyExistsError ||
        err instanceof EmailAlreadyExistsError ||
        err instanceof ProvinceNotFoundError ||
        err instanceof CountyNotFoundError ||
        err instanceof IdentityCardNumberAlreadyExistsError
        ) {
      return reply.status(409).send({ message: err?.message });
    }

    return reply.status(500).send({err});
  }
}
