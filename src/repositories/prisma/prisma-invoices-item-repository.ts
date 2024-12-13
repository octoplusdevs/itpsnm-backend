import { InvoiceItem, MonthName } from '@prisma/client'
import { InvoiceItemRepository } from '../invoices-item-repository'
import { prisma } from '@/lib/prisma'

export class PrismaInvoiceItemRepository implements InvoiceItemRepository {
  async findInvoiceItemsByAcademicYearAndMonth(academicYear: string, month: MonthName): Promise<InvoiceItem | null>{
    return await prisma.invoiceItem.findFirst({
      where:{
        academicYear,
        month
      },
    })
  }

  async createInvoiceItem(data: Omit<InvoiceItem, 'id'>): Promise<InvoiceItem> {
    return await prisma.invoiceItem.create({
      data,
    })
  }

  async findInvoiceItemsByInvoiceId(invoiceId: number): Promise<InvoiceItem[]> {
    return await prisma.invoiceItem.findMany({
      where: {
        invoiceId,
      },
    })
  }

  async findInvoiceItemById(itemId: number): Promise<InvoiceItem | null> {
    return await prisma.invoiceItem.findUnique({
      where: {
        id: itemId,
      },
    })
  }

  async updateInvoiceItem(itemId: number, data: Partial<InvoiceItem>): Promise<InvoiceItem> {
    return await prisma.invoiceItem.update({
      where: {
        id: itemId,
      },
      data,
    })
  }

  async deleteInvoiceItem(itemId: number): Promise<void> {
    await prisma.invoiceItem.delete({
      where: {
        id: itemId,
      },
    })
  }
}
