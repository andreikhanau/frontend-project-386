import cors from 'cors'
import express, { type Express } from 'express'
import type { HealthResponse } from './types.js'

/**
 * Создаёт и настраивает Express-приложение.
 *
 * Вынесено отдельно от запуска, чтобы приложение можно было
 * подключить в тестах через supertest без открытия порта.
 */
export const createApp = (): Express => {
  const app = express()

  app.use(cors())
  app.use(express.json())

  app.get('/api/health', (_req, res) => {
    const body: HealthResponse = { status: 'ok' }
    res.status(200).json(body)
  })

  return app
}
