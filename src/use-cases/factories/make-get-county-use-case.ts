import { GetCountyUseCase } from '../county/get-county'
import { PrismaCountyRepository } from '@/repositories/prisma/prisma-county-repository'

export function makeGetCountyUseCase() {
  const prismaCountyRepository = new PrismaCountyRepository()
  const getCountyUseCase = new GetCountyUseCase(prismaCountyRepository)

  return getCountyUseCase
}
