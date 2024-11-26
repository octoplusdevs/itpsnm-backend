import { ClasseRepository } from '@/repositories/classe-repository'
import { Classe } from '@prisma/client'

interface FetchClasseUseCaseRequest {
  name: string
  page: number
}

interface FetchClasseUseCaseResponse {
  classes: Classe[]
}

export class FetchClasseUseCase {
  constructor(private classeRepository: ClasseRepository) { }

  async execute({
    name,
    page
  }: FetchClasseUseCaseRequest): Promise<FetchClasseUseCaseResponse> {
    const classes = await this.classeRepository.searchMany(
      name,
      page
    )

    return {
      classes,
    }
  }
}
