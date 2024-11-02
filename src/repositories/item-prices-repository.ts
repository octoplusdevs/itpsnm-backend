import { ItemPrices } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library';

export interface ItemPricesRepository {
  findById(id: number): Promise<ItemPrices | null>
  findByName(name: string): Promise<ItemPrices | null>
  create(data: {
    itemName: string;
    basePrice: Decimal;
    ivaPercentage?: number | null;
    priceWithIva: Decimal | null;
    levelId: number | null;
  }): Promise<ItemPrices>
  searchMany(levelId: number, page: number): Promise<ItemPrices[]>
  destroy(id: number): Promise<boolean>;
}
