import { UsersRepository } from '@/repositories/users-repository'
import { Role } from '@prisma/client'

interface FetchUserUseCaseRequest {
  role: Role
  page: number
}

interface FetchUserUseCaseResponse {
  users: {
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
    }[]
  }
}

export class FetchUserUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({
    role,
    page
  }: FetchUserUseCaseRequest): Promise<FetchUserUseCaseResponse> {
    const users = await this.usersRepository.searchMany(
      role,
      page
    )

    return {
      users
    }
  }
}
