import { TransactionRepository } from '@/repositories/transaction-repository';
import { Transaction } from '@prisma/client';
import { TransactionNotFoundError } from '../errors/transaction-not-found';

export class FindTransactionByNumberUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute(transactionNumber: string): Promise<Transaction | null> {
    const transaction = await this.transactionRepository.findTransactionByNumber(transactionNumber);

    if (!transaction) {
      throw new TransactionNotFoundError();
    }

    return transaction;
  }
}
