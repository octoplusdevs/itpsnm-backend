import { ItemPrices } from '@prisma/client'
import { ItemPricesRepository } from '@/repositories/item-prices-repository'
import { ItemPriceNotFoundError } from '../errors/item-price-not-found copy'

interface GetItemPriceUseCaseRequest {
  levelId: number
  itemName: string
}

interface GetItemPriceUseCaseResponse {
  itemPrice: ItemPrices | null
}

export class GetItemPriceByNameUseCase {
  constructor(private itemPricesRepository: ItemPricesRepository) { }

  async execute({
    itemName,
    levelId
  }: GetItemPriceUseCaseRequest): Promise<GetItemPriceUseCaseResponse> {
    const itemPrice = await this.itemPricesRepository.findByName(
      itemName, levelId
    )
    if (!itemPrice) {
      throw new ItemPriceNotFoundError()
    }

    return {
      itemPrice,
    }
  }
}
