// @vitest-environment node
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApp } from './app.js'

describe('GET /api/health', () => {
  it('отвечает статусом 200', async () => {
    const response = await request(createApp()).get('/api/health')

    expect(response.status).toBe(200)
  })

  it('возвращает тело { status: "ok" }', async () => {
    const response = await request(createApp()).get('/api/health')

    expect(response.body).toEqual({ status: 'ok' })
  })
})
