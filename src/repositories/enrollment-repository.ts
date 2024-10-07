import { EnrollementState, Enrollment, Student, StudentType } from '@prisma/client'

export interface EnrollmentType {
  id?: number
  courseId?: number | null
  levelId: number
  docsState: EnrollementState
  paymentState: EnrollementState
  student?: Student
  identityCardNumber: string
  classeId?: number | null
  created_at?: Date
  update_at?: Date
}

export interface EnrollT {
  id: number;
  docsState: EnrollementState;
  paymentState: EnrollementState;
  students?: Student;
  identityCardNumber: string
  classeId?: number | null
  courseId?: number | null
  levelId?: number | null
  created_at?: Date
  update_at?: Date
}

export interface EnrollmentsRepository {
  findByIdentityCardNumber(identityCardNumber: string): Promise<EnrollT | any | null>
  checkStatus(enrollmentId: number): Promise<EnrollT | null>
  // findByEnrollmentNumber(enrollmentId: number): Promise<Enrollment | null>
  toggleStatus(enrollmentId: number, docsState: EnrollementState, paymentState: EnrollementState): Promise<{ id: number; docsState: EnrollementState; paymentState: EnrollementState } | null>
  destroy(enrollmentId: number): Promise<Boolean>
  create(data: EnrollmentType): Promise<EnrollmentType>
  searchMany(paymentState: EnrollementState, docsState: EnrollementState, page: number): Promise<{
    totalItems: number;
    currentPage: number;
    totalPages: number;
    items: EnrollmentType[];
  }>
}
