import { CreateCourseUseCase } from '../course/create-course'
import { PrismaCoursesRepository } from '@/repositories/prisma/prisma-course-repository'

export function makeCourseUseCase() {
  const prismaCoursesRepository = new PrismaCoursesRepository()
  const createCourseUseCase = new CreateCourseUseCase(prismaCoursesRepository)

  return createCourseUseCase
}
