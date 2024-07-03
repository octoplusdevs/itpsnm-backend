import { Prisma, Enrollment, EnrollementState } from '@prisma/client'

export interface EnrollmentsRepository {
  checkStatus(studentId: number): Promise<Enrollment | null>
  toggleStatus(studentId: number, state: EnrollementState): Promise<Enrollment | null>
  destroy(studentId: number): Promise<void>
  create(data: Prisma.StudentCreateInput): Promise<Enrollment>
  fetchAllPending(): Promise<Enrollment>
}
