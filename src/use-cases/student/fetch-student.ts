import { StudentsRepository } from '@/repositories/student-repository'
import { Student } from '@prisma/client'

interface FetchStudentUseCaseRequest {
  query: string
  page: number
}

interface FetchStudentUseCaseResponse {
  students: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    items: Student[];
  }
}

export class FetchStudentUseCase {
  constructor(private studentsRepository: StudentsRepository) { }

  async execute({
    query,
    page
  }: FetchStudentUseCaseRequest): Promise<FetchStudentUseCaseResponse> {
    const students = await this.studentsRepository.searchMany(
      query,
      page
    )

    return {
      students,
    }
  }
}
