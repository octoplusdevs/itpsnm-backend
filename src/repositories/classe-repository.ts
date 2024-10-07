import { Classe } from '@prisma/client'

export interface ClasseRepository {
  findById(id: number): Promise<Classe | null>
  findByName(name: string): Promise<Classe | null>
  create(data: { id?: number, name: string }): Promise<Classe>
  searchMany(query: string, page: number): Promise<Classe[]>
  destroy(id: number): Promise<boolean>;
}
