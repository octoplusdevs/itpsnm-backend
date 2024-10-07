import { User, AccessStatus, Role } from '@prisma/client';
import { CreateUserDTO, UsersRepository } from '@/repositories/users-repository';
import { prisma } from '@/lib/prisma';

export class PrismaUserRepository implements UsersRepository {


  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }
  async findByEnrollment(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { enrollmentId: id } });
  }
  async findByEmployeeId(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { employeeId: id } });
  }
  async findByEmail(email: string): Promise<User | null | any> {
    return prisma.user.findUnique({
      where: { email }, select: {
        id: true,
        email: true,
        loginAttempt: true,
        isBlocked: true,
        role: true,
        isActive: true,
        password: true,
        lastLogin: true,
        created_at: true,
        update_at: true,
        employeeId: true,
        enrollmentId: true,
        studentId: true
      }
    });
  }
  async searchMany(role: Role, page: number): Promise<{
    totalItems: number;
    currentPage: number;
    totalPages: number;
    items: {
      id: number;
      email: string;
      loginAttempt: number;
      isBlocked: boolean;
      role: Role;
      isActive: boolean;
      lastLogin: Date;
      created_at: Date;
      update_at: Date;
      employeeId?: number | null;
      studentId?: number | null;
    }[];
  }> {
    let pageSize = 20
    const totalItems = await prisma.user.count();

    const totalPages = Math.ceil(totalItems / pageSize);

    let users = await prisma.user.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: {
        role
      },
      select: {
        id: true,
        email: true,
        loginAttempt: true,
        isBlocked: true,
        role: true,
        isActive: true,
        enrollmentId: true,
        lastLogin: true,
        created_at: true,
        update_at: true,
        employeeId: true,
        studentId: true
      }
    })
    return {
      totalItems,
      currentPage: page,
      totalPages,
      items: users
    };
  }

  async create(data: CreateUserDTO): Promise<User> {
    return prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        role: data.role,
        loginAttempt: 0,
        isBlocked: false,
        isActive: true,
        employeeId: data.employeeId,
        enrollmentId: data.enrollmentId,
        studentId: data.studentId,
        lastLogin: new Date(),
        created_at: new Date(),
        update_at: new Date(),
      },
    });
  }

  async updateLoginAttempt(id: number, attempts: number): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: {
        loginAttempt: attempts,
        update_at: new Date(),
      },
    });
  }
  async resetUserPassword(id: number, password: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: {
        password,
        loginAttempt: 0,
        isBlocked: false,
        update_at: new Date(),
      },
    });
  }
  async blockUser(id: number, status: boolean): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: {
        isBlocked: Boolean(status),
        update_at: new Date(),
      },
    });
  }

  async logAccess(userId: number, status: AccessStatus): Promise<void> {
    await prisma.accessLog.create({
      data: {
        userId,
        status,
        timestamp: new Date(),
      },
    });
  }
}
