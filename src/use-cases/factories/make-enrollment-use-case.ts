import { PrismaCoursesRepository } from '@/repositories/prisma/prisma-course-repository';
import { PrismaEnrollmentsRepository } from '@/repositories/prisma/prisma-enrollments-repository';
import { PrismaStudentsRepository } from '@/repositories/prisma/prisma-student-repository';
import { CreateEnrollmentUseCase } from '../enrollment/create-enrollment';
import { PrismaLevelsRepository } from '@/repositories/prisma/prisma-level-repository';

export function makeCreateEnrollmentUseCase() {
  const enrollmentsRepository = new PrismaEnrollmentsRepository();
  const studentsRepository = new PrismaStudentsRepository();
  const coursesRepository = new PrismaCoursesRepository();
  const levelsRepository = new PrismaLevelsRepository();

  return new CreateEnrollmentUseCase(
    studentsRepository,
    levelsRepository,
    coursesRepository,
    enrollmentsRepository
  );
}
