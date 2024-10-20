import { StudentBalance } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { StudentBalanceRepository } from '../student-balance-repository'

export class PrismaStudentBalanceRepository implements StudentBalanceRepository {

  async getBalanceByStudent(enrollmentId: number): Promise<StudentBalance | null> {
    return prisma.studentBalance.findUnique({
      where: { enrollmentId },
    })
  }

  async updateStudentBalance(enrollmentId: number, newBalance: number): Promise<StudentBalance> {
    return prisma.studentBalance.update({
      where: { enrollmentId },
      data: { balance: newBalance },
    })
  }

  async increaseBalance(enrollmentId: number, amount: number): Promise<StudentBalance> {
    const balance = await this.getBalanceByStudent(enrollmentId)
    return this.updateStudentBalance(enrollmentId, Number(balance?.balance || 0) + amount)
  }

  async decreaseBalance(studentId: number, amount: number): Promise<StudentBalance> {
    const balance = await this.getBalanceByStudent(studentId)
    return this.updateStudentBalance(studentId, Number(balance?.balance || 0) - amount)
  }
}
