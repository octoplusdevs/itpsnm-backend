import { Classe } from '@prisma/client'
import { ClasseRepository } from '@/repositories/classe-repository'
import { ClasseNotFoundError } from '../errors/classe-not-found-error'

interface GetClasseUseCaseRequest {
  classeId: number
}

interface GetClasseUseCaseResponse {
  classe: Classe | null
}

export class GetCourseUseCase {
  constructor(private classeRepository: ClasseRepository) { }

  async execute({
    classeId
  }: GetClasseUseCaseRequest): Promise<GetClasseUseCaseResponse> {
    const classe = await this.classeRepository.findById(
      classeId
    )
    if (!classe) {
      throw new ClasseNotFoundError()
    }

    return {
      classe,
    }
  }
}
