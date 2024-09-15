import { EnrollementState, Student } from '@prisma/client'
import { EnrollmentsRepository } from '@/repositories/enrollment-repository'
import { EnrollmentNotFoundError } from '../errors/enrollment-not-found'

interface GetEnrollmentUseCaseRequest {
  identityCardNumber: string
}

interface GetEnrollmentUseCaseResponse {
  enrollment: {
    id?: number
    courseId?: number | null
    levelId: number
    docsState: EnrollementState
    paymentState: EnrollementState
    student: Student
    identityCardNumber: string
    classeId?: number | null
    created_at?: Date
    update_at?: Date
  }
}

export class GetEnrollmentByIdentityCardUseCase {
  constructor(private enrollmentsRepository: EnrollmentsRepository) { }

  async execute({
    identityCardNumber
  }: GetEnrollmentUseCaseRequest): Promise<GetEnrollmentUseCaseResponse> {

    const enrollment = await this.enrollmentsRepository.findByIdentityCardNumber(identityCardNumber)
    if (!enrollment) {
      throw new EnrollmentNotFoundError()
    }

    return {
      enrollment
    }
  }
}
