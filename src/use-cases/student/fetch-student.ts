import { StudentsRepository } from '@/repositories/student-repository'
import { Student } from '@prisma/client'

interface FetchStudentUseCaseRequest {
  name: string
  page: number
}

interface FetchStudentUseCaseResponse {
  students: Student[]
}

export class FetchStudentUseCase {
  constructor(private studentsRepository: StudentsRepository) { }

  async execute({
    name,
    page
  }: FetchStudentUseCaseRequest): Promise<FetchStudentUseCaseResponse> {
    const students = await this.studentsRepository.searchMany(
      name,
      page
    )

    return {
      students,
    }
  }
}
