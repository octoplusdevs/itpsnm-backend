import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCoursesRepository } from '@/repositories/in-memory/in-memory-courses-repository'
import { GetCourseUseCase } from './get-course'
import { ResourceNotFoundError } from '../errors/resource-not-found'

let coursesRepository: InMemoryCoursesRepository
let sut: GetCourseUseCase

describe('Get Course Use Case', () => {
  beforeEach(async () => {
    coursesRepository = new InMemoryCoursesRepository()
    sut = new GetCourseUseCase(coursesRepository)
  })

  it('should be able to get a course by id', async () => {
    await coursesRepository.create({
      id: 1,
      name: 'curso 01',
    })

    await coursesRepository.create({
      id: 2,
      name: 'curso 02',
    })

    const { course } = await sut.execute({
      courseId: 2
    })

    expect(course?.id).toEqual(2)
    expect(course?.name).toEqual('curso 02')
  })
  it('should not be able to get course with wrong id', async () => {
    await expect(() =>
      sut.execute({
        courseId: -1,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
