import { CoursesRepository } from '@/repositories/course-repository'
import { Course } from '@prisma/client'
import { CourseAlreadyExistsError } from '../errors/course-already-exists-error'

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

    const findCourse = await this.coursesRepository.findByName(name)

    if(findCourse){
      throw new CourseAlreadyExistsError();
    }
    const course = await this.coursesRepository.create({
      name,
    })

    return {
      course,
    }
  }
}
