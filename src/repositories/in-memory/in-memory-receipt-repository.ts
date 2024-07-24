import { Receipt } from '@prisma/client';
import { randomInt } from 'crypto';
import { ReceiptsRepository } from '../receipt-repository';

export class InMemoryReceiptsRepository implements ReceiptsRepository {
  public receipts: Receipt[] = [];

  async findById(receiptId: number): Promise<Receipt | null> {
    const receipt = this.receipts.find((receipt) => receipt.id === receiptId);
    return receipt || null;
  }

  async findManyByTuitionId(tuitionId: number): Promise<Receipt[] | null> {
    const receipts = this.receipts.filter((receipt) => receipt.tuition_id === tuitionId);
    return receipts.length > 0 ? receipts : null;
  }

  async destroy(receiptId: number): Promise<boolean> {
    const index = this.receipts.findIndex((receipt) => receipt.id === receiptId);
    if (index !== -1) {
      this.receipts.splice(index, 1);
      return true;
    }
    return false;
  }

  async create(data: Omit<Receipt, 'id' | 'created_at' | 'update_at'>): Promise<Receipt> {
    const receipt: Receipt = {
      ...data,
      id: randomInt(9999),
      created_at: new Date(),
      update_at: new Date(),
    };

    this.receipts.push(receipt);
    return receipt;
  }
}
