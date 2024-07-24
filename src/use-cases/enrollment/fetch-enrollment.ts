import { EnrollmentType, EnrollmentsRepository } from '@/repositories/enrollment-repository'
import { EnrollementState } from '@prisma/client'

interface FetchEnrollmentUseCaseRequest {
  paymentState: EnrollementState
  docsState: EnrollementState
  page: number
}

interface FetchEnrollmentUseCaseResponse {
  enrollments: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    items: EnrollmentType[];
  }
}

export class FetchEnrollmentUseCase {
  constructor(private enrollmentsRepository: EnrollmentsRepository) { }

  async execute({
    paymentState,
    docsState,
    page
  }: FetchEnrollmentUseCaseRequest): Promise<FetchEnrollmentUseCaseResponse> {
    const enrollments = await this.enrollmentsRepository.searchMany(
      paymentState,
      docsState,
      page
    )

    return { enrollments }
  }
}
