import { FastifyReply, FastifyRequest } from 'fastify';
import { UsersRepository } from '@/repositories/users-repository';
import { z } from 'zod';
import { LoginUseCase } from '@/use-cases/authenticate/authenticate';
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository';

export async function loginController(request: FastifyRequest, reply: FastifyReply) {
  // Definição do esquema de validação para o corpo da requisição
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6) // Definindo uma mínima de 6 caracteres para a senha
  });

  // Validação dos dados da requisição
  const { email, password } = loginSchema.parse(request.body);

  // Instanciação do repositório Prisma e do UseCase
  const usersRepository: UsersRepository = new PrismaUserRepository();
  const loginUseCase = new LoginUseCase(usersRepository);

  try {
    // Execução do UseCase
    const result = await loginUseCase.execute({ email, password });
    console.log(result)

    if (result.success) {
      // Retornar sucesso
      return reply.status(200).send({
        success: result.success,
        message: result.message,
        enrollmentNumber: result.enrollmentNumber,
        userId: result.userId,
        employeeNumber: result.employeeNumber,
        role: result.role,
        token: result.token
      });
    } else {
      // Retornar erro
      return reply.status(400).send({
        success: result.success,
        message: result.message
      });
    }
  } catch (error) {
    // Tratar exceções inesperadas
    console.error(error);
    return reply.status(500).send({
      success: false,
      message: 'Internal Server Error'
    });
  }
}
