import { EnrollmentsRepository } from "@/repositories/enrollment-repository"

interface DestroyEnrollmentUseCaseRequest {
  enrollmentId: number
}

export class DestroyEnrollmentUseCase {
  constructor(private enrollmentRepository: EnrollmentsRepository) { }

  async execute({
    enrollmentId,
  }: DestroyEnrollmentUseCaseRequest): Promise<Boolean> {
    return await this.enrollmentRepository.destroy(
      enrollmentId,
    )

  }
}
