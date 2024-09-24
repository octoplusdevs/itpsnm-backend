import { PrismaCountyRepository } from '@/repositories/prisma/prisma-county-repository'
import { FetchCountyUseCase } from '../county/fetch-county'

export function makeFetchCountyUseCase() {
  const prismaCountyRepository = new PrismaCountyRepository()
  const fetchCountyUseCase = new FetchCountyUseCase(prismaCountyRepository)

  return fetchCountyUseCase
}
