import { PrismaItemPriceRepository } from '@/repositories/prisma/prisma-item-price-repository'
import { GetItemPriceByNameUseCase } from '../itemPrices/get-item-price-by-name'

export function makeGetItemPriceByNameUseCase() {
  const itemPriceRepository = new PrismaItemPriceRepository()
  const getItemPriceUseCase = new GetItemPriceByNameUseCase(itemPriceRepository)

  return getItemPriceUseCase
}
