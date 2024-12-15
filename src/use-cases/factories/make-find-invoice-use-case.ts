import { PrismaInvoiceRepository } from '@/repositories/prisma/prisma-invoices-repository'
import { FindInvoiceUseCase } from '../invoices/find-invoice'

export function makeFindInvoiceUseCase() {
  const prismaInvoiceRepository = new PrismaInvoiceRepository()
  const findInvoiceUseCase = new FindInvoiceUseCase(prismaInvoiceRepository)

  return findInvoiceUseCase
}
