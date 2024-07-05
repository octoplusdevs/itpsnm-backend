import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryEnrollmentRepository } from '@/repositories/in-memory/in-memory-enrollments-repository'
import { FetchEnrollmentUseCase } from './fetch-enrollment'

let enrollmentRepository: InMemoryEnrollmentRepository
let sut: FetchEnrollmentUseCase

describe('Fetch Courses Use Case', () => {
  beforeEach(async () => {
    enrollmentRepository = new InMemoryEnrollmentRepository()
    sut = new FetchEnrollmentUseCase(enrollmentRepository)
  })

  it('should be able to fetch all enrollments', async () => {
    await enrollmentRepository.create({
      state: 'PENDING',
      studentId: 1,
    })

    await enrollmentRepository.create({
      state: 'PENDING',
      studentId: 1,
    })
    await enrollmentRepository.create({
      state: 'APPROVED',
      studentId: 1,
    })

    const { enrollments } = await sut.execute({
      state: 'APPROVED',
      page: 1,
    })

    expect(enrollments).toHaveLength(1)
    expect(enrollments).toEqual([
      expect.objectContaining({ state: 'APPROVED' }),
    ])
  })

  it('should be able to fetch paginated enrollment', async () => {

    for (let i = 1; i <= 22; i++) {
      await enrollmentRepository.create({
        state: 'REJECTED',
        studentId: 1,
      })
    }

    const { enrollments } = await sut.execute({
      state: 'REJECTED',
      page: 2,
    })

    expect(enrollments).toHaveLength(2)
    expect(enrollments).toEqual([
      expect.objectContaining({ state: 'REJECTED' }),
      expect.objectContaining({ state: 'REJECTED' }),
    ])
  })
})
