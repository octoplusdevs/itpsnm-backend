
import { EnrollementState, Enrollment } from '@prisma/client';
import { EnrollmentType, EnrollmentsRepository } from '../enrollment-repository';
import { prisma } from '@/lib/prisma';

export class PrismaEnrollmentsRepository implements EnrollmentsRepository {
  async checkStatus(enrollmentId: number): Promise<Enrollment | null> {
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

  async findByIdentityCardNumber(identityCardNumber: string): Promise<any | null> {
    let enrollment = await prisma.enrollment.findUnique({ where: { identityCardNumber } })
    return enrollment
  }

  async toggleStatus(enrollmentId: number, docsState: EnrollementState, paymentState: EnrollementState): Promise<{ id: number; docsState: EnrollementState; paymentState: EnrollementState; } | null> {
    let enrollment = await prisma.enrollment.update({
      where: {
        id: enrollmentId
      },
      data: {
        docsState,
        paymentState
      }
    })

    return {
      ...enrollment,
      docsState: enrollment.docsState,
      paymentState: enrollment.paymentState,
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
        docsState: data.docsState,
        paymentState: data.paymentState,
        identityCardNumber: data.identityCardNumber,
        courseId: data.courseId,
        levelId: data.levelId,
        classeId: data.classeId,
      }
    })
    return {
      ...enrollment,
      identityCardNumber: enrollment.identityCardNumber!,
      levelId: enrollment.levelId!,
      courseId: enrollment.courseId!,
      classeId: enrollment.classeId!,
    }
  }

  async searchMany(paymentState: EnrollementState, docsState: EnrollementState, page: number): Promise<{
    totalItems: number;
    currentPage: number;
    totalPages: number;
    items: EnrollmentType[] | any[];
  }> {
    let pageSize = 20
    const totalItems = await prisma.enrollment.count();

    const totalPages = Math.ceil(totalItems / pageSize);
    let enrollments = await prisma.enrollment.findMany({
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
      },
      skip: (page - 1) * pageSize,
      take: pageSize
    })
    return {
      totalItems,
      currentPage: page,
      totalPages,
      items: enrollments
    };
  }

}
