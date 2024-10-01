import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { GetUserUseCase } from '../user/get-student'

export function makeGetUserUseCase() {
  const prismaUserRepository = new PrismaUserRepository()
  const getUserUseCase = new GetUserUseCase(prismaUserRepository)

  return getUserUseCase
}
