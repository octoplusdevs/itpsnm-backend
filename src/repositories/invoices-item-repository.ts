import { InvoiceItem } from '@prisma/client'

export interface InvoiceItemRepository {
  createInvoiceItem(data: Omit<InvoiceItem, 'id'>): Promise<InvoiceItem>
  findInvoiceItemsByInvoiceId(invoiceId: number): Promise<InvoiceItem[]>
  findInvoiceItemById(itemId: number): Promise<InvoiceItem | null>
  updateInvoiceItem(itemId: number, data: Partial<InvoiceItem>): Promise<InvoiceItem>
  deleteInvoiceItem(itemId: number): Promise<void>
}
