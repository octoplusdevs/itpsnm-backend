import { InMemoryCoursesRepository } from '@/repositories/in-memory/in-memory-courses-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { CreateCourseUseCase } from './create-course'

let gymsRepository: InMemoryCoursesRepository
let sut: CreateCourseUseCase

describe('Create Course Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryCoursesRepository()
    sut = new CreateCourseUseCase(gymsRepository)
  })
  it('should be able to create course', async () => {
    const { course } = await sut.execute({
      name: 'Infermagem',
    })

    expect(course.id).toEqual(expect.any(Number))
  })
})
