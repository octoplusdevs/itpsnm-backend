import { FastifyInstance } from 'fastify';
import { loginController } from './login';
import { accessControlMiddleware } from '@/http/middlewares/verify-user-role';
import { Role } from '@prisma/client';
import { registerController } from './register';
import { filterTuitionInvoicesMiddleware } from '@/http/middlewares/verify-pending-invoices';
import { Provinces, courses, employees, itemPrices, levels, users } from '@/lib/bulk_insert';
import { prisma } from '@/lib/prisma';

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth', loginController);
  app.post('/signup', registerController);


  app.get('/admin-data', { preHandler: accessControlMiddleware([Role.ADMIN, Role.TEACHER]) }, async (request, reply) => {
    return reply.send({ message: 'Admin data' });
  });

  app.get('/user-data', { preHandler: accessControlMiddleware([Role.STUDENT]) }, async (request, reply) => {
    return reply.send({ message: 'STUDENT data', user: request.user });
  });

  app.post("/init", async(request, reply) => {
    try {
      await prisma.province.createMany({
        data: Provinces,
      });
      await prisma.level.createMany({
        data: levels,
      });
      await prisma.course.createMany({
        data: courses,
      });
      await prisma.employee.createMany({
        data: employees,
      });
      await prisma.user.createMany({
        data: users,
      });
      await prisma.itemPrices.createMany({
        data: itemPrices,
      });
    } catch (error) {
      console.log(error)
    }
  })
  app.get(
    '/user-invoices',
    {
      preHandler: [
        accessControlMiddleware([Role.STUDENT]),
        filterTuitionInvoicesMiddleware
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


