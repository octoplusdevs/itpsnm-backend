import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { UsersRepository } from '@/repositories/users-repository';
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository';
import { RegisterUseCase } from '@/use-cases/authenticate/register';
import { EmployeeRepository } from '@/repositories/employee-repository';
import { StudentsRepository } from '@/repositories/student-repository';
import { PrismaStudentsRepository } from '@/repositories/prisma/prisma-student-repository';
import { PrismaEmployeeRepository } from '@/repositories/prisma/prisma-employee-repository';
import { StudentNotFoundError } from '@/use-cases/errors/student-not-found';
import { EmployeeNotFoundError } from '@/use-cases/errors/employee-not-found';
import { PrismaEnrollmentsRepository } from '@/repositories/prisma/prisma-enrollments-repository';
import { EnrollmentsRepository } from '@/repositories/enrollment-repository';
import { EnrollmentNotFoundError } from '@/use-cases/errors/enrollment-not-found';
import { EmployeeOREnrollmentNotFoundError } from '@/use-cases/errors/employee-student-not-found';
import { UserEmployeeHasInUseError } from '@/use-cases/errors/user-employee-has-exists';
import { UserEnrollmentHasInUseError } from '@/use-cases/errors/user-enrollment-has-exists';

export async function registerController(request: FastifyRequest, reply: FastifyReply) {
  // Definição do esquema de validação para o corpo da requisição
  const registerSchema = z.object({
    email: z.string().email(),
    employeeId: z.number().optional(),
    enrollmentId: z.number().optional(),
    password: z.string().min(6),  // Definindo uma senha com no mínimo 6 caracteres
    role: z.enum(['STUDENT', 'ADMIN', 'TEACHER'])  // Adicionando um enum para o papel do usuário
  });

  // Validação dos dados da requisição
  const { email, password, role, employeeId, enrollmentId } = registerSchema.parse(request.body);

  // Instanciação do repositório Prisma e do UseCase
  const usersRepository: UsersRepository = new PrismaUserRepository();
  const employeeRepository: EmployeeRepository = new PrismaEmployeeRepository();
  const enrollmentsRepository: EnrollmentsRepository = new PrismaEnrollmentsRepository();
  const registerUseCase = new RegisterUseCase(usersRepository, enrollmentsRepository, employeeRepository);

  try {

    // Execução do UseCase
    const result = await registerUseCase.execute({ email, password, role, employeeId, enrollmentId });
    if (result.success) {
      // Retornar sucesso
      return reply.status(201).send({
        success: result.success,
        message: result.message,
        userId: result.userId,
        token: result.token,
      });
    } else {
      // Retornar erro
      return reply.status(400).send({
        success: result.success,
        message: result.message,
      });
    }
  } catch (err) {
    if (err instanceof EmployeeOREnrollmentNotFoundError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof EnrollmentNotFoundError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof EmployeeNotFoundError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof UserEmployeeHasInUseError) {
      return reply.status(409).send({ message: err.message })
    }
    if (err instanceof UserEnrollmentHasInUseError) {
      return reply.status(409).send({ message: err.message })
    }

    // console.log(err)
    // Tratar exceções inesperadas
    return reply.status(500).send({
      success: false,
      message: 'Internal Server Error',
    });
  }
}
