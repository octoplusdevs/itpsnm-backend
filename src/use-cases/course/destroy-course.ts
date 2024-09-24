import { CoursesRepository } from '@/repositories/course-repository'
import { CourseNotFoundError } from '../errors/course-not-found'

interface DestroyCourseUseCaseRequest {
  id: number
}

export class DestroyCourseUseCase {
  constructor(private coursesRepository: CoursesRepository) { }

  async execute({
    id,
  }: DestroyCourseUseCaseRequest): Promise<Boolean> {
    const findCourse = await this.coursesRepository.findById(id)

    if(!findCourse){
      throw new CourseNotFoundError()
    }
    return await this.coursesRepository.destroy(
      id,
    )

  }
}
