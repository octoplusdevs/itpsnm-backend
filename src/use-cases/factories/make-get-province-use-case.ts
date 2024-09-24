import { PrismaProvincesRepository } from '@/repositories/prisma/prisma-province-repository'
import { GetProvinceUseCase } from '../province/get-province'

export function makeGetProvinceUseCase() {
  const prismaProvinceRepository = new PrismaProvincesRepository()
  const getProvinceUseCase = new GetProvinceUseCase(prismaProvinceRepository)

  return getProvinceUseCase
}
