import { Transaction } from '@prisma/client'
import { TransactionRepository } from '../transaction-repository'
import { prisma } from '@/lib/prisma'
import { Decimal } from '@prisma/client/runtime/library'

export class PrismaTransactionRepository implements TransactionRepository {
  async findTransactionById(id: number): Promise<{ id: number; paymentId: number | null; transactionNumber: string; amount: Decimal; enrollmentId: number; date: Date; employeeId: number | null; used: boolean; } | null> {
    return await prisma.transaction.findUnique({
      where: { id },
    })
  }
  async updateTransactionStatus(transactionNumber: string, used: boolean): Promise<{ id: number; transactionNumber: string; amount: Decimal; date: Date; used: boolean; paymentId: number | null; enrollmentId: number; employeeId: number | null }> {
    return await prisma.transaction.update({
      where: {
        transactionNumber
      },
      data: {
        used
      }
    })
  }
  async createTransaction(data: Omit<Transaction, 'id'>): Promise<Transaction> {
    return await prisma.transaction.create({
      data,
    })
  }

  async findTransactionByNumber(transactionNumber: string): Promise<Transaction | null> {
    return await prisma.transaction.findUnique({
      where: { transactionNumber },
    })
  }

  async findTransactionsByStudent(enrollmentId: number, page: number): Promise<{
    totalItems: number;
    currentPage: number;
    totalPages: number;
    items: Transaction[];
  }> {
    let pageSize = 20
    let transactions = await prisma.transaction.findMany({
      where: { enrollmentId },
      skip: (page - 1) * pageSize,
      take: pageSize
    })
    const totalItems = transactions.length;

    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      totalItems,
      currentPage: page,
      totalPages,
      items: transactions
    };
  }
}
