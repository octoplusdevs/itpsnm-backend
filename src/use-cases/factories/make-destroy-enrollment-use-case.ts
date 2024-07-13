import { PrismaEnrollmentsRepository } from '@/repositories/prisma/prisma-enrollments-repository'
import { DestroyEnrollmentUseCase } from '../enrollment/destroy-enrollment'

export function makeDestroyEnrollmentUseCase() {
  const prismaEnrollmentsRepository = new PrismaEnrollmentsRepository()
  const destroyEnrollmentUseCase = new DestroyEnrollmentUseCase(prismaEnrollmentsRepository)

  return destroyEnrollmentUseCase
}
