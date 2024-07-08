import { prisma } from '@/lib/prisma'
import { Province } from '@prisma/client'

import { ProvincesRepository } from '../province-repository'

export class PrismaProvincesRepository implements ProvincesRepository {
  async findByName(name: string): Promise<Province | null> {
    const findProvince = await prisma.province.findUnique({
      where: {
        name
      }
    })
    return findProvince
  }
  async create(data: { id?: number | undefined; name: string }): Promise<Province> {
    let newProvince = await prisma.province.create({
      data: {
        name: data.name,
      }
    })
    return newProvince
  }
  async searchMany(query: string, page: number): Promise<Province[]> {
    let pageSize = 20
    let provinces = await prisma.province.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive'
        }
      },
      skip: (page - 1) * pageSize,
      take: pageSize
    })
    return provinces
  }
  async destroy(id: number): Promise<boolean> {
    let findProvince = await prisma.province.delete({
      where: {
        id
      }
    })
    return findProvince ? true : false
  }
  async findById(id: number) {
    const province = await prisma.province.findUnique({
      where: {
        id,
      },
    })

    return province
  }
}
