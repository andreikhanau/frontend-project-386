import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

/** Заголовок главной страницы. */
const homeHeading = () =>
  screen.getByRole('heading', { name: 'Календарь звонков', level: 1 })

/**
 * Смоук-тесты каркаса: приложение монтируется и рендерит стартовую страницу.
 */
describe('App', () => {
  it('рендерит стартовую страницу', () => {
    renderApp()

    expect(homeHeading()).toBeInTheDocument()
  })

  it('рендерит навигацию и общий лейаут', () => {
    renderApp()

    expect(
      screen.getByRole('navigation', { name: 'Основная навигация' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})

/**
 * Главная страница: статический контент о сервисе и основное действие.
 */
describe('Главная страница', () => {
  it('рассказывает о сервисе заголовком и лидом', () => {
    renderApp()

    expect(homeHeading()).toBeInTheDocument()
    expect(
      screen.getByText(
        'Сервис для записи на звонки: выберите свободное время в календаре и запишитесь.',
      ),
    ).toBeInTheDocument()
  })

  it('объясняет, как записаться, тремя шагами', () => {
    renderApp()

    const howTo = screen
      .getByRole('heading', { name: 'Как записаться', level: 2 })
      .closest('section')

    expect(howTo).not.toBeNull()
    const steps = within(howTo as HTMLElement)
      .getAllByRole('listitem')
      .map((item) => item.textContent)

    expect(steps).toEqual([
      '1. Выберите звонок.Посмотрите доступные варианты и решите, на что хотите записаться.',
      '2. Выберите свободное время.Откройте календарь и найдите удобное время.',
      '3. Получите подтверждение.Время закреплено за вами, звонок подтверждён.',
    ])
  })

  it('предлагает основное действие ссылкой на страницу записи', () => {
    renderApp()

    expect(
      screen.getByRole('link', { name: 'Записаться на звонок' }),
    ).toHaveAttribute('href', '/booking')
  })

  it('показывает в навигации ссылку на страницу записи', () => {
    renderApp()

    const nav = screen.getByRole('navigation', { name: 'Основная навигация' })
    expect(
      within(nav).getByRole('link', { name: 'Записаться' }),
    ).toHaveAttribute('href', '/booking')
  })
})

/**
 * Переходы между главной страницей и страницей записи.
 */
describe('Переход на страницу записи', () => {
  it('по основному действию открывает страницу записи', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getByRole('link', { name: 'Записаться на звонок' }))

    expect(
      screen.getByRole('heading', { name: 'Запись на звонок', level: 1 }),
    ).toBeInTheDocument()
  })

  it('возвращает на главную страницу', async () => {
    const user = userEvent.setup()
    renderApp('/booking')

    await user.click(screen.getByRole('link', { name: 'На главную' }))

    expect(homeHeading()).toBeInTheDocument()
  })
})
