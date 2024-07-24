import { PrismaCoursesRepository } from '@/repositories/prisma/prisma-course-repository';
import { PrismaEnrollmentsRepository } from '@/repositories/prisma/prisma-enrollments-repository';
import { CreateEnrollmentUseCase } from '../enrollment/create-enrollment';
import { PrismaLevelsRepository } from '@/repositories/prisma/prisma-level-repository';
import { PrismaStudentsRepository } from '@/repositories/prisma/prisma-student-repository';

export function makeCreateEnrollmentUseCase() {
  const enrollmentsRepository = new PrismaEnrollmentsRepository();
  const coursesRepository = new PrismaCoursesRepository();
  const levelsRepository = new PrismaLevelsRepository();
  const studentsRepository = new PrismaStudentsRepository();

  return new CreateEnrollmentUseCase(
    levelsRepository,
    coursesRepository,
    enrollmentsRepository,
    studentsRepository
  );
}
