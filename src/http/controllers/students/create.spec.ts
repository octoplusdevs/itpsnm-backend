import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { prisma } from '@/lib/prisma';
import { makeProvinceUseCase } from '@/use-cases/factories/make-province-use-case';

describe('Student (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a student', async () => {

    //refatorar com um repositorio
    let county = await prisma.county.create({
      data: {
        name: 'Viana',
      }
    })

    const provinceUseCase = makeProvinceUseCase()
    let { province } = await provinceUseCase.execute({
      name: 'Luanda',
    })
    const studentData = {
      fullName: 'John Doe',
      dateOfBirth: new Date('2000-01-01'),
      email: 'john.doe@example.com',
      emissionDate: new Date('2024-07-09'),
      expirationDate: new Date('2024-12-31'),
      father: 'John Doe Sr.',
      gender: 'MALE',
      height: 1.75,
      identityCardNumber: '1234567890',
      maritalStatus: 'SINGLE',
      mother: 'Jane Doe',
      password: 'password123',
      residence: '123 Main St, City',
      phone: 1234567890,
      type: 'REGULAR',
      alternativePhone: 9876543210,
      provinceId: province.id,
      countyId: county.id,
    };

    const response = await request(app.server)
      .post('/students')
      .set('Content-Type', 'application/json')
      .send(studentData);
    expect(response.statusCode).toEqual(201);
  });
});
