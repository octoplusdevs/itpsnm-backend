import { ClasseRepository } from '@/repositories/classe-repository'
import { ClasseNotFoundError } from '../errors/classe-not-found-error'

interface ClasseUseCaseRequest {
  id: number
}

export class DeleteClasseUseCase {
  constructor(private classeRepository: ClasseRepository) { }

  async execute({
    id,
  }: ClasseUseCaseRequest): Promise<Boolean> {
    const find = await this.classeRepository.findById(id)

    if(!find){
      throw new ClasseNotFoundError()
    }
    return await this.classeRepository.destroy(
      id,
    )

  }
}
