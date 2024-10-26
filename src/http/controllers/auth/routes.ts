import { FastifyInstance } from 'fastify';
import { loginController } from './login';
import { accessControlMiddleware } from '@/http/middlewares/verify-user-role';
import { Role } from '@prisma/client';
import { registerController } from './register';
import { filterTuitionInvoicesMiddleware } from '@/http/middlewares/verify-pending-invoices';

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth', loginController);
  app.post('/signup', registerController);


  app.get('/admin-data', { preHandler: accessControlMiddleware([Role.ADMIN, Role.TEACHER]) }, async (request, reply) => {
    return reply.send({ message: 'Admin data' });
  });

  app.get('/user-data', { preHandler: accessControlMiddleware([Role.STUDENT]) }, async (request, reply) => {
    return reply.send({ message: 'STUDENT data', user: request.user });
  });

  app.get(
    '/user-invoices',
    {
      preHandler: [
        accessControlMiddleware([Role.STUDENT]),
        filterTuitionInvoicesMiddleware // Remova os parênteses para passar a função diretamente
      ]
    },
    async (request, reply) => {
      try {
        return reply.send({ message: 'STUDENT data', invoices: request.tuitionInvoices });
      } catch (err) {
        console.log(err)
      }
    }
  );
}


