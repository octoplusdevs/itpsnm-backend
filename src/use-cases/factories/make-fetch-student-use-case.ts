import { PrismaStudentsRepository } from '@/repositories/prisma/prisma-student-repository'
import { FetchStudentUseCase } from '../student/fetch-student'

export function makeFetchStudentUseCase() {
  const prismaStudentsRepository = new PrismaStudentsRepository()
  const fetchStudentUseCase = new FetchStudentUseCase(prismaStudentsRepository)

  return fetchStudentUseCase
}
