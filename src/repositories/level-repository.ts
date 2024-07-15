import { Level } from '@prisma/client'

export interface LevelsRepository {
  findById(id: number): Promise<Level | null>
  create(data: { id?: number, name: string }): Promise<Level>
  searchMany(page: number): Promise<Level[]>
  destroy(id: number): Promise<boolean>;
}
