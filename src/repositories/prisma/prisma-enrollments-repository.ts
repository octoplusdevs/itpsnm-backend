
import { EnrollementState, Enrollment } from '@prisma/client';
import { EnrollmentsRepository } from '../enrollment-repository';
import { prisma } from '@/lib/prisma';

export class PrismaEnrollmentsRepository implements EnrollmentsRepository {
  async checkStatus(enrollmentId: number): Promise<{ id: number; state: EnrollementState; } | null> {
    let enrollment = await prisma.enrollment.findUnique({
      where: {
        id: enrollmentId
      }
    })

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
  async create(data: Enrollment): Promise<Enrollment> {
    let enrollment = await prisma.enrollment.create({
      data: {
        state: data.state,
        studentId: data.studentId
      }
    })
    return {
      ...enrollment,
      studentId: enrollment.studentId!,
    }
  }
  async searchMany(state: EnrollementState, page: number): Promise<Enrollment[]> {
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
