import { PAY_STATUS, Payment } from '@prisma/client'

export interface PaymentRepository {
  findByStudentAndInvoice(studentId: number, invoiceId: number, transactionId: number): Promise<Payment | null>;
  createPayment(data: Omit<Payment, 'id'>): Promise<Payment>
  findPaymentById(paymentId: number): Promise<Payment | null>
  approvePayment(paymentId: number, employeeId: number, status: PAY_STATUS): Promise<Payment>
  updatePaymentStatus(paymentId: number, status: string): Promise<Payment>
}
