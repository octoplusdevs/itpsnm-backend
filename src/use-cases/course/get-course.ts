import { CoursesRepository } from '@/repositories/course-repository'
import { Course } from '@prisma/client'
import { CourseNotFoundError } from '../errors/course-not-found'

interface GetCourseUseCaseRequest {
  courseId: number
}

interface GetCourseUseCaseResponse {
  course: Course | null
}

export class GetCourseUseCase {
  constructor(private coursesRepository: CoursesRepository) { }

  async execute({
    courseId
  }: GetCourseUseCaseRequest): Promise<GetCourseUseCaseResponse> {
    const course = await this.coursesRepository.findById(
      courseId
    )
    if (!course) {
      throw new CourseNotFoundError()
    }

    return {
      course,
    }
  }
}
