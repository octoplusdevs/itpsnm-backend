import { prisma } from '@/lib/prisma'
import { County } from '@prisma/client'

import { ProvincesRepository } from '../province-repository'

export class PrismaCountyRepository implements ProvincesRepository {
  async findByName(name: string): Promise<County | null> {
    const county = await prisma.county.findFirst({
      where: {
        name
      }
    })
    return county
  }
  async create(data: { id?: number | undefined; name: string }): Promise<County> {
    let county = await prisma.county.create({
      data: {
        name: data.name,
      }
    })
    return county
  }
  async searchMany(query: string, page: number): Promise<County[]> {
    let pageSize = 20
    let counties = await prisma.county.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive'
        }
      },
      skip: (page - 1) * pageSize,
      take: pageSize
    })
    return counties
  }
  async destroy(id: number): Promise<boolean> {
    let county = await prisma.county.delete({
      where: {
        id
      }
    })
    return county ? true : false
  }
  async findById(id: number) {
    const county = await prisma.county.findUnique({
      where: {
        id,
      },
    })

    return county
  }
}
