import { Role, User } from '@prisma/client'
import { UsersRepository } from '@/repositories/users-repository'
import { UserNotFoundError } from '../errors/user-not-found'

interface GetUserUseCaseRequest {
  email: string
}

interface GetUserUseCaseResponse {
  user: {
    id: number;
    email: string;
    password?: string;
    loginAttempt: number;
    isBlocked: boolean;
    role: Role;
    isActive: boolean;
    lastLogin: Date;
    created_at: Date;
    update_at: Date;
    employeeId?: number | null;
    studentId?: number | null;
  }
}

export class GetUserUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({
    email
  }: GetUserUseCaseRequest): Promise<GetUserUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(
      email
    )
    if (!user) {
      throw new UserNotFoundError()
    }

    delete user.password
    // let {created_at, email, employeeId, id,isActive,isBlocked,lastLogin,loginAttempt,role,studentId} = user
    return {
      user,
    }
  }
}
