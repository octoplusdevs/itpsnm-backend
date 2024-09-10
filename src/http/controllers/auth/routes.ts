import { FastifyInstance } from 'fastify';
import { loginController } from './login';
import { accessControlMiddleware } from '@/http/middlewares/verify-user-role';
import { Role } from '@prisma/client';
import { registerController } from './register';

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth', loginController);
  app.post('/signup', registerController);


  app.get('/admin-data', { preHandler: accessControlMiddleware(Role.ADMIN) }, async (request, reply) => {
    return reply.send({ message: 'Admin data' });
  });

  app.get('/user-data', { preHandler: accessControlMiddleware(Role.STUDENT) }, async (request, reply) => {
    return reply.send({ message: 'STUDENT data' });
  });
}


