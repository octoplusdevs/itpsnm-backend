
import { $Enums, EnrollementState, Prisma } from '@prisma/client';
import { EnrollT, EnrollmentType, EnrollmentsRepository } from '../enrollment-repository';
import { prisma } from '@/lib/prisma';

export class PrismaEnrollmentsRepository implements EnrollmentsRepository {

  async update(enrollmentId: number, data: Prisma.EnrollmentUncheckedUpdateInput) {
    return await prisma.enrollment.update({
      where: { id: Number(enrollmentId) },
      data,
    })
  }
  async checkStatus(enrollmentId: number): Promise<EnrollT | any | null> {
    let enrollment = await prisma.enrollment.findUnique({
      where: {
        id: enrollmentId
      },
      include: {
        students: {
          select: {
            id: true,
            fullName: true,
            alternativePhone: true,
            dateOfBirth: true,
            emissionDate: true,
            gender: true,
            height: true,
            identityCardNumber: true,
            maritalStatus: true,
            type: true,
            mother: true,
            father: true,
            residence: true,
            phone: true,
            User: {
              select: {
                role: true,
                email: true,
                isActive: true,
                isBlocked: true
              }
            }
          }
        },
        classes: {
          select: {
            name: true,
            period: true,
            id: true,
            classrooms: true
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
        },
        documents: {
          select: {
            id: true,
            File: true
          }
        }
      }
    })

    return enrollment
  }

  async findByEnrollmentNumber(enrollmentId: number): Promise<EnrollT | any | null> {
    let enrollment = await prisma.enrollment.findUnique({
      where: {
        id: enrollmentId
      },
    })

    return enrollment
  }

  async findByIdentityCardNumber(identityCardNumber: string): Promise<any | null> {
    let enrollment = await prisma.enrollment.findUnique({
      where: { identityCardNumber }, include: {
        students: {
          select: {
            id: true,
            fullName: true,
            alternativePhone: true,
            dateOfBirth: true,
            emissionDate: true,
            gender: true,
            height: true,
            identityCardNumber: true,
            maritalStatus: true,
            type: true,
            mother: true,
            father: true,
            residence: true,
            phone: true,
            User: {
              select: {
                role: true,
                email: true,
                isActive: true,
                isBlocked: true
              }
            }
          }
        },
        classes: {
          select: {
            name: true,
            period: true,
            id: true,
            classrooms: true
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
        },
        documents: {
          select: {
            id: true,
            File: true
          }
        }
      }
    })
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

  //TODO: Mudar o retorno de any
  async create(data: EnrollmentType): Promise<EnrollmentType | any> {
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
            id: true,
            fullName: true,
            alternativePhone: true,
            dateOfBirth: true,
            emissionDate: true,
            gender: true,
            height: true,
            identityCardNumber: true,
            maritalStatus: true,
            type: true,
            mother: true,
            father: true,
            residence: true,
            phone: true,
            User: {
              select: {
                role: true,
                email: true,
                isActive: true,
                isBlocked: true
              }
            }
          }
        },
        classes: {
          select: {
            name: true,
            period: true,
            id: true,
            classrooms: true
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
        },
        documents: {
          select: {
            id: true,
            File: true
          }
        }
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: {
        docsState,
        paymentState
      }
    })
    return {
      totalItems,
      currentPage: page,
      totalPages,
      items: enrollments
    };
  }

}
