import { PrismaStudentsRepository } from '@/repositories/prisma/prisma-student-repository'
import { CreateEnrollmentUseCase } from '../enrollment/create-enrollment'
import { PrismaEnrollmentsRepository } from '@/repositories/prisma/prisma-enrollments-repository'

export function makeEnrollmentUseCase() {
  const enrollmentRepository = new PrismaEnrollmentsRepository()
  const studentsRepository = new PrismaStudentsRepository()
  const useCase = new CreateEnrollmentUseCase(studentsRepository, enrollmentRepository)

  return useCase
}
