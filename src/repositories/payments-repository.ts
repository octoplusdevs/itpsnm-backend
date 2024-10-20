import { Payment } from '@prisma/client'

export interface PaymentRepository {
  findByStudentAndInvoice(studentId: number, invoiceId: number): Promise<Payment | null>;
  createPayment(data: Omit<Payment, 'id'>): Promise<Payment>
  findPaymentById(paymentId: number): Promise<Payment | null>
  approvePayment(paymentId: number, employeeId: number): Promise<Payment>
  updatePaymentStatus(paymentId: number, status: string): Promise<Payment>
}
