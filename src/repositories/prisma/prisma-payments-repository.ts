import { prisma } from '@/lib/prisma';
import { Document, ItemPaymentDetail, Payment, Prisma } from '@prisma/client';
import { DocumentsRepository } from '../documents-repository';
import { PaymentsRepository } from '../payments-repository';

export class PrismaPaymentRepository implements PaymentsRepository {
  async create(paymentData: Omit<Payment, 'id' | 'created_at' | 'update_at'>, itemDetailsData: Omit<ItemPaymentDetail, 'id' | 'created_at' | 'update_at' | 'paymentsId'>[]): Promise<Payment> {
    let payment = await prisma.payment.create({
      data: {
        identityCardNumber: paymentData.identityCardNumber,
        amount_paid: paymentData.amount_paid,
        date: paymentData.date,
        state: paymentData.state,
        item_payment_details: {
          createMany: {
            data: {
              price: itemDetailsData.price,
              type: itemDetailsData.type,
              quantity: itemDetailsData,
              price: itemDetailsData,
            }
          }
        }
      }
    })
    return payment
  }
  findById(paymentId: number): Promise<Payment | null> {
    throw new Error('Method not implemented.');
  }
  findManyByIdentityCardNumber(identityCardNumber: string): Promise<Payment[] | null> {
    throw new Error('Method not implemented.');
  }
  destroy(paymentId: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  searchMany(query: string, page: number): Promise<Payment[] | null> {
    throw new Error('Method not implemented.');
  }

}