import { Course, County } from '@prisma/client'
import { randomInt } from 'crypto'
import { CountyRepository } from '../county-repository'

export class InMemoryCountyRepository implements CountyRepository {

  public items: County[] = []

  async findById(id: number): Promise<County | null> {
    const county = this.items.find((item) => item.id === id)
    if (!county) {
      return null
    }
    return county
  }

  async findByName(name: string) {
    const county = this.items.find((item) => item.name === name)
    if (!county) {
      return null
    }
    return county
  }

  async create(data: { id?: number, name: string }) {
    const county: County = {
      id: data.id ?? randomInt(99999),
      name: data.name,
      created_at: new Date(),
      update_at: new Date(),
    }
    this.items.push(county)
    return county
  }
  async searchMany(query: string, page: number) {
    return this.items
      .filter((item) => item.name.includes(query))
      .slice((page - 1) * 20, page * 20)
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
