import { PrismaProvincesRepository } from '@/repositories/prisma/prisma-province-repository'
import { FetchProvinceUseCase } from '../province/fetch-province'

export function makeFetchProvinceUseCase() {
  const prismaProvincesRepository = new PrismaProvincesRepository()
  const fetchProvinceUseCase = new FetchProvinceUseCase(prismaProvincesRepository)

  return fetchProvinceUseCase
}
