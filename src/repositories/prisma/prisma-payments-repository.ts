import { Payment, PAY_STATUS } from '@prisma/client'
import { PaymentRepository } from '../payments-repository'
import { prisma } from '@/lib/prisma'
import { Decimal } from '@prisma/client/runtime/library'

export class PrismaPaymentRepository implements PaymentRepository {

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
