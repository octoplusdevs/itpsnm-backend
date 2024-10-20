import { Transaction } from '@prisma/client'

export interface TransactionRepository {
  createTransaction(data: Omit<Transaction, 'id'>): Promise<Transaction>
  updateTransactionStatus(transactionNumber: string, used: boolean): Promise<Transaction>
  findTransactionByNumber(transactionNumber: string): Promise<Transaction | null>
  findTransactionsByStudent(enrollmentId: number, page: number): Promise<{
    totalItems: number;
    currentPage: number;
    totalPages: number;
    items: Transaction[];
  }>
}
