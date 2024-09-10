import { AccessStatus, Role, User } from '@prisma/client'

export interface CreateUserDTO {
  email: string;
  password: string;
  role: Role;
  employeeId?: number | null;
  studentId?: number | null;
}


export interface UsersRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserDTO): Promise<User>;
  updateLoginAttempt(id: number, attempts: number): Promise<void>;
  blockUser(id: number): Promise<void>;
  logAccess(userId: number, status: AccessStatus): Promise<void>;
}
