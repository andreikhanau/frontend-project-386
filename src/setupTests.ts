import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'

// Очистка DOM между тестами. Нужна только в jsdom-окружении:
// бэкенд-тесты запускаются в node и импортировать RTL там нельзя.
afterEach(async () => {
  if (typeof document !== 'undefined') {
    const { cleanup } = await import('@testing-library/react')
    cleanup()
  }
})
