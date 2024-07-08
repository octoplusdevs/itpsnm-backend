import { Province } from '@prisma/client'

export interface ProvincesRepository {
  findById(id: number): Promise<Province | null>
  findByName(name: string): Promise<Province | null>
  create(data: { id?: number, name: string }): Promise<Province>
  searchMany(query: string, page: number): Promise<Province[]>
  destroy(id: number): Promise<boolean>;
}
