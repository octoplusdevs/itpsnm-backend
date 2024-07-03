import { CoursesRepository } from '@/repositories/course-repository'
import { Course } from '@prisma/client'

interface CreateCourseUseCaseRequest {
  name: string
}

interface CreateCourseUseCaseResponse {
  course: Course
}

export class CreateCourseUseCase {
  constructor(private coursesRepository: CoursesRepository) { }

  async execute({
    name,
  }: CreateCourseUseCaseRequest): Promise<CreateCourseUseCaseResponse> {
    const course = await this.coursesRepository.create({
      name,
    })

    return {
      course,
    }
  }
}
