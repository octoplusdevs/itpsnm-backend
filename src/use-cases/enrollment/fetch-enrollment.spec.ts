import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryEnrollmentRepository } from '@/repositories/in-memory/in-memory-enrollments-repository'
import { FetchEnrollmentUseCase } from './fetch-enrollment'

let enrollmentRepository: InMemoryEnrollmentRepository
let sut: FetchEnrollmentUseCase

describe('Fetch Enrollments Use Case', () => {
  beforeEach(async () => {
    enrollmentRepository = new InMemoryEnrollmentRepository()
    sut = new FetchEnrollmentUseCase(enrollmentRepository)
  })

  it('should be able to fetch all enrollments', async () => {
    await enrollmentRepository.create({
      docsState: 'PENDING',
      paymentState: 'PENDING',
      identityCardNumber: "1",
      courseId: 1,
      levelId: 1,
    })

    await enrollmentRepository.create({
      docsState: 'PENDING',
      paymentState: 'PENDING',
      identityCardNumber: "2",
      courseId: 1,
      levelId: 1,
    })
    await enrollmentRepository.create({
      docsState: 'APPROVED',
      paymentState: 'APPROVED',
      identityCardNumber: "3",
      courseId: 1,
      levelId: 1,
    })

    const { enrollments } = await sut.execute({
      docsState: 'APPROVED',
      paymentState: 'APPROVED',
      page: 1,
    })

    expect(enrollments?.items).toHaveLength(1)
    expect(enrollments?.items).toEqual([
      expect.objectContaining({ docsState: 'APPROVED', paymentState: 'APPROVED' }),
    ])
  })

  it('should be able to fetch paginated enrollment', async () => {

    for (let i = 1; i <= 22; i++) {
      await enrollmentRepository.create({
        docsState: 'REJECTED',
        paymentState: 'REJECTED',
        identityCardNumber: i.toString(),
        courseId: 1,
        levelId: 1,
      })
    }

    const { enrollments } = await sut.execute({
      docsState: 'REJECTED',
      paymentState: 'REJECTED',
      page: 2,
    })

    expect(enrollments?.items).toHaveLength(2)
    expect(enrollments?.items).toEqual([
      expect.objectContaining({ docsState: 'REJECTED' }),
      expect.objectContaining({ paymentState: 'REJECTED' }),
    ])
  })
})
