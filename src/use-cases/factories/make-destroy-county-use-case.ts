import { PrismaCountyRepository } from '@/repositories/prisma/prisma-county-repository'
import { DestroyCountyUseCase } from '../county/destroy-county'

export function makeDestroyCountyUseCase() {
  const prismaCountyRepository = new PrismaCountyRepository()
  const destroyCountyUseCase = new DestroyCountyUseCase(prismaCountyRepository)

  return destroyCountyUseCase
}
