import { expect, describe, it, beforeEach } from 'vitest'
import { CreateEnrollmentUseCase } from './create-enrollment'
import { InMemoryEnrollmentRepository } from '@/repositories/in-memory/in-memory-enrollments-repository'

let enrollmentsRepository: InMemoryEnrollmentRepository
let sut: CreateEnrollmentUseCase

describe('Create Enrollment Use Case', () => {
  beforeEach(() => {
    enrollmentsRepository = new InMemoryEnrollmentRepository()
    sut = new CreateEnrollmentUseCase(enrollmentsRepository)
  })
  it('should be able to create a enrollment', async () => {

    let { enrollment } = await sut.execute({
      state: 'PENDING',
      studentId: 1,
    })
    expect(enrollment.studentId).toBe(1)

  })
})
