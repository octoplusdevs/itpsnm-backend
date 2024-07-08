import { PrismaStudentsRepository } from '@/repositories/prisma/prisma-student-repository'
import { CreateStudentUseCase } from '../student/create-student'

export function makeEnrollmentUseCase() {
  const studentsRepository = new PrismaStudentsRepository()
  const useCase = new CreateStudentUseCase(studentsRepository)

  return useCase
}
