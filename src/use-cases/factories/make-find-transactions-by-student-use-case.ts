import { PrismaTransactionRepository } from '@/repositories/prisma/prisma-transaction-repository';
import { FindTransactionsByStudentUseCase } from '../transaction/get-transaction-by-student';

export function makeFindTransactionsByStudentUseCase() {
  const transactionRepository = new PrismaTransactionRepository();
  const useCase = new FindTransactionsByStudentUseCase(transactionRepository);

  return useCase;
}
