import { Payment, ItemPaymentDetail } from "@prisma/client";

export interface PaymentsRepository {
  create(paymentData: Omit<Payment, 'id' | 'created_at' | 'update_at'>, itemDetailsData: Omit<ItemPaymentDetail, 'id' | 'created_at' | 'update_at' | 'paymentsId'>[]): Promise<Payment>;
  findById(paymentId: number): Promise<Payment | null>;
  findManyByIdentityCardNumber(identityCardNumber: string): Promise<Payment[] | null>;
  destroy(paymentId: number): Promise<boolean>;
  searchMany(query: string, page: number): Promise<Payment[] | null>;
}
