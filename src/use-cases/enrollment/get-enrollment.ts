import { EnrollementState } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found'
import { EnrollmentsRepository } from '@/repositories/enrollment-repository'

interface GetEnrollmentUseCaseRequest {
  enrollmentId: number
}

interface GetEnrollmentUseCaseResponse {
  enrollment: {
    id: number;
    state: EnrollementState;
  }
}

export class GetEnrollmentUseCase {
  constructor(private enrollmentsRepository: EnrollmentsRepository) { }

  async execute({
    enrollmentId
  }: GetEnrollmentUseCaseRequest): Promise<GetEnrollmentUseCaseResponse> {
    const enrollment = await this.enrollmentsRepository.checkStatus(enrollmentId)
    if (!enrollment) {
      throw new ResourceNotFoundError()
    }

    return {
      enrollment
    }
  }
}
