import { User } from '@prisma/client'
import { UsersRepository } from '@/repositories/users-repository'
import { UserNotFoundError } from '../errors/user-not-found'

interface GetUserUseCaseRequest {
  email: string
}

interface GetUserUseCaseResponse {
  user: User | null
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

    return {
      user,
    }
  }
}
