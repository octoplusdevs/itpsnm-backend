import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaInvoiceRepository } from '@/repositories/prisma/prisma-invoices-repository';
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository';
import { UsersRepository } from '@/repositories/users-repository';
import { MonthName } from '@prisma/client';

export async function filterTuitionInvoicesMiddleware(request: FastifyRequest, reply: FastifyReply) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const enrollmentId = request.user?.userId;

    if (!enrollmentId) {
      return reply.status(400).send({ message: 'Enrollment ID is missing' });
    }

    const invoicesRepository = new PrismaInvoiceRepository()
    const tuitionInvoices = await invoicesRepository.findInvoicesByEnrollmentId(enrollmentId);

    // Obter a data atual para comparação
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // novembro = 10 (0 indexado)
    const overdueMonths = [];

    tuitionInvoices.forEach(invoice => {
      invoice.items.forEach(item => {
        const monthIndex = getMonthIndex(item.month);

        // Verifica se o item está pendente e se refere a um mês anterior ao mês atual
        if (monthIndex < currentMonth && currentDate.getDate() > 15) {
          overdueMonths.push(item.month);
        }
      });
    });

    if (overdueMonths.length > 0) {
      return reply.status(403).send({ message: `Você possui dívidas de propinas pendentes para os meses: ${overdueMonths.join(', ')}` });
    }

    // Se não houver meses em atraso, continue para a próxima função da rota
    return;
  };
}

// Função auxiliar para converter o nome do mês para o índice (0-11)
function getMonthIndex(monthName: string): number {
  const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
  return months.indexOf(monthName.toUpperCase());
}
