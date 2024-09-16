import { expect, describe, it, beforeEach } from 'vitest'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { GetEnrollmentUseCase } from './get-enrollment'
import { InMemoryEnrollmentRepository } from '@/repositories/in-memory/in-memory-enrollments-repository'
import { EnrollmentNotFoundError } from '../errors/enrollment-not-found'

let enrollmentsRepository: InMemoryEnrollmentRepository
let sut: GetEnrollmentUseCase

describe('Get Enrollment Use Case', () => {
  beforeEach(async () => {
    enrollmentsRepository = new InMemoryEnrollmentRepository()
    sut = new GetEnrollmentUseCase(enrollmentsRepository)
  })

  it('should be able to get a enrollment by id', async () => {
    await enrollmentsRepository.create({
      id: 1,
      docsState: 'APPROVED',
      paymentState: 'REJECTED',
      identityCardNumber: "1",
      classeId: 1,
      courseId: 1,
      levelId: 1,
      created_at: new Date(),
      update_at: new Date(),
    })
    const { enrollment } = await sut.execute({
      enrollmentNumber: 1
    })
    expect(enrollment?.id).toBe(1)
    expect(enrollment?.docsState).toEqual('APPROVED')
    expect(enrollment?.paymentState).toEqual('REJECTED')
  })
  it('should not be able to get enrollment with wrong id', async () => {
    await expect(() =>
      sut.execute({
        enrollmentNumber: -1,
      }),
    ).rejects.toBeInstanceOf(EnrollmentNotFoundError)
  })
})
