import { PrismaProvincesRepository } from '@/repositories/prisma/prisma-province-repository'
import { DestroyProvinceUseCase } from '../province/destroy-province'

export function makeDestroyProvinceUseCase() {
  const prismaProvincesRepository = new PrismaProvincesRepository()
  const destroyProvinceUseCase = new DestroyProvinceUseCase(prismaProvincesRepository)

  return destroyProvinceUseCase
}
