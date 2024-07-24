import { ItemPaymentDetail } from '@prisma/client';
import { randomInt } from 'crypto';
import { ItemPaymentDetailsRepository } from '../item-payment-detail-repository';

export class InMemoryItemPaymentDetailsRepository implements ItemPaymentDetailsRepository {
  public itemPaymentDetails: ItemPaymentDetail[] = [];

  async findByPaymentId(paymentId: number): Promise<ItemPaymentDetail[] | null> {
    const items = this.itemPaymentDetails.filter((item) => item.paymentsId === paymentId);
    return items.length > 0 ? items : null;
  }

  async destroy(itemPaymentDetailId: number): Promise<boolean> {
    const index = this.itemPaymentDetails.findIndex((item) => item.id === itemPaymentDetailId);
    if (index !== -1) {
      this.itemPaymentDetails.splice(index, 1);
      return true;
    }
    return false;
  }

  async create(data: Omit<ItemPaymentDetail, 'id' | 'created_at' | 'update_at'>): Promise<ItemPaymentDetail> {
    const itemDetail: ItemPaymentDetail = {
      ...data,
      id: randomInt(9999),
      created_at: new Date(),
      update_at: new Date(),
    };

    this.itemPaymentDetails.push(itemDetail);
    return itemDetail;
  }
}
