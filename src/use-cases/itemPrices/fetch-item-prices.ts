import { ItemPricesRepository } from '@/repositories/item-prices-repository';
import { ItemPrices } from '@prisma/client';

interface FetchItemPriceDTO {
  levelId: number,
  page: number
}

export class FetchItemPricesUseCase {
  constructor(private itemPricesRepository: ItemPricesRepository) { }

  async execute({ levelId, page }: FetchItemPriceDTO): Promise<ItemPrices[] | null> {
    const allItemPrices = await this.itemPricesRepository.searchMany(levelId, page);

    return allItemPrices;
  }
}
