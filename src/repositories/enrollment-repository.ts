import { EnrollementState, Enrollment, Prisma, Student, StudentType } from '@prisma/client'

export interface EnrollmentType {
  id?: number
  courseId?: number | null
  academicYear: string,
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
  academicYear: string;
  identityCardNumber: string
  classeId?: number | null
  courseId?: number | null
  levelId?: number | null
  isEnrolled?: number | null
  created_at?: Date
  update_at?: Date
}

export interface EnrollmentsRepository {
  findByIdentityCardNumber(identityCardNumber: string): Promise<Enrollment | null>
  checkStatus(enrollmentId: number): Promise<EnrollT | null>
  // findByEnrollmentNumber(enrollmentId: number): Promise<Enrollment | null>
  toggleStatus(enrollmentId: number, docsState: EnrollementState, paymentState: EnrollementState): Promise<{ id: number; docsState: EnrollementState; paymentState: EnrollementState } | null>
  destroy(enrollmentId: number): Promise<Boolean>
  create(data: EnrollmentType): Promise<EnrollmentType>
  update(enrollmentId: number, data: Prisma.EnrollmentUncheckedUpdateInput): Promise<Enrollment>
  searchMany(paymentState: EnrollementState, docsState: EnrollementState, page: number): Promise<{
    totalItems: number;
    currentPage: number;
    totalPages: number;
    items: EnrollmentType[];
  }>
}
