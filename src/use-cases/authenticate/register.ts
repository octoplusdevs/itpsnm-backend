import { UsersRepository } from '@/repositories/users-repository';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { EmployeeNotFoundError } from '../errors/employee-not-found';
import { EmployeeRepository } from '@/repositories/employee-repository';
import { EnrollmentsRepository } from '@/repositories/enrollment-repository';
import { EnrollmentNotFoundError } from '../errors/enrollment-not-found';
import { EmployeeOREnrollmentNotFoundError } from '../errors/employee-student-not-found';
import { UserEnrollmentHasInUseError } from '../errors/user-enrollment-has-exists';
import { UserEmployeeHasInUseError } from '../errors/user-employee-has-exists';

interface RegisterUserDTO {
  email: string;
  password: string;
  role: Role;
  employeeId?: number | null;
  enrollmentId?: number | null;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  token?: string;
  userId?: number;
  enrollmentId?: number | null;
  employeeId?: number | null;
}

export class RegisterUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private enrollmentRepository: EnrollmentsRepository,
    private employeesRepository: EmployeeRepository,
  ) { }

  async execute({ email, password, role, employeeId, enrollmentId }: RegisterUserDTO): Promise<RegisterResponse> {

    if (!employeeId && !enrollmentId) {
      throw new EmployeeOREnrollmentNotFoundError();
    }

    // Verificar se o email já está em uso
    const existingUser = await this.usersRepository.findByEmail(email);
    if (existingUser) {
      return {
        success: false,
        message: 'Email already in use',
      };
    }


    let existingStudent = null
    if (enrollmentId !== null && enrollmentId != undefined) {
      existingStudent = await this.enrollmentRepository.checkStatus(enrollmentId)
      if (!existingStudent) {
        throw new EnrollmentNotFoundError()
      }
      if (!await this.usersRepository.findByEnrollment(enrollmentId)) {
        throw new UserEnrollmentHasInUseError()
      }
    }

    if (employeeId !== null && employeeId != undefined) {
      const existingEmployeeId = await this.employeesRepository.findById(employeeId)
      if (!existingEmployeeId) {
        throw new EmployeeNotFoundError()
      }
      if (!await this.employeesRepository.findById(employeeId)) {
        throw new UserEmployeeHasInUseError()
      }
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10); // Usar 10 salt rounds

    // Criar o usuário no banco de dados
    const user = await this.usersRepository.create({
      email,
      password: hashedPassword,
      role,
      employeeId,
      studentId: existingStudent?.id,
      enrollmentId,
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
      enrollmentId,
      employeeId
    };
  }
}
