import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { prisma } from '@/lib/prisma';
import { makeProvinceUseCase } from '@/use-cases/factories/make-province-use-case';

describe('Enrollment (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create an enrollment', async () => {

    await prisma.county.create({
      data: {
        id: 1,
        name: "Viana"
      }
    })

    const provinceUseCase = makeProvinceUseCase()
    let { province } = await provinceUseCase.execute({
      name: 'Luanda',
    })

    await prisma.student.create({
      data: {
        id: 1,
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
        phone: "1234567890",
        type: 'REGULAR',
        alternativePhone: "9876543210",
        provinceId: province.id,
        countyId: 1,
      }
    });

    await prisma.course.create({
      data: {
        id: 1,
        name: "Infermagem"
      }
    })

    await prisma.level.create({
      data: {
        id: 1,
        name: "CLASS_10"
      }
    })

    const enrollmentResponse = await request(app.server)
      .post('/enrollments')
      .set('Content-Type', 'application/json')
      .send({
        identityCardNumber: '1234567890',
        courseId: 1,
        levelId: 1,
      });

    expect(enrollmentResponse.statusCode).toEqual(201);
    expect(enrollmentResponse.body.enrollment.docsState).toEqual('PENDING');
    expect(enrollmentResponse.body.enrollment.paymentState).toEqual('PENDING');
    expect(enrollmentResponse.body.enrollment.identityCardNumber).toEqual('1234567890');
    expect(enrollmentResponse.body.enrollment.courseId).toEqual(1);
    expect(enrollmentResponse.body.enrollment.levelId).toEqual(1);
  });
});
