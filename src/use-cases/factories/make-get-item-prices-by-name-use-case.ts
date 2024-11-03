import { PrismaItemPriceRepository } from '@/repositories/prisma/prisma-item-price-repository'
import { GetItemPriceByNameUseCase } from '../itemPrices/get-item-price-by-name'
import { PrismaLevelsRepository } from '@/repositories/prisma/prisma-level-repository'

export function makeGetItemPriceByNameUseCase() {
  const itemPriceRepository = new PrismaItemPriceRepository()
  const levelRepository = new PrismaLevelsRepository()
  const getItemPriceUseCase = new GetItemPriceByNameUseCase(itemPriceRepository, levelRepository)

  return getItemPriceUseCase
}
