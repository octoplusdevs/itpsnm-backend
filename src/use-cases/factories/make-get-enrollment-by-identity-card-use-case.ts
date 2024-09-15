import { PrismaEnrollmentsRepository } from '@/repositories/prisma/prisma-enrollments-repository'
import { GetEnrollmentByIdentityCardUseCase } from '../enrollment/get-enrollment-by-identity-card'

export function makeGetEnrollmentByIdentityCardUseCase() {
  const prismaEnrollmentsRepository = new PrismaEnrollmentsRepository()
  const useCase = new GetEnrollmentByIdentityCardUseCase(prismaEnrollmentsRepository)

  return useCase
}
