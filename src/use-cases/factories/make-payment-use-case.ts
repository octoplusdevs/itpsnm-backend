import { PrismaPaymentRepository } from '@/repositories/prisma/prisma-payments-repository'
import { RegisterPaymentUseCase } from '../payment/register-payment'
import { PrismaInvoiceRepository } from '@/repositories/prisma/prisma-invoices-repository'
import { PrismaTransactionRepository } from '@/repositories/prisma/prisma-transaction-repository'
import { PrismaEnrollmentsRepository } from '@/repositories/prisma/prisma-enrollments-repository'
import { PrismaStudentBalanceRepository } from '@/repositories/prisma/prisma-balance-student-repository'
import { PrismaEmployeeRepository } from '@/repositories/prisma/prisma-employee-repository'

export function makePaymentUseCase() {
  const prismaPaymentRepository = new PrismaPaymentRepository()
  const prismaInvoiceRepository = new PrismaInvoiceRepository()
  const prismaTransactionRepository = new PrismaTransactionRepository()
  const prismaEnrollmentsRepository = new PrismaEnrollmentsRepository()
  const prismaStudentBalanceRepository = new PrismaStudentBalanceRepository()
  const prismaEmployeeRepository = new PrismaEmployeeRepository()
  const createDocumentWithFilesUseCase = new RegisterPaymentUseCase(
    prismaPaymentRepository,
    prismaTransactionRepository,
    prismaInvoiceRepository,
    prismaEnrollmentsRepository,
    prismaStudentBalanceRepository,
    prismaEmployeeRepository,
    )

  return createDocumentWithFilesUseCase
}
