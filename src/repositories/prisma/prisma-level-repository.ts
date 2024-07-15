import { prisma } from '@/lib/prisma'
import { Level, LevelName } from '@prisma/client'
import { LevelsRepository } from '../level-repository';

export class PrismaLevelsRepository implements LevelsRepository {
  async create(data: { id?: number | undefined; name: LevelName }): Promise<Level> {
    let newLevel = await prisma.level.create({
      data: {
        name: data.name,
      }
    })
    return newLevel
  }
  async searchMany(): Promise<Level[]> {
    return await prisma.level.findMany()
  }
  async destroy(id: number): Promise<boolean> {
    let level = await prisma.level.delete({
      where: {
        id
      }
    })
    return level ? true : false
  }
  async findById(id: number) {
    const level = await prisma.level.findUnique({
      where: {
        id,
      },
    })

    return level
  }
}
