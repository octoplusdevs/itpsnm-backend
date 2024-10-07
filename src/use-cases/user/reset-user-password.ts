import { UsersRepository } from '@/repositories/users-repository';
import { UserInvalidError } from '../errors/user-is-invalid-error';
import bcrypt from 'bcryptjs';
import { AdminCantChangeOtherAdminsPasswordError } from '../errors/admin-cant-update-password-others-admin-error';
import { Role } from '@prisma/client';
import { StudentCanOnlyChangeTheirPasswordError } from '../errors/student-can-only-update-password-himselferror';
import { IncorrectPasswordError } from '../errors/password-is-incorrect';

interface ResetUserPasswordUseCaseRequest {
  email: string;
  currentPassword?: string; // Opcionais
  newPassword?: string;
  loggedInUserId: number; // ID do usuário que está fazendo a solicitação
  loggedInUserRole: Role
}

export class ResetUserPasswordUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    currentPassword,
    newPassword,
    loggedInUserId,
    loggedInUserRole,
  }: ResetUserPasswordUseCaseRequest): Promise<void | null> {
    // Procura o usuário pelo email
    const findUser = await this.usersRepository.findByEmail(email);

    // Verifica se o usuário existe
    if (!findUser) {
      throw new UserInvalidError();
    }

    // Se o usuário logado for um STUDENT, ele pode alterar apenas sua própria senha
    if (loggedInUserRole === 'STUDENT') {
      if (findUser.id !== loggedInUserId) {
        throw new StudentCanOnlyChangeTheirPasswordError()
      }
    }

    // Se o usuário logado for um ADMIN, ele pode alterar senhas de outros usuários
    // e sua própria senha, mas não de outros ADMINs
    if (loggedInUserRole === 'ADMIN') {
      if (findUser.id !== loggedInUserId && findUser.role === 'ADMIN') {
        throw new AdminCantChangeOtherAdminsPasswordError();
      }
    }

    // Se a senha atual for fornecida, verifica se está correta
    if (currentPassword) {
      const isPasswordValid = await bcrypt.compare(currentPassword, findUser.password!);
      if (!isPasswordValid) {
        throw new IncorrectPasswordError();
      }
    }

    // Se a nova senha for fornecida, criptografa e atualiza
    if (newPassword) {
      const newHashedPassword = await bcrypt.hash(newPassword, 10);
      await this.usersRepository.resetUserPassword(findUser.id, newHashedPassword);
    }
  }
}
