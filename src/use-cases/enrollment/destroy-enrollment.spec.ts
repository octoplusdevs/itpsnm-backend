import { expect, describe, it, beforeEach } from 'vitest'
import { DestroyEnrollmentUseCase } from './destroy-enrollment'
import { InMemoryEnrollmentRepository } from '@/repositories/in-memory/in-memory-enrollments-repository'

let enrollmentsRepository: InMemoryEnrollmentRepository
let sut: DestroyEnrollmentUseCase

describe('Destroy Enrollment Use Case', () => {
  beforeEach(() => {
    enrollmentsRepository = new InMemoryEnrollmentRepository()
    sut = new DestroyEnrollmentUseCase(enrollmentsRepository)
  })
  it('should be able to destroy a enrollment', async () => {
    const enrollment = await enrollmentsRepository.create({
      state: 'PENDING',
      studentId: 1,
      courseId: 1,
      levelId: 1,
    })
    const response = await sut.execute({ enrollmentId: enrollment.id! })

    expect(response).toBe(true)
  })
  it('should be able to destroy a inexisting enrollment', async () => {
    expect(await sut.execute({ enrollmentId: 1 })).toBe(false)
  })
})
