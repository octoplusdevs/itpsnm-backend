import { expect, describe, it, beforeEach } from 'vitest'
import { FetchCourseUseCase } from './fetch-course'
import { InMemoryCoursesRepository } from '@/repositories/in-memory/in-memory-courses-repository'

let coursesRepository: InMemoryCoursesRepository
let sut: FetchCourseUseCase

describe('Fetch Courses Use Case', () => {
  beforeEach(async () => {
    coursesRepository = new InMemoryCoursesRepository()
    sut = new FetchCourseUseCase(coursesRepository)
  })

  it('should be able to fetch a course', async () => {
    await coursesRepository.create({
      name: 'curso 01',
    })

    await coursesRepository.create({
      name: 'curso 02',
    })

    const { courses } = await sut.execute({
      name: 'curso 01',
      page: 1,
    })

    expect(courses).toHaveLength(1)
    expect(courses).toEqual([
      expect.objectContaining({ name: 'curso 01' }),
    ])
  })

  it('should be able to fetch paginated course', async () => {
    for (let i = 1; i <= 22; i++) {
      await coursesRepository.create({
        name: `course-${i}`,
      })
    }

    const { courses } = await sut.execute({
      name: 'course',
      page: 2,
    })

    expect(courses).toHaveLength(2)
    expect(courses).toEqual([
      expect.objectContaining({ name: 'course-21' }),
      expect.objectContaining({ name: 'course-22' }),
    ])
  })
})
