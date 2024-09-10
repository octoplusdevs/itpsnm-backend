import { User, Role, AccessStatus } from '@prisma/client';
import { CreateUserDTO, UsersRepository } from '../users-repository';

export class InMemoryUserRepository implements UsersRepository {
  private users: User[] = [];
  private accessLogs: { userId: number; status: AccessStatus; timestamp: Date }[] = [];

  async findById(id: number): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async create(data: CreateUserDTO): Promise<User> {
    const user: User = {
      id: this.users.length + 1,
      email: data.email,
      password: data.password,
      role: data.role,
      loginAttempt: 0,
      isBlocked: false,
      isActive: true,
      lastLogin: new Date(),
      created_at: new Date(),
      update_at: new Date(),
      employeeId: data.employeeId ?? null,
      studentId: data.studentId ?? null
    };

    this.users.push(user);
    return user;
  }

  async updateLoginAttempt(id: number, attempts: number): Promise<void> {
    const user = await this.findById(id);
    if (user) {
      user.loginAttempt = attempts;
      user.update_at = new Date();
    }
  }

  async blockUser(id: number): Promise<void> {
    const user = await this.findById(id);
    if (user) {
      user.isBlocked = true;
      user.update_at = new Date();
    }
  }

  async logAccess(userId: number, status: AccessStatus): Promise<void> {
    this.accessLogs.push({ userId, status, timestamp: new Date() });
  }
}
