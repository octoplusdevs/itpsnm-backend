import { PrismaItemPriceRepository } from '@/repositories/prisma/prisma-item-price-repository'
import { FetchItemPricesUseCase } from '../itemPrices/fetch-item-prices'

export function makeFetchItemPricesUseCase() {
  const prismaItemPriceRepository = new PrismaItemPriceRepository()
  const fetchItemPricesUseCase = new FetchItemPricesUseCase(prismaItemPriceRepository)

  return fetchItemPricesUseCase
}
