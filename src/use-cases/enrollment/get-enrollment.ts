import { EnrollementState, Enrollment, Student } from '@prisma/client'
import { EnrollT, EnrollmentsRepository } from '@/repositories/enrollment-repository'
import { EnrollmentNotFoundError } from '../errors/enrollment-not-found'

interface GetEnrollmentUseCaseRequest {
  enrollmentNumber?: number
  identityCardNumber?: string

}

interface GetEnrollmentUseCaseResponse {
  enrollment: {
    id: number;
    docsState: EnrollementState;
    paymentState: EnrollementState;
    student?: Student;
    identityCardNumber: string
    classeId?: number | null
    courseId?: number | null
    levelId?: number | null
    created_at?: Date
    update_at?: Date
  }
}

export class GetEnrollmentUseCase {
  constructor(private enrollmentsRepository: EnrollmentsRepository) { }

  async execute({
    enrollmentNumber,
    identityCardNumber
  }: GetEnrollmentUseCaseRequest): Promise<GetEnrollmentUseCaseResponse> {
    let enrollment = null;
    if(enrollmentNumber != null || enrollmentNumber != undefined){
      enrollment = await this.enrollmentsRepository.checkStatus(enrollmentNumber)

    }
    if(identityCardNumber != null || identityCardNumber != undefined){
      enrollment = await this.enrollmentsRepository.findByIdentityCardNumber(identityCardNumber)
    }
    if (!enrollment) {
      throw new EnrollmentNotFoundError()
    }

    return {
      enrollment
    }
  }
}
