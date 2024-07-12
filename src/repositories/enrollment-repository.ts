import { EnrollementState, Enrollment } from '@prisma/client'

export interface EnrollmentType {
  id?: number
  studentId: number | null
  state: EnrollementState
  classeId?: number | null
  courseId: number | null
  levelId: number | null
  created_at?: Date
  update_at?: Date
}
export interface EnrollmentsRepository {
  findByStudentId(studentId: number): Promise<EnrollmentType | null>
  checkStatus(enrollmentId: number): Promise<{ id: number; state: EnrollementState } | null>
  toggleStatus(enrollmentId: number, state: EnrollementState): Promise<{ id: number; status: EnrollementState } | null>
  destroy(enrollmentId: number): Promise<Boolean>
  create(data: EnrollmentType): Promise<EnrollmentType>
  searchMany(state: EnrollementState, page: number): Promise<EnrollmentType[]>
}
