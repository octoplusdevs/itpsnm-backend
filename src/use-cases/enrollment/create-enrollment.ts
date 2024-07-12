import { EnrollmentsRepository } from '@/repositories/enrollment-repository'
import { StudentsRepository } from '@/repositories/student-repository';
import { EnrollementState } from '@prisma/client'
import { StudentNotFoundError } from '../errors/student-not-found';
import { CourseNotFoundError } from '../errors/course-not-found';
import { CoursesRepository } from '@/repositories/course-repository';
import { LevelsRepository } from '@/repositories/level-repository';
import { LevelNotFoundError } from '../errors/level-not-found';
import { EnrollmentAlreadyExistsError } from '../errors/enrollment-already-exists';
import { randomInt } from 'crypto';

interface CreateEnrollmentUseCaseResponse {
  enrollment: {
    id?: number;
    created_at?: Date;
    update_at?: Date;
    state: EnrollementState;
    studentId: number | null;
  }
}

interface CreateEnrollmentUseCaseRequest {
  id?: number,
  state?: EnrollementState,
  identityCardNumber: string,
  courseId: number,
  levelId: number,
  created_at?: Date,
  update_at?: Date
}


export class CreateEnrollmentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private levelsRepository: LevelsRepository,
    private coursesRepository: CoursesRepository,
    private enrollmentRepository: EnrollmentsRepository,
  ) { }

  async execute({
    id,
    state,
    identityCardNumber,
    levelId,
    courseId,
    created_at,
    update_at
  }: CreateEnrollmentUseCaseRequest): Promise<CreateEnrollmentUseCaseResponse> {

    const student = await this.studentsRepository.findByIdentityCardNumber(identityCardNumber);
    if (!student) {
      throw new StudentNotFoundError();
    }

    const course = await this.coursesRepository.findById(courseId);
    if (!course) {
      throw new CourseNotFoundError();
    }

    const level = await this.levelsRepository.findById(levelId);
    if (!level) {
      throw new LevelNotFoundError();
    }

    const existingEnrollment = await this.enrollmentRepository.findByStudentId(student.id)

    if (existingEnrollment) {
      throw new EnrollmentAlreadyExistsError()
    }

    const enrollment = await this.enrollmentRepository.create({
      id: id ?? randomInt(9999),
      state: state ?? "PENDING",
      studentId: student.id,
      courseId,
      levelId,
      created_at: created_at ?? new Date(),
      update_at: update_at ?? new Date()
    })

    return {
      enrollment,
    }
  }
}
