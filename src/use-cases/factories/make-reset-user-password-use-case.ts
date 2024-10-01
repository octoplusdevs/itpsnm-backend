import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { ResetUserPasswordUseCase } from '../user/reset-user-password'

export function makeResetUserPasswordUseCase() {
  const prismaUserRepository = new PrismaUserRepository()
  const resetUserPasswordUseCase = new ResetUserPasswordUseCase(prismaUserRepository)

  return resetUserPasswordUseCase
}
