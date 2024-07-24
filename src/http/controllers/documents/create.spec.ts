import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Course (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to create a course', async () => {
    const response = await request(app.server).post('/courses').send({
      name: 'Infermagem',
    })

    expect(response.statusCode).toEqual(201)
  })
})
