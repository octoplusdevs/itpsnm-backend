import { FastifyReply, FastifyRequest } from 'fastify';
import { verify } from 'jsonwebtoken';
import { UsersRepository } from '@/repositories/users-repository';
import { Role } from '@prisma/client';
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository';

interface TokenPayload {
  userId: number;
  role: Role;
}

export function accessControlMiddleware(requiredRole: Role[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const authHeader = request.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({ message: 'Unauthorized: No token provided' });
      }

      const token = authHeader.replace('Bearer ', '');

      const secretKey = process.env.JWT_SECRET!;
      let decodedToken: TokenPayload;

      try {
        decodedToken = verify(token, secretKey) as TokenPayload;
      } catch (error) {
        return reply.status(401).send({ message: 'Unauthorized: Invalid token' });
      }

      const { userId } = decodedToken;

      const usersRepository: UsersRepository = new PrismaUserRepository();
      const user = await usersRepository.findById(userId);

      if (!user || user.isBlocked || !user.isActive) {
        return reply.status(401).send({ message: 'Unauthorized: User is blocked or inactive' });
      }

      if (!requiredRole.includes(user.role)) {
        return reply.status(403).send({ message: 'Forbidden: Access denied' });
      }

      request.user = user
    } catch (error) {
      return reply.status(500).send({ message: 'Internal Server Error' });
    }
  };
}
