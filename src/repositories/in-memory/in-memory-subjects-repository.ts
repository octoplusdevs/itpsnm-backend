import { Subject } from '@prisma/client'
import { randomInt } from 'crypto'
import { SubjectsRepository } from '../subject-repository'

export class InMemorySubjectsRepository implements SubjectsRepository {

  public items: Subject[] = []

  async findById(id: number): Promise<Subject | null> {
    const Subject = this.items.find((item) => item.id === id)
    if (!Subject) {
      return null
    }
    return Subject
  }

  async findByName(name: string) {
    const Subject = this.items.find((item) => item.name === name)
    if (!Subject) {
      return null
    }
    return Subject
  }

  async create(data: { id?: number, name: string }) {
    const course: Subject = {
      id: data.id ?? randomInt(99999),
      name: data.name,
      created_at: new Date(),
      update_at: new Date(),
    }
    this.items.push(course)
    return course
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
