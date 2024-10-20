import { StudentBalance } from '@prisma/client'

export interface StudentBalanceRepository {
  getBalanceByStudent(enrollmentId: number): Promise<StudentBalance | null>
  updateStudentBalance(enrollmentId: number, newBalance: number): Promise<StudentBalance>
  increaseBalance(enrollmentId: number, amount: number): Promise<StudentBalance>
  decreaseBalance(enrollmentId: number, amount: number): Promise<StudentBalance>
}
