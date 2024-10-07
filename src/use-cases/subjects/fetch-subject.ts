import { SubjectsRepository } from '@/repositories/subject-repository'
import { Subject } from '@prisma/client'

interface FetchSubjectUseCaseRequest {
  name: string
  page: number
}

interface FetchSubjectUseCaseResponse {
  subjects: Subject[]
}

export class FetchSubjectUseCase {
  constructor(private subjectsRepository: SubjectsRepository) { }

  async execute({
    name,
    page
  }: FetchSubjectUseCaseRequest): Promise<FetchSubjectUseCaseResponse> {
    const subjects = await this.subjectsRepository.searchMany(
      name,
      page
    )

    return {
      subjects,
    }
  }
}
