import { PrismaPaymentRepository } from "@/repositories/prisma/prisma-payments-repository"
import { ApprovePaymentUseCase } from "../payment/approve-payment"
import { PrismaEmployeeRepository } from "@/repositories/prisma/prisma-employee-repository"
import { PrismaInvoiceItemRepository } from "@/repositories/prisma/prisma-invoices-item-repository"

export function makeApprovePaymentUseCase() {
  const paymentsRepository = new PrismaPaymentRepository()
  const employeeRepository = new PrismaEmployeeRepository()
  const invoiceItemRepository = new PrismaInvoiceItemRepository()
  const useCase = new ApprovePaymentUseCase(paymentsRepository, employeeRepository, invoiceItemRepository)

  return useCase
}
