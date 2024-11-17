import { FastifyInstance } from 'fastify';
import { loginController } from './login';
import { accessControlMiddleware } from '@/http/middlewares/verify-user-role';
import { Classroom, Role, Classe, PeriodType, ClasseType } from '@prisma/client';
import { registerController } from './register';
import { filterTuitionInvoicesMiddleware } from '@/http/middlewares/verify-pending-invoices';
import { Provinces, courses, employees, itemPrices, levels, users, } from '@/lib/bulk_insert';
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

  app.post("/init", async (request, reply) => {
    try {
      const periods: PeriodType[] = ["MORNING", "AFTERNOON"];
      const names: ClasseType[] = [ClasseType.A, ClasseType.B, ClasseType.C];
      const classRooms: Classroom[] = [];
      // Criar 50 salas
      for (let i = 1; i <= 45; i++) {
        classRooms.push({
          id: i,
          name: `SALA ${i}`,
          capacity: 40,
          currentOccupancy: 0,
          created_at: new Date(),
          update_at: new Date(),
        });
      }

      // Inserir salas no banco
      await prisma.classroom.createMany({ data: classRooms });
      console.log("Salas criadas com sucesso!");

      const savedClassrooms = await prisma.classroom.findMany();
      const classroomsCount = savedClassrooms.length;

      if (classroomsCount < 45) {
        throw new Error("Não há salas suficientes (45 necessárias).");
      }

      let classes: Classe[] = [];
      let i = 1; // Inicializa o identificador único para turmas

      for (let courseId = 1; courseId <= 10; courseId++) {
        for (let levelId = 1; levelId <= 4; levelId++) {
          for (const period of periods) {
            for (const name of names) {
              const classroom = savedClassrooms[(i - 1) % classroomsCount];

              classes.push({
                name,
                id: i++,
                id_classroom: classroom.id,
                courseId,
                levelId,
                period,
                course_id: null,
                created_at: new Date(),
                update_at: new Date(),
              });
            }
          }
        }
      }

      await prisma.classe.createMany({
        data: classes,
      });

      reply.status(201).send("Turmas e salas inicializadas com sucesso.");
    } catch (error) {
      console.error(error);
      reply.status(500).send("Erro ao inicializar turmas e salas.");
    }
  });

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
        // console.log(err)
      }
    }
  );
}


