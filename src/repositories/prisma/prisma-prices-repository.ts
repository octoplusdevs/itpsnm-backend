import { prisma } from "@/lib/prisma";
import { ItemPrices } from "@prisma/client";
import { ItemPricesRepository } from "../price-repository";


class PrismaItemPricesRepository implements ItemPricesRepository {
  async create(itemData: Omit<ItemPrices, 'id' | 'createdAt' | 'updatedAt'>): Promise<ItemPrices> {
    const itemPrice = await prisma.itemPrices.create({
      data: itemData,
    });
    return itemPrice;
  }

  async findAll(): Promise<ItemPrices[]> {
    return await prisma.itemPrices.findMany();
  }

  async findById(id: number): Promise<ItemPrices | null> {
    return await prisma.itemPrices.findUnique({
      where: { id },
    });
  }

  async update(id: number, itemData: Partial<Omit<ItemPrices, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ItemPrices> {
    return await prisma.itemPrices.update({
      where: { id },
      data: itemData,
    });
  }

  async delete(id: number): Promise<ItemPrices> {
    return await prisma.itemPrices.delete({
      where: { id },
    });
  }
}

export default new PrismaItemPricesRepository();
