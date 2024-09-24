import { FetchCourseUseCase } from '../course/fetch-course'
import { PrismaCoursesRepository } from '@/repositories/prisma/prisma-course-repository'

export function makeFetchCourseUseCase() {
  const prismaCoursesRepository = new PrismaCoursesRepository()
  const fetchCourseUseCase = new FetchCourseUseCase(prismaCoursesRepository)

  return fetchCourseUseCase
}
