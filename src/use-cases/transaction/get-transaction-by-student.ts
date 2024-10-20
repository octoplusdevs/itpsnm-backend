import { TransactionRepository } from '@/repositories/transaction-repository';
import { Transaction } from '@prisma/client';
import { TransactionNotFoundError } from '../errors/transaction-not-found';

interface GetTransactionUseCaseRequest {
  page: number
  enrollmentId: number
}

interface GetTransactionUseCaseResponse {
  transactions: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    items: Transaction[];
  }
}

export class FindTransactionsByStudentUseCase {
  constructor(private transactionRepository: TransactionRepository) { }

  async execute({ enrollmentId, page }: GetTransactionUseCaseRequest): Promise<GetTransactionUseCaseResponse> {
    const transactions = await this.transactionRepository.findTransactionsByStudent(enrollmentId, page);

    if (transactions.totalItems === 0) {
      throw new TransactionNotFoundError();
    }

    return { transactions };
  }
}
