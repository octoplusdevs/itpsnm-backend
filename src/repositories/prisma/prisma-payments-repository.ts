import { $Enums, PAY_STATUS, Payment, Transaction } from '@prisma/client'
import { PaymentRepository, paymentType } from '../payments-repository'
import { prisma } from '@/lib/prisma'
import { Decimal } from '@prisma/client/runtime/library'

export class PrismaPaymentRepository implements PaymentRepository {
  async findByInvoiceId(invoiceId: number): Promise<{ id: number; used: boolean; created_at: Date; update_at: Date; employeeId: number | null; enrollmentId: number | null; invoiceId: number; totalAmount: Decimal; status: $Enums.PAY_STATUS; transactionId: number | null } | null> {
    return prisma.payment.findUnique({
      where: { id: invoiceId },
      include: { transactions: true, invoice: true, PaymentDetails: true },
    })
  }
  async findManyTransactionsByPaymentId(paymentId: number): Promise<paymentType[]> {
    return prisma.payment.findMany({
      where:{
        id: paymentId
      },
      include:{
        transactions: true
      }
    })
  }

  async createPayment(data: Omit<Payment, 'id'>): Promise<Payment> {
    return prisma.payment.create({
      data,
    })
  }

  async findPaymentById(paymentId: number): Promise<Payment | null> {
    return prisma.payment.findUnique({
      where: { id: paymentId },
      include: { transactions: true, invoice: true, PaymentDetails: true },
    })
  }

  async approvePayment(paymentId: number, employeeId: number, status: PAY_STATUS): Promise<Payment> {
    return prisma.payment.update({
      where: { id: paymentId },
      data: { status, employeeId },
    })
  }

  async updatePaymentStatus(paymentId: number, status: PAY_STATUS): Promise<Payment> {
    return prisma.payment.update({
      where: { id: paymentId },
      data: { status },
    })
  }
  async updatePaymentUsed(paymentId: number, used: boolean): Promise<Payment> {
    return prisma.payment.update({
      where: { id: paymentId },
      data: { used },
    })
  }
  async findByStudentAndInvoice(enrollmentId: number, invoiceId: number, transactionId: number) {
    return await prisma.payment.findFirst({
      where: {
        enrollmentId: enrollmentId,
        invoiceId: invoiceId,
        transactionId
      },
    });
  }
}
