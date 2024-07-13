
import { EnrollementState } from '@prisma/client';
import { EnrollmentType, EnrollmentsRepository } from '../enrollment-repository';
import { prisma } from '@/lib/prisma';
import { StudentNotFoundError } from '@/use-cases/errors/student-not-found';

export class PrismaEnrollmentsRepository implements EnrollmentsRepository {
  async checkStatus(enrollmentId: number): Promise<{ id: number; state: EnrollementState; } | null> {
    let enrollment = await prisma.enrollment.findUnique({
      where: {
        id: enrollmentId
      },
      include: {
        students: {
          select: {
            fullName: true
          }
        },
        levels: {
          select: {
            id: true,
            name: true
          }
        },
        courses: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return enrollment
  }

  async findByStudentId(studentId: number): Promise<EnrollmentType | null> {
    let student = await prisma.student.findUnique({ where: { id: studentId } })
    if (!student) {
      throw new StudentNotFoundError()
    }
    let enrollment = await prisma.enrollment.findUnique({ where: { studentId } })
    return enrollment
  }

  async toggleStatus(enrollmentId: number, state: EnrollementState): Promise<{ id: number; status: EnrollementState; } | null> {
    let enrollment = await prisma.enrollment.update({
      where: {
        id: enrollmentId
      },
      data: {
        state
      }
    })

    return {
      ...enrollment,
      status: enrollment.state
    }
  }
  async destroy(enrollmentId: number): Promise<Boolean> {
    let isDeletedEnrollment = await prisma.enrollment.delete({
      where: {
        id: enrollmentId
      }
    })
    return isDeletedEnrollment ? true : false
  }
  async create(data: EnrollmentType): Promise<EnrollmentType> {
    let enrollment = await prisma.enrollment.create({
      data: {
        state: data.state,
        studentId: data.studentId,
        courseId: data.courseId,
        levelId: data.levelId,
        classeId: null,
      }
    })
    return {
      ...enrollment,
      studentId: enrollment.studentId!,
      levelId: enrollment.levelId!,
      courseId: enrollment.courseId!,
      classeId: enrollment.classeId!,
    }
  }
  async searchMany(state: EnrollementState, page: number): Promise<EnrollmentType[]> {
    let pageSize = 20
    let enrollments = await prisma.enrollment.findMany({
      where: {
        state
      },
      skip: (page - 1) * pageSize,
      take: pageSize
    })
    return enrollments
  }

}
