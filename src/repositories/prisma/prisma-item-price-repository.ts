import { Decimal } from '@prisma/client/runtime/library';
import { prisma } from '@/lib/prisma';
import { ItemPrices } from '@prisma/client';
import { ItemPricesRepository } from '../item-prices-repository';

export class PrismaItemPriceRepository implements ItemPricesRepository {
  findByName(name: string): Promise<{ id: number; itemName: string; basePrice: Decimal; ivaPercentage: number | null; priceWithIva: Decimal | null; createdAt: Date; updatedAt: Date; levelId: number | null; } | null> {
    throw new Error('Method not implemented.');
  }
  destroy(id: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  async searchMany(levelId: number, page: number): Promise<ItemPrices[]> {
    let pageSize = 20
    let itemPrices = await prisma.itemPrices.findMany({
      where: {
        levelId
      },
      skip: (page - 1) * pageSize,
      take: pageSize
    })
    return itemPrices
  }
  async create(data: Omit<{ id: number; itemName: string; basePrice: Decimal; ivaPercentage: number | null; priceWithIva: Decimal | null; createdAt: Date; updatedAt: Date; levelId: number | null; }, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ id: number; itemName: string; basePrice: Decimal; ivaPercentage: number | null; priceWithIva: Decimal | null; createdAt: Date; updatedAt: Date; levelId: number | null; }> {
    return await prisma.itemPrices.create({
      data
    })
  }

  async findById(id: number): Promise<{ id: number; itemName: string; basePrice: Decimal; ivaPercentage: number | null; priceWithIva: Decimal | null; createdAt: Date; updatedAt: Date; levelId: number | null; } | null> {
    return await prisma.itemPrices.findUnique({
      where:{
        id
      }
    })
  }
  async update(id: number, data: Partial<Omit<{ id: number; itemName: string; basePrice: Decimal; ivaPercentage: number | null; priceWithIva: Decimal | null; createdAt: Date; updatedAt: Date; levelId: number | null; }, 'id' | 'createdAt' | 'updatedAt'>>): Promise<{ id: number; itemName: string; basePrice: Decimal; ivaPercentage: number | null; priceWithIva: Decimal | null; createdAt: Date; updatedAt: Date; levelId: number | null; }> {
    throw new Error('Method not implemented.');
  }
  async delete(id: number): Promise<{ id: number; itemName: string; basePrice: Decimal; ivaPercentage: number | null; priceWithIva: Decimal | null; createdAt: Date; updatedAt: Date; levelId: number | null; }> {
    return await prisma.itemPrices.delete({
      where:{
        id
      }
    })
  }

}
