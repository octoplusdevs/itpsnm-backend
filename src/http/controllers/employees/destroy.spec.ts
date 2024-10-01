import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { prisma } from '@/lib/prisma'

describe('Course (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to destroy a course', async () => {
    const course = await prisma.course.create({
      data: {
        name: 'Infermagem',
      }
    })
    const response = await request(app.server).delete(`/courses/${course.id}`)

    expect(response.statusCode).toEqual(201)
  })
})
