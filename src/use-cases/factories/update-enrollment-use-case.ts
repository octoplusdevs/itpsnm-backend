import { PrismaCoursesRepository } from '@/repositories/prisma/prisma-course-repository';
import { PrismaEnrollmentsRepository } from '@/repositories/prisma/prisma-enrollments-repository';
import { PrismaLevelsRepository } from '@/repositories/prisma/prisma-level-repository';
import { PrismaStudentsRepository } from '@/repositories/prisma/prisma-student-repository';
import { UpdateEnrollmentUseCase } from '../enrollment/update-enrollment';
import { PrismaClassroomRepository } from '@/repositories/prisma/prisma-classroom-repository';

export function makeUpdateEnrollmentUseCase() {
  const enrollmentsRepository = new PrismaEnrollmentsRepository();
  const coursesRepository = new PrismaCoursesRepository();
  const levelsRepository = new PrismaLevelsRepository();
  const studentsRepository = new PrismaStudentsRepository();
  const classroomRepository = new PrismaClassroomRepository();

  return new UpdateEnrollmentUseCase(
    levelsRepository,
    coursesRepository,
    enrollmentsRepository,
    studentsRepository,
    classroomRepository
  );
}
