import { UsersRepository } from '@/repositories/users-repository';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';

interface RegisterUserDTO {
  email: string;
  password: string;
  role: Role;
  employeeId?: number | null;
  studentId?: number | null;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  token?: string;
  userId?: number;
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({ email, password, role, employeeId, studentId }: RegisterUserDTO): Promise<RegisterResponse> {
    // Verificar se o email já está em uso
    const existingUser = await this.usersRepository.findByEmail(email);
    if (existingUser) {
      return {
        success: false,
        message: 'Email already in use',
      };
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10); // Usar 10 salt rounds

    // Criar o usuário no banco de dados
    const user = await this.usersRepository.create({
      email,
      password: hashedPassword,
      role,
      employeeId,
      studentId,
    });

    // Gerar o token JWT
    const token = sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: '1h', // Token expira em 1 hora
      }
    );

    return {
      success: true,
      message: 'User registered successfully',
      token,
      userId: user.id,
    };
  }
}
