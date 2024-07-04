import { StudentsRepository } from "@/repositories/student-repository"

interface DestroyStudentUseCaseRequest {
  studentId: number
}

export class DestroyStudentUseCase {
  constructor(private studentsRepository: StudentsRepository) { }

  async execute({
    studentId,
  }: DestroyStudentUseCaseRequest): Promise<Boolean> {
    return await this.studentsRepository.destroy(
      studentId,
    )

  }
}
