import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { prisma } from '@/lib/prisma'
import { makeProvinceUseCase } from '@/use-cases/factories/make-province-use-case'
import { makeCourseUseCase } from '@/use-cases/factories/make-course-use-case'

describe('Enrollment Fetch (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to fetch a list of enrollments', async () => {

    //refactorar
    let county = await prisma.county.create({
      data: {
        name: "Viana"
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

    const student1 = await prisma.student.create({
      data: {
        fullName: 'John Doe',
        dateOfBirth: new Date('2000-01-01'),
        email: 'john.doe@exampl1e.com',
        emissionDate: new Date('2024-07-09'),
        expirationDate: new Date('2024-12-31'),
        father: 'John Doe Sr.',
        gender: 'MALE',
        height: 1.75,
        identityCardNumber: '1234567891',
        maritalStatus: 'SINGLE',
        mother: 'Jane Doe',
        password: 'password123',
        residence: '123 Main St, City',
        phone: "1234567891",
        type: 'REGULAR',
        alternativePhone: "9876543210",
        provinceId: province.id,
        countyId: county.id,
      }
    });

    const courseUseCase = makeCourseUseCase()
    let { course } = await courseUseCase.execute({
      name: "Infermagem",
    })

    //refactorar
    let level = await prisma.level.create({
      data: {
        name: "CLASS_10"
      }
    })

    await request(app.server)
      .post('/enrollments')
      .set('Content-Type', 'application/json')
      .send({
        id: 1,
        state: 'PENDING',
        identityCardNumber: student.identityCardNumber,
        courseId: course.id,
        levelId: level.id,
      });

    await request(app.server)
      .post('/enrollments')
      .set('Content-Type', 'application/json')
      .send({
        id: 2,
        state: 'PENDING',
        identityCardNumber: student1.identityCardNumber,
        courseId: course.id,
        levelId: level.id,
      });

    const response = await request(app.server).get(`/enrollments`)
    console.log(response.body.enrollments)
    expect(response.body.enrollments.totalItems).toEqual(2)
  })
})
