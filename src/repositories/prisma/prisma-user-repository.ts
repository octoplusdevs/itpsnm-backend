import { PrismaClient, User, AccessStatus, Role } from '@prisma/client';
import { CreateUserDTO, UsersRepository } from '@/repositories/users-repository';

export class PrismaUserRepository implements UsersRepository {
  private prisma = new PrismaClient();

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
  async searchMany(query: string, page: number): Promise<{
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
    const totalItems = await this.prisma.user.count();

    const totalPages = Math.ceil(totalItems / pageSize);

    let users = await this.prisma.user.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        email: true,
        loginAttempt: true,
        isBlocked: true,
        role: true,
        isActive: true,
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
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        role: data.role,
        loginAttempt: 0,
        isBlocked: false,
        isActive: true,
        employeeId: data.employeeId,
        studentId: data.studentId,
        lastLogin: new Date(),
        created_at: new Date(),
        update_at: new Date(),
      },
    });
  }

  async updateLoginAttempt(id: number, attempts: number): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: {
        loginAttempt: attempts,
        update_at: new Date(),
      },
    });
  }

  async blockUser(id: number): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: {
        isBlocked: true,
        update_at: new Date(),
      },
    });
  }

  async logAccess(userId: number, status: AccessStatus): Promise<void> {
    await this.prisma.accessLog.create({
      data: {
        userId,
        status,
        timestamp: new Date(),
      },
    });
  }
}
