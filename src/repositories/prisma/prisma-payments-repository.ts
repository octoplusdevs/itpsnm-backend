import { Payment, PAY_STATUS } from '@prisma/client'
import { PaymentRepository } from '../payments-repository'
import { prisma } from '@/lib/prisma'

export class PrismaPaymentRepository implements PaymentRepository {

  async createPayment(data: Omit<Payment, 'id'>): Promise<Payment> {
    return prisma.payment.create({
      data,
    })
  }

  async findPaymentById(paymentId: number): Promise<Payment | null> {
    return prisma.payment.findUnique({
      where: { id: paymentId },
      include: { transaction: true, invoice: true, PaymentDetails: true },
    })
  }

  async approvePayment(paymentId: number, employeeId: number): Promise<Payment> {
    return prisma.payment.update({
      where: { id: paymentId },
      data: { status: PAY_STATUS.PAID, employeeId },
    })
  }

  async updatePaymentStatus(paymentId: number, status: PAY_STATUS): Promise<Payment> {
    return prisma.payment.update({
      where: { id: paymentId },
      data: { status },
    })
  }
  async findByStudentAndInvoice(enrollmentId: number, invoiceId: number) {
    return await prisma.payment.findFirst({
      where: {
        enrollmentId: enrollmentId,
        invoiceId: invoiceId,
      },
    });
  }
}
