import { BlockUserUseCase } from '../user/block-user'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'

export function makeBlockUserUseCase() {
  const prismaUserRepository = new PrismaUserRepository()
  const blockUserUseCase = new BlockUserUseCase(prismaUserRepository)

  return blockUserUseCase
}
