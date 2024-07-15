import { PrismaEnrollmentsRepository } from '@/repositories/prisma/prisma-enrollments-repository'
import { FetchEnrollmentUseCase } from '../enrollment/fetch-enrollment'

export function makeFetchEnrollmentUseCase() {
  const prismaEnrollmentsRepository = new PrismaEnrollmentsRepository()
  const useCase = new FetchEnrollmentUseCase(prismaEnrollmentsRepository)

  return useCase
}
