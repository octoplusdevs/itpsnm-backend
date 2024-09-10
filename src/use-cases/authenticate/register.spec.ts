import { expect, describe, beforeEach, test } from 'vitest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RegisterUseCase } from './register';
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository';

describe('RegisterUseCase', () => {
  let userRepository: InMemoryUserRepository;
  let registerUseCase: RegisterUseCase;
  const jwtSecret = 'mandela123'; // Usar o mesmo segredo que o RegisterUseCase

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    registerUseCase = new RegisterUseCase(userRepository);
    process.env.JWT_SECRET = jwtSecret;
  });

  test('should register a user successfully and return a token', async () => {
    const email = 'newuser@example.com';
    const password = 'password123';

    const response = await registerUseCase.execute({ email, password, role: 'STUDENT' });

    expect(response.success).toBe(true);
    expect(response.message).toBe('User registered successfully');
    expect(response.token).toBeDefined();

    // Verificar se o token está correto
    const decoded = jwt.verify(response.token!, jwtSecret);
    expect(decoded).toHaveProperty('userId');
    expect(decoded).toHaveProperty('role');
  });

  test('should not register a user with an existing email', async () => {
    const email = 'existing@example.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 8);

    await userRepository.create({
      email,
      password: hashedPassword,
      role: 'STUDENT',
    });

    const response = await registerUseCase.execute({ email, password, role: 'STUDENT' });

    expect(response.success).toBe(false);
    expect(response.message).toBe('Email already in use');
  });

  test('should hash the password before saving the user', async () => {
    const email = 'hasheduser@example.com';
    const password = 'plaintextpassword';

    const response = await registerUseCase.execute({ email, password, role: 'STUDENT' });

    expect(response.success).toBe(true);

    const user = await userRepository.findByEmail(email);
    expect(user).toBeDefined();

    // Verificar se a senha foi criptografada corretamente
    const isPasswordHashed = await bcrypt.compare(password, user!.password);
    expect(isPasswordHashed).toBe(true);
  });

  test('should return the registered user ID', async () => {
    const email = 'testid@example.com';
    const password = 'password123';

    const response = await registerUseCase.execute({ email, password, role: 'STUDENT' });

    expect(response.success).toBe(true);
    expect(response.userId).toBeDefined();

    const user = await userRepository.findByEmail(email);
    expect(user?.id).toBe(response.userId);
  });
});
