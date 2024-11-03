import { EnrollmentsRepository } from '@/repositories/enrollment-repository'
import { EnrollementState } from '@prisma/client'
import { CourseNotFoundError } from '../errors/course-not-found';
import { CoursesRepository } from '@/repositories/course-repository';
import { LevelsRepository } from '@/repositories/level-repository';
import { LevelNotFoundError } from '../errors/level-not-found';
import { EnrollmentAlreadyExistsError } from '../errors/enrollment-already-exists';
import { randomInt } from 'crypto';
import { StudentNotFoundError } from '../errors/student-not-found';
import { StudentsRepository } from '@/repositories/student-repository';
import { EmployeeRepository } from '@/repositories/employee-repository';
import { EmployeeNotFoundError } from '../errors/employee-not-found';

interface CreateEnrollmentUseCaseResponse {
  enrollment: {
    id?: number;
    identityCardNumber?: string | null;
    created_at?: Date;
    update_at?: Date;
    courseId?: number | null
    levelId: number
    paymentState?: EnrollementState
    docsState?: EnrollementState
    classeId?: number | null
  }
}

interface CreateEnrollmentUseCaseRequest {
  id?: number,
  paymentState?: EnrollementState,
  docsState?: EnrollementState,
  identityCardNumber: string,
  courseId: number,
  employeeId: number,
  levelId: number,
  created_at?: Date,
  update_at?: Date
}


export class CreateEnrollmentUseCase {
  constructor(
    private levelsRepository: LevelsRepository,
    private coursesRepository: CoursesRepository,
    private enrollmentRepository: EnrollmentsRepository,
    private studentRepository: StudentsRepository,
    private employeeRepository: EmployeeRepository,
  ) { }

  async execute({
    id,
    paymentState,
    docsState,
    identityCardNumber,
    levelId,
    employeeId,
    courseId,
    created_at,
    update_at
  }: CreateEnrollmentUseCaseRequest): Promise<CreateEnrollmentUseCaseResponse> {

    const course = await this.coursesRepository.findById(courseId);
    if (!course) {
      throw new CourseNotFoundError();
    }

    const employee = await this.employeeRepository.findById(employeeId);
    if (!employee) {
      throw new EmployeeNotFoundError();
    }

    const level = await this.levelsRepository.findById(levelId);
    if (!level) {
      throw new LevelNotFoundError();
    }

    const student = await this.studentRepository.findByIdentityCardNumber(identityCardNumber)

    if (!student) {
      throw new StudentNotFoundError()
    }

    const existingEnrollment = await this.enrollmentRepository.findByIdentityCardNumber(identityCardNumber)

    if (existingEnrollment) {
      throw new EnrollmentAlreadyExistsError()
    }

    const enrollment = await this.enrollmentRepository.create({
      id: id ?? randomInt(9999),
      docsState: docsState ?? "PENDING",
      paymentState: paymentState ?? "PENDING",
      identityCardNumber: identityCardNumber,
      classeId: null,
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
