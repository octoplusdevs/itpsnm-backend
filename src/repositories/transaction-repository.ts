import { Prisma, Transaction } from '@prisma/client'

export interface TransactionRepository {
  createTransaction(data: Omit<Transaction, 'id'>): Promise<Transaction>
  updateTransactionStatus(transactionNumber: string, used: boolean): Promise<Transaction>
  updateTransactionStatusByPaymentId(paymentId: number, used: boolean): Promise<Prisma.BatchPayload>
  findTransactionByNumber(transactionNumber: string): Promise<Transaction | null>
  findTransactionById(id: number): Promise<Transaction | null>
  findTransactionsByStudent(enrollmentId: number, page: number): Promise<{
    totalItems: number;
    currentPage: number;
    totalPages: number;
    items: Transaction[];
  }>
}
