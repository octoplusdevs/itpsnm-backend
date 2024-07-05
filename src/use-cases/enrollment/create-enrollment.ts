import { EnrollmentType, EnrollmentsRepository } from '@/repositories/enrollment-repository'
import { EnrollementState, Enrollment } from '@prisma/client'

interface CreateEnrollmentUseCaseResponse {
  enrollment: {
    id?: number;
    created_at?: Date;
    update_at?: Date;
    state: EnrollementState;
    studentId: number | null;
  }
}

export class CreateEnrollmentUseCase {
  constructor(private enrollmentRepository: EnrollmentsRepository) { }

  async execute({
    id,
    state,
    studentId,
    created_at,
    update_at
  }: EnrollmentType): Promise<CreateEnrollmentUseCaseResponse> {
    const enrollment = await this.enrollmentRepository.create({
      id,
      state,
      studentId,
      created_at,
      update_at
    })

    return {
      enrollment,
    }
  }
}
