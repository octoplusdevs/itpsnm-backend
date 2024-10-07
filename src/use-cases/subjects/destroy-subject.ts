import { SubjectsRepository } from "@/repositories/subject-repository"
import { SubjectNotFoundError } from "../errors/subject-not-found"

interface DestroySubjectUseCaseRequest {
  id: number
}

export class DestroySubjectUseCase {
  constructor(private subjectsRepository: SubjectsRepository) { }

  async execute({
    id,
  }: DestroySubjectUseCaseRequest): Promise<Boolean> {
    const findSubject = await this.subjectsRepository.findById(id)

    if(!findSubject){
      throw new SubjectNotFoundError()
    }
    return await this.subjectsRepository.destroy(
      id,
    )

  }
}
