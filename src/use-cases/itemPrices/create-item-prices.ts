import { ItemPrices } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { LevelsRepository } from '@/repositories/level-repository';
import { LevelNotFoundError } from '../errors/level-not-found';
import { ItemPricesRepository } from '@/repositories/item-prices-repository';

interface CreateItemPriceDTO {
  name: string,
  price: number,
  ivaPercentage?: number,
  levelId: number
}

export class CreateItemPriceUseCase {
  constructor(
    private itemPriceRepository: ItemPricesRepository,
    private levelsRepository: LevelsRepository,
  ) { }
  async execute(data: CreateItemPriceDTO): Promise<ItemPrices> {
    const findLevel = await this.levelsRepository.findById(data.levelId);
    if (!findLevel) {
      throw new LevelNotFoundError();
    }

    const newItemPrice = await this.itemPriceRepository.create({
      itemName: data.name,
      basePrice: new Decimal(data.price),
      ivaPercentage: data.ivaPercentage ?? 14,
      priceWithIva: new Decimal(data.price * ((data.ivaPercentage ?? 14) / 100)),
      levelId: data.levelId
    });

    return newItemPrice;
  }
}
