import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { FetchUserUseCase } from '../user/fetch-student'

export function makeFetchUsersUseCase() {
  const prismaUserRepository = new PrismaUserRepository()
  const fetchUserUseCase = new FetchUserUseCase(prismaUserRepository)

  return fetchUserUseCase
}
