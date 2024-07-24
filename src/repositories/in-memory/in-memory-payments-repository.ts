import { Payment, ItemPaymentDetail } from '@prisma/client';
import { randomInt } from 'crypto';
import { PaymentsRepository } from '../payments-repository';

export class InMemoryPaymentsRepository implements PaymentsRepository {
  public payments: Payment[] = [];
  public itemPaymentDetails: ItemPaymentDetail[] = [];

  async findById(paymentId: number): Promise<Payment | null> {
    const payment = this.payments.find((payment) => payment.id === paymentId);
    return payment || null;
  }

  async searchMany(query: string, page: number): Promise<Payment[] | null> {
    return this.payments
      .filter((payment) => payment.state.includes(query))
      .slice((page - 1) * 20, page * 20);
  }

  async findManyByIdentityCardNumber(identityCardNumber: string): Promise<Payment[] | null> {
    const payments = this.payments.filter((payment) => payment.identityCardNumber === identityCardNumber);
    return payments.length > 0 ? payments : null;
  }

  async destroy(paymentId: number): Promise<boolean> {
    const index = this.payments.findIndex((payment) => payment.id === paymentId);
    if (index !== -1) {
      this.payments.splice(index, 1);
      return true;
    }
    return false;
  }

  async create(paymentData: Omit<Payment, 'id' | 'created_at' | 'update_at'>, itemDetailsData: Omit<ItemPaymentDetail, 'id' | 'created_at' | 'update_at' | 'paymentsId'>[]): Promise<Payment> {
    const payment: Payment = {
      ...paymentData,
      id: randomInt(9999),
      created_at: new Date(),
      update_at: new Date(),
    };

    this.payments.push(payment);

    itemDetailsData.forEach(itemData => {
      const itemDetail: ItemPaymentDetail = {
        ...itemData,
        id: randomInt(9999),
        paymentsId: payment.id,
        created_at: new Date(),
        update_at: new Date(),
      };
      this.itemPaymentDetails.push(itemDetail);
    });

    return payment;
  }
}
