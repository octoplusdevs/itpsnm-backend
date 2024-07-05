import { CoursesRepository } from '@/repositories/course-repository'

interface DestroyCourseUseCaseRequest {
  id: number
}

export class DestroyCourseUseCase {
  constructor(private coursesRepository: CoursesRepository) { }

  async execute({
    id,
  }: DestroyCourseUseCaseRequest): Promise<Boolean> {
    return await this.coursesRepository.destroy(
      id,
    )

  }
}
