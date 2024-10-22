import { PrismaPaymentRepository } from "@/repositories/prisma/prisma-payments-repository"
import { RegisterPaymentUseCase } from "../payment/register-payment"
import { PrismaTransactionRepository } from "@/repositories/prisma/prisma-transaction-repository"
import { PrismaInvoiceRepository } from "@/repositories/prisma/prisma-invoices-repository"
import { PrismaEnrollmentsRepository } from "@/repositories/prisma/prisma-enrollments-repository"
import { PrismaStudentBalanceRepository } from "@/repositories/prisma/prisma-balance-student-repository"
import { PrismaEmployeeRepository } from "@/repositories/prisma/prisma-employee-repository"

export function makeCreatePaymentUseCase() {
  const paymentsRepository = new PrismaPaymentRepository()
  const transactionRepository = new PrismaTransactionRepository()
  const invoiceRepository = new PrismaInvoiceRepository()
  const enrollmentsRepository = new PrismaEnrollmentsRepository()
  const studentBalanceRepository = new PrismaStudentBalanceRepository()
  const employeeRepository = new PrismaEmployeeRepository()
  const createPaymentUseCase = new RegisterPaymentUseCase(
    paymentsRepository,
    transactionRepository,
    invoiceRepository,
    enrollmentsRepository,
    studentBalanceRepository,
    employeeRepository)

  return createPaymentUseCase
}
