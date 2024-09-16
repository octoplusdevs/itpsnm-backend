import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { expect, describe, beforeEach, test } from 'vitest';
import { LoginUseCase } from './authenticate';
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository';

describe('LoginUseCase', () => {
  let userRepository: InMemoryUserRepository;
  let loginUseCase: LoginUseCase;
  let jwtSecret: string; // Use o mesmo segredo usado no LoginUseCase

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    loginUseCase = new LoginUseCase(userRepository);
    jwtSecret = process.env.JWT_SECRET!;
  });

  test('should return success and token on successful login', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 8);
    await userRepository.create({
      email,
      password: hashedPassword,
      role: 'STUDENT',
    });

    const response = await loginUseCase.execute({ email, password });

    expect(response.success).toBe(true);
    expect(response.message).toBe('Login successful');
    expect(response.token).toBeDefined();


    // Verify the token
    const decoded = jwt.verify(response.token!, jwtSecret);
    expect(decoded).toHaveProperty('userId');
    expect(decoded).toHaveProperty('role');
  });

  test('should block account after 3 failed login attempts', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 8);
    await userRepository.create({
      email,
      password: hashedPassword,
      role: 'STUDENT',
    });

    // Try logging in with incorrect password 3 times
    for (let i = 0; i < 5; i++) {
      await loginUseCase.execute({ email, password: 'wrongpassword' });
    }

    const response = await loginUseCase.execute({ email, password: 'wrongpassword' });

    expect(response.success).toBe(false);
    expect(response.message).toBe('Account blocked due to multiple failed login attempts.');

    // Verify if the user is blocked
    const user = await userRepository.findByEmail(email);
    expect(user?.isBlocked).toBe(true);
  });

  test('should return error for blocked account', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await userRepository.create({
      email,
      password: hashedPassword,
      role: 'STUDENT',
    });

    await userRepository.blockUser(user.id);

    const response = await loginUseCase.execute({ email, password });

    expect(response.success).toBe(false);
    expect(response.message).toBe('Account is blocked. Please contact support.');
  });

  test('should return error for invalid credentials', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    await userRepository.create({
      email,
      password: await bcrypt.hash(password, 8),
      role: 'STUDENT',
    });

    const response = await loginUseCase.execute({ email, password: 'wrongpassword' });

    expect(response.success).toBe(false);
    expect(response.message).toBe('Invalid credentials.');
  });

  test('should reset login attempts on successful login', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 8);
    await userRepository.create({
      email,
      password: hashedPassword,
      role: 'STUDENT',
    });
    // Try logging in with incorrect password 5 times
    for (let i = 1; i < 5; i++) {
      await loginUseCase.execute({ email, password: 'wrongpassword' });
    }

    const response = await loginUseCase.execute({ email, password });

    expect(response.success).toBe(true);
    expect(response.message).toBe('Login successful');

    // Verify login attempts are reset
    const user = await userRepository.findByEmail(email);
    expect(user?.loginAttempt).toBe(0);
  });
});
