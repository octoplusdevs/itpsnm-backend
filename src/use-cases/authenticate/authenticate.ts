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
  role?: Role;
  token?: string;  // Adicione o token ao response
}

export class LoginUseCase {
  private jwtSecret = process.env.JWT_SECRET || 'your-secret-key'; // Use uma variável de ambiente para o segredo
  private ATTEMPT_LIMIT = 5
  constructor(private usersRepository: UsersRepository) { }

  async execute({ email, password }: LoginRequest): Promise<LoginResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }



    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      // Increment login attempts
      let newAttemptCount = user.loginAttempt + 1;
      await this.usersRepository.updateLoginAttempt(user.id, newAttemptCount);

      // Block user after 5 failed attempts
      if (newAttemptCount >= this.ATTEMPT_LIMIT) {
        await this.usersRepository.blockUser(user.id);
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

    // Reset login attempts on successful login
    await this.usersRepository.updateLoginAttempt(user.id, 0);

    // Log the successful access
    await this.usersRepository.logAccess(user.id, AccessStatus.SUCCESS);

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      this.jwtSecret,
      { expiresIn: '1h' } // Token expira em 1 hora
    );

    return {
      success: true,
      message: 'Login successful',
      userId: user.id,
      role: user.role,
      token,
    };
  }
}
