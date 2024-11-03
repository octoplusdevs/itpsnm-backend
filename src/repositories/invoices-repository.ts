import { Invoice, InvoiceType, PAY_STATUS, Prisma } from '@prisma/client'

export interface InvoiceRepository {
  createInvoice(data: Omit<Invoice, 'id'>): Promise<Invoice>
  findInvoiceById(invoiceId: number): Promise<Invoice | null>
  findInvoicesByStudent(enrollmentId: number): Promise<Invoice[]>
  findInvoicesByStudentAndType(enrollmentId: number, type: InvoiceType, status: PAY_STATUS): Promise<Invoice[]>
  updateInvoiceStatus(invoiceId: number, status: PAY_STATUS): Promise<Invoice>
  updateInvoice(id: number, data: Prisma.InvoiceUncheckedUpdateInput): Promise<Invoice>
}
