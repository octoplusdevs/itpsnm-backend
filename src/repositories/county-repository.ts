import { County } from '@prisma/client'

export interface CountyRepository {
  findById(id: number): Promise<County | null>
  findByName(name: string): Promise<County | null>
  create(data: { id?: number, name: string }): Promise<County>
  searchMany(query: string, page: number): Promise<County[]>
  destroy(id: number): Promise<boolean>;
}
