import { Invoice, InvoiceType, PAY_STATUS, Prisma } from '@prisma/client'
import { InvoiceRepository } from '../invoices-repository'
import { prisma } from '@/lib/prisma'

export class PrismaInvoiceRepository implements InvoiceRepository {
  async findInvoicesByStudentAndType(enrollmentId: number, type: InvoiceType, status: PAY_STATUS): Promise<Invoice[]> {
    return await  prisma.invoice.findMany({
      where: { enrollmentId, type, status:{
        not: "PAID"
      } },
    })
  }
  async updateInvoice(id: number, data: Prisma.InvoiceUncheckedUpdateInput): Promise<Invoice> {
    return await prisma.invoice.update({
      where:{
        id
      },
      data
    })
  }

  async findInvoicesByEnrollmentId(enrollmentId: number) {
    // const currentYear = new Date().getFullYear();
    // const startDate = new Date(`${currentYear}-01-01`);
    // const endDate = new Date(`${currentYear}-12-31`);

    return await prisma.invoice.findMany({
      where: {
        enrollmentId,
        type: InvoiceType.TUITION,
        items: {
          some: {
            status: PAY_STATUS.PENDING,
            // created_at: {
            //   gte: startDate,
            //   lte: endDate,
            // },
          },
        },
      },
      include: {
        items: true, // Inclui os `invoice items` para cada `invoice`
      },
    });

  }

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
