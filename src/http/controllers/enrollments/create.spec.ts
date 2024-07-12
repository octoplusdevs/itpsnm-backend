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

    //refactorar
    let county = await prisma.county.create({
      data: {
        name: "Viana"
      }
    })

    console.log(county)

    const provinceUseCase = makeProvinceUseCase()
    let { province } = await provinceUseCase.execute({
      name: 'Luanda',
    })

    console.log(province)

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

    console.log(student)



    //refactorar
    let course = await prisma.course.create({
      data: {
        name: "Infermagem"
      }
    })

    console.log(course)


    //refactorar
    let level = await prisma.level.create({
      data: {
        name: "CLASS_10"
      }
    })

    console.log(level)


    const enrollmentResponse = await request(app.server)
    .post('/enrollments')
    .set('Content-Type', 'application/json')
    .send({
      id: 1,
      state: 'PENDING',
      identityCardNumber: student.identityCardNumber,
      courseId: course.id,
      levelId: level.id,
    });

    console.log(enrollmentResponse.body)
    expect(enrollmentResponse.statusCode).toEqual(201);
    expect(enrollmentResponse.body.enrollment.id).toEqual(1);
    expect(enrollmentResponse.body.enrollment.state).toEqual('PENDING');
    expect(enrollmentResponse.body.enrollment.studentId).toEqual(student.id);
    expect(enrollmentResponse.body.enrollment.courseId).toEqual(course.id);
    expect(enrollmentResponse.body.enrollment.levelId).toEqual(level.id);
  });
});
