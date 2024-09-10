import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { UsersRepository } from '@/repositories/users-repository';
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository';
import { RegisterUseCase } from '@/use-cases/authenticate/register';

export async function registerController(request: FastifyRequest, reply: FastifyReply) {
  // Definição do esquema de validação para o corpo da requisição
  const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),  // Definindo uma senha com no mínimo 6 caracteres
    role: z.enum(['STUDENT', 'ADMIN', 'TEACHER'])  // Adicionando um enum para o papel do usuário
  });

  // Validação dos dados da requisição
  const { email, password, role } = registerSchema.parse(request.body);

  // Instanciação do repositório Prisma e do UseCase
  const usersRepository: UsersRepository = new PrismaUserRepository();
  const registerUseCase = new RegisterUseCase(usersRepository);

  try {
    // Execução do UseCase
    const result = await registerUseCase.execute({ email, password, role });
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
  } catch (error) {
    // Tratar exceções inesperadas
    console.error(error);
    return reply.status(500).send({
      success: false,
      message: 'Internal Server Error',
    });
  }
}
