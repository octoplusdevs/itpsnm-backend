import { UsersRepository } from '@/repositories/users-repository';
import { UserInvalidError } from '../errors/user-is-invalid-error';

interface BlockUserUseCaseRequest {
  status: boolean;
  email: string;
}

export class BlockUserUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({
    email,
    status
  }: BlockUserUseCaseRequest): Promise<void | null> {
    let findUser = await this.usersRepository.findByEmail(email)
    if (!findUser) {
      throw new UserInvalidError()
    }
    await this.usersRepository.blockUser(findUser.id, status)
  }
}
