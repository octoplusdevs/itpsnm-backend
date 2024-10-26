import { FastifyReply, FastifyRequest } from 'fastify';
import { PrismaInvoiceRepository } from '@/repositories/prisma/prisma-invoices-repository';
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository';
import { UsersRepository } from '@/repositories/users-repository';

export async function filterTuitionInvoicesMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    // const usersRepository: UsersRepository = new PrismaUserRepository();
    // const user = await usersRepository.findByEnrollment(request.user.userId);

    const invoicesRepository = new PrismaInvoiceRepository();
    // const currentYear = new Date().getFullYear();

    // Buscar invoices do tipo TUITION e filtrar por items PENDING do ano atual
    const tuitionInvoices = await invoicesRepository.findInvoicesByEnrollmentId(request.user.userId!);

     // Filtra invoices que estão atrasados, comparando com o mês atual
     const currentDate = new Date();
     const overdueInvoices = tuitionInvoices.filter(invoice => {
       const dueDate = new Date(invoice.dueDate);
       return (
         dueDate.getFullYear() < currentDate.getFullYear() ||
         (dueDate.getFullYear() === currentDate.getFullYear() && dueDate.getMonth() < currentDate.getMonth())
       );
     });

     if (overdueInvoices.length > 0) {
       return reply.status(403).send({ message: 'Você possui dívidas de propinas pendentes e em atraso no sistema' });
     }
    // Adiciona o resultado ao request para acesso nas próximas camadas
    request.tuitionInvoices = tuitionInvoices;
  } catch (error) {
    console.log(error)
    return reply.status(500).send({ message: 'Internal Server Error' });
  }
}
