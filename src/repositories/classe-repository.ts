import { Classe, ClasseType, PeriodType, Prisma } from '@prisma/client'

type classeTypeInput = {
  name: ClasseType;
  period: PeriodType;
  levelId: number;
  id_classroom: number;
  courseId: number;
}
export interface ClasseRepository {
  findById(id: number): Promise<Classe | null>
  findByName(name: string): Promise<Classe | null>
  create(data: classeTypeInput): Promise<Classe | null>
  searchMany(query: string, page: number): Promise<Classe[]>
  destroy(id: number): Promise<boolean>;
}
