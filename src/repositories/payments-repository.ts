import { PAY_STATUS, Payment, Transaction } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library';


export type paymentType = {
  id: number;
  created_at: Date;
  update_at: Date;
  employeeId: number | null;
  enrollmentId: number | null;
  invoiceId: number;
  totalAmount: Decimal;
  status: PAY_STATUS;
  transactionId: number | null;
  transactions?: Transaction[]
}

export interface PaymentRepository {
  findByStudentAndInvoice(studentId: number, invoiceId: number, transactionId: number): Promise<Payment | null>;
  findByInvoiceId(invoiceId: number): Promise<Payment | null>;
  createPayment(data: Omit<Payment, 'id'>): Promise<Payment>
  findPaymentById(paymentId: number): Promise<Payment | null>
  findManyTransactionsByPaymentId(paymentId: number): Promise<paymentType[]>
  approvePayment(paymentId: number, employeeId: number, status: PAY_STATUS): Promise<Payment>
  updatePaymentStatus(paymentId: number, status: string): Promise<Payment>
  updatePaymentUsed(paymentId: number, used: boolean): Promise<Payment>
}
