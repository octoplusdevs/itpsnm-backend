import { ItemPrices } from '@prisma/client';
import { ItemPricesRepository } from '@/repositories/price-repository';

interface FetchItemPriceDTO {
  query: string,
  page: number
}

export class FetchItemPricesUseCase {
  constructor(private itemPricesRepository: ItemPricesRepository) { }

  async execute({ query, page }: FetchItemPriceDTO): Promise<ItemPrices[] | null> {
    const allItemPrices = await this.itemPricesRepository.searchMany(query, page);

    return allItemPrices;
  }
}
