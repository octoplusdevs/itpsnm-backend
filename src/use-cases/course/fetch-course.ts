import { CoursesRepository } from '@/repositories/course-repository'
import { Course } from '@prisma/client'

interface FetchCourseUseCaseRequest {
  name: string
  page: number
}

interface FetchCourseUseCaseResponse {
  courses: Course[]
}

export class FetchCourseUseCase {
  constructor(private coursesRepository: CoursesRepository) { }

  async execute({
    name,
    page
  }: FetchCourseUseCaseRequest): Promise<FetchCourseUseCaseResponse> {
    const courses = await this.coursesRepository.searchMany(
      name,
      page
    )

    return {
      courses,
    }
  }
}
