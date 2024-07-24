import { Receipt } from "@prisma/client";

export interface ReceiptsRepository {
  create(data: Omit<Receipt, 'id' | 'created_at' | 'update_at'>): Promise<Receipt>;
  findById(receiptId: number): Promise<Receipt | null>;
  findManyByTuitionId(tuitionId: number): Promise<Receipt[] | null>;
  destroy(receiptId: number): Promise<boolean>;
}
