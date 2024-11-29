import { EnrollmentsRepository } from '@/repositories/enrollment-repository';
import { EnrollementState, Enrollment, PeriodType } from '@prisma/client';
import { CourseNotFoundError } from '../errors/course-not-found';
import { CoursesRepository } from '@/repositories/course-repository';
import { LevelsRepository } from '@/repositories/level-repository';
import { LevelNotFoundError } from '../errors/level-not-found';
import { EnrollmentNotFoundError } from '../errors/enrollment-not-found';
import { StudentsRepository } from '@/repositories/student-repository';
import { IdentityCardNumberNotExistsError } from '../errors/id-card-not-exists-error';
import { IdentityCardNumberHasInUseExistsError } from '../errors/id-card-already-in-use-error';
import { ClassroomRepository } from '@/repositories/classroom-repository';

interface UpdateEnrollmentUseCaseRequest {
  id: number;
  paymentState?: EnrollementState;
  docsState?: EnrollementState;
  identityCardNumber?: string;
  courseId: number;
  levelId: number;
  isEnrolled?: boolean;
  period: PeriodType;
  classeId?: number;
}

interface UpdateEnrollmentUseCaseResponse {
  enrollment: Enrollment;
}

export class UpdateEnrollmentUseCase {
  constructor(
    private levelsRepository: LevelsRepository,
    private coursesRepository: CoursesRepository,
    private enrollmentRepository: EnrollmentsRepository,
    private studentRepository: StudentsRepository,
    private classroomRepository: ClassroomRepository,
    // private classeRepository: ClasseRepository,

  ) { }

  async execute({
    id,
    paymentState,
    docsState,
    identityCardNumber,
    levelId,
    courseId,
    isEnrolled,
    period,
    classeId,
  }: UpdateEnrollmentUseCaseRequest): Promise<UpdateEnrollmentUseCaseResponse> {

    // Verifica se a matrícula existe
    const enrollment = await this.enrollmentRepository.checkStatus(id);
    if (!enrollment) {
      throw new EnrollmentNotFoundError();
    }

    // Se um número de identidade foi passado, verifica se o estudante existe
    let student = null;
    if (identityCardNumber) {
      student = await this.studentRepository.findByIdentityCardNumber(identityCardNumber);
      if (!student) {
        throw new IdentityCardNumberNotExistsError();
      }

      // Verifica se o número de identidade está sendo usado em outra matrícula
      const existingEnrollment = await this.enrollmentRepository.findByIdentityCardNumber(identityCardNumber);
      if (existingEnrollment && existingEnrollment.id !== id) {
        throw new IdentityCardNumberHasInUseExistsError();
      }
    }

    // Verifica se o curso existe, se foi passado
    if (courseId) {
      const course = await this.coursesRepository.findById(courseId);
      if (!course) {
        throw new CourseNotFoundError();
      }
    }

    // Verifica se o nível existe, se foi passado
    if (levelId) {
      const level = await this.levelsRepository.findById(levelId);
      if (!level) {
        throw new LevelNotFoundError();
      }
    }

    // Busca uma sala e turma disponíveis
    const classroom = await this.classroomRepository.findAvailableClassroom({
      courseId,
      levelId,
      periodType: period
    });

    if (!classroom) {
      throw new Error("No available classroom found for the given parameters.");
    }

    // if (classeId) {
    //   const classe = await this.classeRepository.findById(classeId);
    //   if (!classe) {
    //     throw new ClassNotExists();
    //   }
    // }

    // Atualiza a matrícula com os novos valores
    const updatedEnrollment = await this.enrollmentRepository.update(id, {
      docsState: docsState ?? enrollment.docsState,
      paymentState: paymentState ?? enrollment.paymentState,
      identityCardNumber: identityCardNumber ?? enrollment.identityCardNumber,
      classeId: classeId ?? classroom?.classes[0]?.id,
      courseId: courseId ?? enrollment.courseId,
      levelId: levelId ?? enrollment.levelId,
      isEnrolled
    });
    await this.classroomRepository.incrementClassroomOccupancy(classroom.id);
    return {
      enrollment: updatedEnrollment,
    };
  }
}
