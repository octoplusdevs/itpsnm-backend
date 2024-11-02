import { ItemPrices } from '@prisma/client'
import { ItemPricesRepository } from '@/repositories/item-prices-repository'
import { ItemPriceNotFoundError } from '../errors/item-price-not-found copy'

interface GetItemPriceUseCaseRequest {
  itemPriceId: number
}

interface GetItemPriceUseCaseResponse {
  itemPrice: ItemPrices | null
}

export class GetItemPriceUseCase {
  constructor(private itemPricesRepository: ItemPricesRepository) { }

  async execute({
    itemPriceId
  }: GetItemPriceUseCaseRequest): Promise<GetItemPriceUseCaseResponse> {
    const itemPrice = await this.itemPricesRepository.findById(
      itemPriceId
    )
    if (!itemPrice) {
      throw new ItemPriceNotFoundError()
    }

    return {
      itemPrice,
    }
  }
}
