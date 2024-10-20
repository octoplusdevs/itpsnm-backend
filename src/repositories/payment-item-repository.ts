import { PaymentItem } from '@prisma/client'

export interface PaymentItemRepository {
  findAllPaymentItems(): Promise<PaymentItem[]>
  findPaymentItemById(itemId: number): Promise<PaymentItem | null>
  createPaymentItem(data: Omit<PaymentItem, 'id'>): Promise<PaymentItem>
  updatePaymentItem(itemId: number, data: Partial<PaymentItem>): Promise<PaymentItem>
  deletePaymentItem(itemId: number): Promise<void>
}
