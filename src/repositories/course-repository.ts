import { Course } from '@prisma/client'

export interface CoursesRepository {
  findById(id: number): Promise<Course | null>
  findByName(name: string): Promise<Course | null>
  create(data: { id?: number, name: string }): Promise<Course>
  searchMany(query: string, page: number): Promise<Course[]>
  destroy(id: number): Promise<boolean>;
}
