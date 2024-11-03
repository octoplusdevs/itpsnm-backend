import { ItemPrices } from '@prisma/client'
import { ItemPricesRepository } from '@/repositories/item-prices-repository'
import { ItemPriceNotFoundError } from '../errors/item-price-not-found copy'
import { LevelsRepository } from '@/repositories/level-repository'
import { LevelNotFoundError } from '../errors/level-not-found'

interface GetItemPriceUseCaseRequest {
  levelId: number
  itemName: string
}

interface GetItemPriceUseCaseResponse {
  itemPrice: ItemPrices | null
}

export class GetItemPriceByNameUseCase {
  constructor(
    private itemPricesRepository: ItemPricesRepository,
    private levelsRepository: LevelsRepository
  ) { }

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

    const levels = await this.levelsRepository.findById(
      levelId
    )
    if (!levels) {
      throw new LevelNotFoundError()
    }

    return {
      itemPrice,
    }
  }
}
