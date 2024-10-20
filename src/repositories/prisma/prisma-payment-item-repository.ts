import { PaymentItem } from '@prisma/client'
import { PaymentItemRepository } from '../payment-item-repository'
import { prisma } from '@/lib/prisma'

export class PrismaPaymentItemRepository implements PaymentItemRepository {

  async findAllPaymentItems(): Promise<PaymentItem[]> {
    return prisma.paymentItem.findMany()
  }

  async findPaymentItemById(itemId: number): Promise<PaymentItem | null> {
    return prisma.paymentItem.findUnique({
      where: { id: itemId },
    })
  }

  async createPaymentItem(data: Omit<PaymentItem, 'id'>): Promise<PaymentItem> {
    return prisma.paymentItem.create({
      data,
    })
  }

  async updatePaymentItem(itemId: number, data: Partial<PaymentItem>): Promise<PaymentItem> {
    return prisma.paymentItem.update({
      where: { id: itemId },
      data,
    })
  }

  async deletePaymentItem(itemId: number): Promise<void> {
    await prisma.paymentItem.delete({
      where: { id: itemId },
    })
  }
}
