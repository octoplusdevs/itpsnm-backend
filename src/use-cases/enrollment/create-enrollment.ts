import { EnrollmentType, EnrollmentsRepository } from '@/repositories/enrollment-repository'
import { StudentsRepository } from '@/repositories/student-repository';
import { EnrollementState } from '@prisma/client'
import { StudentNotFoundError } from '../errors/student-not-found';

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
  constructor(
    private studentsRepository: StudentsRepository,
    private enrollmentRepository: EnrollmentsRepository,
  ) { }

  async execute({
    id,
    state,
    studentId,
    created_at,
    update_at
  }: EnrollmentType): Promise<CreateEnrollmentUseCaseResponse> {

    const studentExists = await this.studentsRepository.findById(studentId);
    if (!studentExists) {
      throw new StudentNotFoundError();
    }

    const enrollment = await this.enrollmentRepository.create({
      id: id!,
      state,
      studentId,
      created_at: created_at!,
      update_at: update_at!
    })

    return {
      enrollment,
    }
  }
}
