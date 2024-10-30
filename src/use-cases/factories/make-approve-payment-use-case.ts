import { PrismaPaymentRepository } from "@/repositories/prisma/prisma-payments-repository"
import { ApprovePaymentUseCase } from "../payment/approve-payment"
import { PrismaEmployeeRepository } from "@/repositories/prisma/prisma-employee-repository"
import { PrismaInvoiceItemRepository } from "@/repositories/prisma/prisma-invoices-item-repository"
import { PrismaTransactionRepository } from "@/repositories/prisma/prisma-transaction-repository"
import { PrismaInvoiceRepository } from "@/repositories/prisma/prisma-invoices-repository"

export function makeApprovePaymentUseCase() {
  const paymentsRepository = new PrismaPaymentRepository()
  const employeeRepository = new PrismaEmployeeRepository()
  const invoiceItemRepository = new PrismaInvoiceItemRepository()
  const transactionRepository = new PrismaTransactionRepository()
  const invoiceRepository = new PrismaInvoiceRepository()
  const useCase = new ApprovePaymentUseCase(paymentsRepository, employeeRepository, invoiceItemRepository,invoiceRepository,transactionRepository)

  return useCase
}
