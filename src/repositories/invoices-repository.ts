import { Invoice } from '@prisma/client'

export interface InvoiceRepository {
  createInvoice(data: Omit<Invoice, 'id'>): Promise<Invoice>
  findInvoiceById(invoiceId: number): Promise<Invoice | null>
  findInvoicesByStudent(enrollmentId: number): Promise<Invoice[]>
  updateInvoiceStatus(invoiceId: number, status: string): Promise<Invoice>
}
