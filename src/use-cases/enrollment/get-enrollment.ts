import { EnrollementState, Student } from '@prisma/client'
import { EnrollmentsRepository } from '@/repositories/enrollment-repository'
import { EnrollmentNotFoundError } from '../errors/enrollment-not-found'

interface GetEnrollmentUseCaseRequest {
  enrollmentId: number
}

interface GetEnrollmentUseCaseResponse {
  enrollment: {
    id: number;
    docsState: EnrollementState;
    paymentState: EnrollementState;
    student: Student
  }
}

export class GetEnrollmentUseCase {
  constructor(private enrollmentsRepository: EnrollmentsRepository) { }

  async execute({
    enrollmentId
  }: GetEnrollmentUseCaseRequest): Promise<GetEnrollmentUseCaseResponse> {
    const enrollment = await this.enrollmentsRepository.checkStatus(enrollmentId)
    if (!enrollment) {
      throw new EnrollmentNotFoundError()
    }

    return {
      enrollment
    }
  }
}
