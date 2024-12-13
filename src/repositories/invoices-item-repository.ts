import { InvoiceItem, MonthName } from '@prisma/client'

export interface InvoiceItemRepository {
  createInvoiceItem(data: Omit<InvoiceItem, 'id'>): Promise<InvoiceItem>
  findInvoiceItemsByInvoiceId(invoiceId: number): Promise<InvoiceItem[]>
  findInvoiceItemsByAcademicYearAndMonth(academicYear: string, month: MonthName): Promise<InvoiceItem | null>
  findInvoiceItemById(itemId: number): Promise<InvoiceItem | null>
  updateInvoiceItem(itemId: number, data: Partial<InvoiceItem>): Promise<InvoiceItem>
  deleteInvoiceItem(itemId: number): Promise<void>
}
