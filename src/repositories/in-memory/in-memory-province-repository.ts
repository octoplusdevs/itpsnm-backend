import { Course, Province } from '@prisma/client'
import { randomInt } from 'crypto'
import { ProvincesRepository } from '../province-repository'

export class InMemoryProvinceRepository implements ProvincesRepository {

  public items: Province[] = []

  async findById(id: number): Promise<Course | null> {
    const province = this.items.find((item) => item.id === id)
    if (!province) {
      return null
    }
    return province
  }

  async findByName(name: string) {
    const province = this.items.find((item) => item.name === name)
    if (!province) {
      return null
    }
    return province
  }

  async create(data: { id?: number, name: string }) {
    const province: Course = {
      id: data.id ?? randomInt(99999),
      name: data.name,
      created_at: new Date(),
      update_at: new Date(),
    }
    this.items.push(province)
    return province
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
