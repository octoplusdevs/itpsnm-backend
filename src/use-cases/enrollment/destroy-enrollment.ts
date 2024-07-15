import { EnrollmentsRepository } from "@/repositories/enrollment-repository"
import { EnrollmentNotFoundError } from "../errors/enrollment-not-found";

interface DestroyEnrollmentUseCaseRequest {
  enrollmentId: number
}

export class DestroyEnrollmentUseCase {
  constructor(private enrollmentRepository: EnrollmentsRepository) { }

  async execute({
    enrollmentId,
  }: DestroyEnrollmentUseCaseRequest): Promise<Boolean> {
    let enrollment = await this.enrollmentRepository.checkStatus(enrollmentId)

    if (!enrollment) {
      throw new EnrollmentNotFoundError();
    }

    return await this.enrollmentRepository.destroy(
      enrollmentId,
    )

  }
}
