import { ItemPrices, Prisma } from '@prisma/client'

export interface ItemPricesRepository {
  findById(id: number): Promise<ItemPrices | null>
  findByName(name: string): Promise<ItemPrices | null>
  create(data: Prisma.ItemPricesCreateInput): Promise<ItemPrices>
  searchMany(query: string, page: number): Promise<ItemPrices[]>
  destroy(id: number): Promise<boolean>;
}
