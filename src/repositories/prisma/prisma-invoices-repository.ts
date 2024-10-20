import { Invoice, PAY_STATUS } from '@prisma/client'
import { InvoiceRepository } from '../invoices-repository'
import { prisma } from '@/lib/prisma'

export class PrismaInvoiceRepository implements InvoiceRepository {

  async createInvoice(data: Omit<Invoice, 'id'>): Promise<Invoice> {
    return prisma.invoice.create({
      data,
    })
  }

  async findInvoiceById(invoiceId: number): Promise<Invoice | null> {
    return prisma.invoice.findUnique({
      where: { id: invoiceId },
    })
  }

  async findInvoicesByStudent(enrollmentId: number): Promise<Invoice[]> {
    return prisma.invoice.findMany({
      where: { enrollmentId },
    })
  }

  async updateInvoiceStatus(invoiceId: number, status: PAY_STATUS): Promise<Invoice> {
    return prisma.invoice.update({
      where: { id: invoiceId },
      data: { status },
    })
  }
}
