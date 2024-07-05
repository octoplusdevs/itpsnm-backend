import { EnrollementState, Enrollment, Prisma, Student } from '@prisma/client'
import { EnrollmentType, EnrollmentsRepository } from '../enrollment-repository'
import { randomInt } from 'crypto';

export class InMemoryEnrollmentRepository implements EnrollmentsRepository {
  public items: EnrollmentType[] = []

  async checkStatus(enrollmentId: number): Promise<{id: number; status: EnrollementState } | null> {
    const enrollment = this.items.find((item) => item.id === enrollmentId)
    if (!enrollment) {
      return null
    }
    return {
      id: enrollment.id!,
      status: enrollment.state
    }
  }
  async toggleStatus(enrollmentId: number, state: EnrollementState): Promise<{id: number; status: EnrollementState } | null> {
    const enrollment = this.items.find((item) => item.id === enrollmentId)
    if (!enrollment) {
      return null
    }
    enrollment.state = state
    return {
      id: enrollment.id!,
      status: enrollment.state
    }
  }
  async destroy(enrollmentId: number): Promise<boolean> {
    const index = this.items.findIndex((item) => item.id === enrollmentId)
    if (index !== -1) {
      this.items.splice(index, 1)
      return true
    }
    return false
  }
  async create(data: EnrollmentType): Promise<EnrollmentType> {
    const enrollment = {
      id:  data.id ?? randomInt(9999),
      state: data.state,
      studentId: data.studentId,
      created_at: new Date(),
      update_at: new Date(),
    }
    this.items.push(enrollment)

    return enrollment

  }
  async fetchAllPending(): Promise<EnrollmentType[]> {
    const enrollments = this.items.filter((item) => item.state === 'PENDING')
    return enrollments
  }
}
