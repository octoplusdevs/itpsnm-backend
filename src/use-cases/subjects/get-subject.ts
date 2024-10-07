import { SubjectsRepository } from '@/repositories/subject-repository'
import { Subject } from '@prisma/client'
import { SubjectNotFoundError } from '../errors/subject-not-found'

interface GetSubjectUseCaseRequest {
  subjectId: number
}

interface GetSubjectUseCaseResponse {
  subject: Subject | null
}

export class GetSubjectUseCase {
  constructor(private subjectsRepository: SubjectsRepository) { }

  async execute({
    subjectId
  }: GetSubjectUseCaseRequest): Promise<GetSubjectUseCaseResponse> {
    const subject = await this.subjectsRepository.findById(
      subjectId
    )
    if (!subject) {
      throw new SubjectNotFoundError()
    }

    return {
      subject,
    }
  }
}
