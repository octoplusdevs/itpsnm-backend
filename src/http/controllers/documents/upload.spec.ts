import request from 'supertest';
import { app } from '@/app';
import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { prisma } from '@/lib/prisma';
import { makeProvinceUseCase } from '@/use-cases/factories/make-province-use-case';

describe('Document Upload (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to upload files and create a document', async () => {

    let county = await prisma.county.create({
      data: {
        name: 'Viana',
      }
    })

    const provinceUseCase = makeProvinceUseCase()
    let { province } = await provinceUseCase.execute({
      name: 'Luanda',
    })

    const student = await prisma.student.create({
      data: {
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
        countyId: county.id,
      }
    });

    const enrollment = await prisma.enrollment.create({
      data: {
        docsState: 'PENDING',
        paymentState: 'PENDING',
        identityCardNumber: '1234567890',
      },
    });

    const response = await request(app.server)
      .post('/uploads/enrollments')
      .set('Content-Type', 'application/multipart')
      .send({
        enrollmentId: enrollment.id,
        files: [
          {
            name: 'document1.pdf',
            path: '/path/to/document1.pdf',
            format: 'PDF',
            type: 'IDENTITY_CARD',
            identityCardNumber: student.identityCardNumber,
          },
          {
            name: 'image1.jpg',
            path: '/path/to/image1.jpg',
            format: 'JPEG',
            type: 'IDENTITY_CARD',
            identityCardNumber: student.identityCardNumber,
          },
        ],
      })

    console.log(response.body)
    expect(response.status).toEqual(201);
    expect(response.body.document).toHaveProperty('id');
    expect(response.body.files).toHaveLength(2);
    expect(response.body.files[0]).toHaveProperty('id');
    expect(response.body.files[1]).toHaveProperty('id');
  });
});
