import { PrismaCoursesRepository } from '@/repositories/prisma/prisma-course-repository'
import { GetCourseUseCase } from '../course/get-course'

export function makeGetCourseUseCase() {
  const prismaCoursesRepository = new PrismaCoursesRepository()
  const getCourseUseCase = new GetCourseUseCase(prismaCoursesRepository)

  return getCourseUseCase
}
