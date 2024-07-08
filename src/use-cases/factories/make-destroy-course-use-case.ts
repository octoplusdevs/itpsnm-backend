import { PrismaCoursesRepository } from '@/repositories/prisma/prisma-course-repository'
import { DestroyCourseUseCase } from '../course/destroy-course'

export function makeDestroyCourseUseCase() {
  const prismaCoursesRepository = new PrismaCoursesRepository()
  const destroyCourseUseCase = new DestroyCourseUseCase(prismaCoursesRepository)

  return destroyCourseUseCase
}
