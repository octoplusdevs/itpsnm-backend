import { PrismaInvoiceRepository } from "@/repositories/prisma/prisma-invoices-repository"
import { PrismaEnrollmentsRepository } from "@/repositories/prisma/prisma-enrollments-repository"
import { PrismaEmployeeRepository } from "@/repositories/prisma/prisma-employee-repository"
import { CreateInvoiceUseCase } from "../invoices/create-invoice"
import { PrismaInvoiceItemRepository } from "@/repositories/prisma/prisma-invoices-item-repository"

export function makeCreateInvoiceUseCase() {
  const invoiceRepository = new PrismaInvoiceRepository()
  const enrollmentsRepository = new PrismaEnrollmentsRepository()
  const invoiceItemRepository = new PrismaInvoiceItemRepository()
  const employeeRepository = new PrismaEmployeeRepository()
  const createPaymentUseCase = new CreateInvoiceUseCase(
    invoiceRepository,
    enrollmentsRepository,
    employeeRepository,
    invoiceItemRepository
  )

  return createPaymentUseCase
}
