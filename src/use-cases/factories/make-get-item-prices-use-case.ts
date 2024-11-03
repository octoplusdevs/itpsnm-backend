import { GetItemPriceUseCase } from '../itemPrices/get-item-price'
import { PrismaItemPriceRepository } from '@/repositories/prisma/prisma-item-price-repository'

export function makeGetItemPriceUseCase() {
  const itemPriceRepository = new PrismaItemPriceRepository()
  const getItemPriceUseCase = new GetItemPriceUseCase(itemPriceRepository)

  return getItemPriceUseCase
}
