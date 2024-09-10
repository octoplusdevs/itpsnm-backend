import { FastifyReply, FastifyRequest } from 'fastify';
import { verify } from 'jsonwebtoken'; // Você deve usar o pacote jsonwebtoken para validar o token
import { UsersRepository } from '@/repositories/users-repository';
import { Role } from '@prisma/client';
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository';

interface TokenPayload {
  userId: number;
  role: Role;
}

// Middleware que verifica o token e se o usuário tem a role necessária
export function accessControlMiddleware(requiredRole: Role) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const authHeader = request.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({ message: 'Unauthorized: No token provided' });
      }

      const token = authHeader.replace('Bearer ', '');

      // Verificação do token JWT
      const secretKey = process.env.JWT_SECRET!; // Use a chave secreta correta
      let decodedToken: TokenPayload;

      try {
        decodedToken = verify(token, secretKey) as TokenPayload;
      } catch (error) {
        return reply.status(401).send({ message: 'Unauthorized: Invalid token' });
      }

      // Recuperar o userId e o role do token
      const { userId, role } = decodedToken;

      const usersRepository: UsersRepository = new PrismaUserRepository();
      const user = await usersRepository.findById(userId);

      if (!user || user.isBlocked || !user.isActive) {
        return reply.status(401).send({ message: 'Unauthorized: User is blocked or inactive' });
      }

      if (user.role !== requiredRole) {
        return reply.status(403).send({ message: 'Forbidden: Access denied' });
      }

      // Passar o usuário para o request para uso posterior nas rotas
      request.user = user;
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: 'Internal Server Error' });
    }
  };
}
