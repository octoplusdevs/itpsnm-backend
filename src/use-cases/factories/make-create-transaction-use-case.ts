import { PrismaTransactionRepository } from '@/repositories/prisma/prisma-transaction-repository';
import { CreateTransactionUseCase } from '../transaction/create-transaction';
import { PrismaEnrollmentsRepository } from '@/repositories/prisma/prisma-enrollments-repository';
import { PrismaPaymentRepository } from '@/repositories/prisma/prisma-payments-repository';
import { PrismaEmployeeRepository } from '@/repositories/prisma/prisma-employee-repository';
import { PrismaStudentBalanceRepository } from '@/repositories/prisma/prisma-balance-student-repository';

export function makeCreateTransactionUseCase() {
  const transactionRepository = new PrismaTransactionRepository();
  const enrollmentsRepository = new PrismaEnrollmentsRepository();
  const paymentRepository = new PrismaPaymentRepository();
  const employeeRepository = new PrismaEmployeeRepository();
  const studentBalanceRepository = new PrismaStudentBalanceRepository();
  const useCase = new CreateTransactionUseCase(
    transactionRepository,
    employeeRepository,
    enrollmentsRepository,
    paymentRepository,
    studentBalanceRepository
  );

  return useCase;
}
