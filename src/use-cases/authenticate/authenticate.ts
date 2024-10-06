import { UsersRepository } from '@/repositories/users-repository';
import { AccessStatus, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  userId?: number;
  employeeNumber?: number | null;
  enrollmentNumber?: number | null;
  role?: Role;
  token?: string;
}

export class LoginUseCase {
  private jwtSecret = process.env.JWT_SECRET!;
  private ATTEMPT_LIMIT = 5;
  constructor(private usersRepository: UsersRepository) { }

  async execute({ email, password }: LoginRequest): Promise<LoginResponse> {

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    // console.log({
    //   password,
    //   t: user
    // })
    const passwordMatches = await bcrypt.compare(password, user.password!);

    if (!passwordMatches) {
      let newAttemptCount = user.loginAttempt + 1;
      await this.usersRepository.updateLoginAttempt(user.id, newAttemptCount);

      await this.usersRepository.logAccess(user.id, AccessStatus.FAILURE);

      if (newAttemptCount >= this.ATTEMPT_LIMIT) {
        await this.usersRepository.blockUser(user.id, true);
        return {
          success: false,
          message: 'Account blocked due to multiple failed login attempts.',
        };
      }

      return {
        success: false,
        message: 'Invalid credentials.',
      };
    }

    if (user.isBlocked) {
      return {
        success: false,
        message: 'Account is blocked. Please contact support.',
      };
    }
    if (!user.isActive) {
      return {
        success: false,
        message: 'Account is not active. Please contact support.',
      };
    }

    await this.usersRepository.updateLoginAttempt(user.id, 0);

    await this.usersRepository.logAccess(user.id, AccessStatus.SUCCESS);

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      this.jwtSecret,
      { expiresIn: '1h' } // Token expira em 1 hora
    );
    let userStudent = {
      enrollmentNumber: user.enrollmentId,
      success: true,
      message: 'Login successful',
      userId: user.id,
      role: user.role,
      token,
    }
    let notUserStudent = {
      success: true,
      message: 'Login successful',
      userId: user.id,
      employeeNumber: user.employeeId,
      role: user.role,
      token,
    }
    return user.role === 'STUDENT' ? userStudent : notUserStudent
  }
}
