import { InMemoryCoursesRepository } from '@/repositories/in-memory/in-memory-courses-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { DestroyCourseUseCase } from './destroy-course'

let coursesRepository: InMemoryCoursesRepository
let sut: DestroyCourseUseCase

describe('Destroy Course Use Case', () => {
  beforeEach(() => {
    coursesRepository = new InMemoryCoursesRepository()
    sut = new DestroyCourseUseCase(coursesRepository)
  })
  it('should be able to destroy a course', async () => {
    const course = await coursesRepository.create({
      id: 1,
      name: 'Infermagem',
    })

    const response = await sut.execute({id:1})

    expect(response).toBe(true)
  })
})
