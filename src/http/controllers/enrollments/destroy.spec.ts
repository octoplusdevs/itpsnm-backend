import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { prisma } from '@/lib/prisma'
import { makeProvinceUseCase } from '@/use-cases/factories/make-province-use-case'

describe('Enrollment Destroy (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to destroy a enrollment', async () => {

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

    //refactorar
    let course = await prisma.course.create({
      data: {
        name: "Infermagem"
      }
    })

    //refactorar
    let level = await prisma.level.create({
      data: {
        name: "CLASS_10"
      }
    })

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

    const response = await request(app.server).delete(`/enrollments/${enrollmentResponse.body.enrollment.id}`)

    expect(response.statusCode).toEqual(201)
  })
})
