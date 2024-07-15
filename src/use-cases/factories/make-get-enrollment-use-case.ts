import { PrismaEnrollmentsRepository } from '@/repositories/prisma/prisma-enrollments-repository'
import { GetEnrollmentUseCase } from '../enrollment/get-enrollment'

export function makeGetEnrollmentUseCase() {
  const prismaEnrollmentsRepository = new PrismaEnrollmentsRepository()
  const useCase = new GetEnrollmentUseCase(prismaEnrollmentsRepository)

  return useCase
}
