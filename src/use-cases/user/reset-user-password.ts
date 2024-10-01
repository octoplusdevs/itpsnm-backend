import { UsersRepository } from '@/repositories/users-repository';
import { UserInvalidError } from '../errors/user-is-invalid-error';
import bcrypt from 'bcryptjs';

interface ResetUserPasswordUseCaseRequest {
  email: string;
  password: string;
}

export class ResetUserPasswordUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({
    email,
    password
  }: ResetUserPasswordUseCaseRequest): Promise<void | null> {
    let findUser = await this.usersRepository.findByEmail(email)

    if (!findUser) {
      throw new UserInvalidError()
    }
    let newHashedPassword = await bcrypt.hash(password, 10);
    await this.usersRepository.resetUserPassword(findUser.id, newHashedPassword)
  }
}
