import { PrismaTransactionRepository } from '@/repositories/prisma/prisma-transaction-repository';
import { FindTransactionByNumberUseCase } from '../transaction/get-transaction-by-number';

export function makeFindTransactionByNumberUseCase() {
  const transactionRepository = new PrismaTransactionRepository();
  const useCase = new FindTransactionByNumberUseCase(transactionRepository);

  return useCase;
}
