import { Level, LevelName } from '@prisma/client'
import { randomInt } from 'crypto'
import { LevelsRepository } from '../level-repository'

export class InMemoryLevelsRepository implements LevelsRepository {

  public items: Level[] = []

  async findById(id: number): Promise<Level | null> {
    const level = this.items.find((item) => item.id === id)
    if (!level) {
      return null
    }
    return level
  }

  async create(data: { id?: number, name: LevelName }) {
    const level: Level = {
      id: data.id ?? randomInt(99999),
      name: data.name,
      created_at: new Date(),
      update_at: new Date(),
    }
    this.items.push(level)
    return level
  }
  async searchMany() {
    return this.items
  }
  async destroy(id: number): Promise<boolean> {
    const index = this.items.findIndex((item) => item.id === id)
    if (index !== -1) {
      this.items.splice(index, 1)
      return true
    }
    return false
  }
}
