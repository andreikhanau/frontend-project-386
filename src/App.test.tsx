import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from './App'
import store from './app/store'

const renderApp = (path = '/') =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </Provider>,
  )

/**
 * Смоук-тесты каркаса: приложение монтируется и рендерит стартовую страницу.
 */
describe('App', () => {
  it('рендерит стартовую страницу', () => {
    renderApp()

    expect(
      screen.getByRole('heading', { name: 'Календарь звонков', level: 1 }),
    ).toBeInTheDocument()
  })

  it('рендерит навигацию и общий лейаут', () => {
    renderApp()

    expect(
      screen.getByRole('navigation', { name: 'Основная навигация' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})
