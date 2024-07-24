import { ItemPaymentDetail } from "@prisma/client";

export interface ItemPaymentDetailsRepository {
  create(data: Omit<ItemPaymentDetail, 'id' | 'created_at' | 'update_at'>): Promise<ItemPaymentDetail>;
  findByPaymentId(paymentId: number): Promise<ItemPaymentDetail[] | null>;
  destroy(itemPaymentDetailId: number): Promise<boolean>;
}
