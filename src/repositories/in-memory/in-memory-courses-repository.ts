import { Course } from '@prisma/client'
import { randomInt } from 'crypto'
import { CoursesRepository } from '../course-repository'

export class InMemoryCoursesRepository implements CoursesRepository {

  public items: Course[] = []

  async findById(id: number): Promise<Course | null> {
    const Course = this.items.find((item) => item.id === id)
    if (!Course) {
      return null
    }
    return Course
  }

  async findByName(name: string) {
    const Course = this.items.find((item) => item.name === name)
    if (!Course) {
      return null
    }
    return Course
  }

  async create(data: { id?: number, name: string }) {
    const course: Course = {
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
