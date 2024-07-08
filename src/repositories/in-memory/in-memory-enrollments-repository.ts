import { EnrollementState, Enrollment } from '@prisma/client'
import { EnrollmentsRepository } from '../enrollment-repository'
import { randomInt } from 'crypto';

export class InMemoryEnrollmentRepository implements EnrollmentsRepository {
  public items: Enrollment[] = []

  async checkStatus(enrollmentId: number): Promise<{ id: number; state: EnrollementState } | null> {
    const enrollment = this.items.find((item) => item.id === enrollmentId)
    if (!enrollment) {
      return null
    }
    return {
      id: enrollment.id!,
      state: enrollment.state
    }
  }
  async toggleStatus(enrollmentId: number, state: EnrollementState): Promise<{ id: number; status: EnrollementState } | null> {
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
  async create(data: Enrollment): Promise<Enrollment> {
    const enrollment = {
      id: data.id ?? randomInt(9999),
      state: data.state,
      studentId: data.studentId!,
      created_at: new Date(),
      update_at: new Date(),
    }
    this.items.push(enrollment)

    return enrollment

  }
  async searchMany(state: EnrollementState, page: number): Promise<Enrollment[]> {
    return this.items
      .filter((item) => item.state.includes(state))
      .slice((page - 1) * 20, page * 20)
  }
}
