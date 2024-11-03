import { PrismaInvoiceRepository } from '@/repositories/prisma/prisma-invoices-repository'
import { GetInvoiceByEnrollmentIdUseCase } from '../invoices/get-invoice'

export function makeGetInvoiceUseCase() {
  const prismaInvoiceRepository = new PrismaInvoiceRepository()
  const getInvoiceUseCase = new GetInvoiceByEnrollmentIdUseCase(prismaInvoiceRepository)

  return getInvoiceUseCase
}
