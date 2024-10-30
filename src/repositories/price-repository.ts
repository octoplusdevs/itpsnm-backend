import { ItemPrices } from '@prisma/client';

export interface ItemPricesRepository {
  create(data: Omit<ItemPrices, 'id' | 'createdAt' | 'updatedAt'>): Promise<ItemPrices>;
  findAll(): Promise<ItemPrices[]>;
  findById(id: number): Promise<ItemPrices | null>;
  update(id: number, data: Partial<Omit<ItemPrices, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ItemPrices>;
  delete(id: number): Promise<ItemPrices>;
}
