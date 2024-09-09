import { Subject } from '@prisma/client'

export interface SubjectsRepository {
  findById(id: number): Promise<Subject | null>
  findByName(name: string): Promise<Subject | null>
  create(data: { id?: number, name: string }): Promise<Subject>
  searchMany(query: string, page: number): Promise<Subject[]>
  destroy(id: number): Promise<boolean>;
}
