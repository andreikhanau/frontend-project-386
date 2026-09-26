import { NavLink, Outlet } from 'react-router-dom'
import styles from './AppLayout.module.css'

interface NavItem {
  /** Адрес маршрута. */
  readonly to: string
  /** Подпись в интерфейсе. */
  readonly label: string
  /** Точное совпадение пути — для корневого маршрута. */
  readonly end?: boolean
}

const NAV_ITEMS: readonly NavItem[] = [
  { to: '/', label: 'Главная', end: true },
]

/**
 * Общий каркас приложения: шапка с навигацией и область для вложенных страниц.
 */
function AppLayout() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <NavLink to="/" className={styles.logo}>
            Календарь&nbsp;звонков
          </NavLink>
          <nav className={styles.nav} aria-label="Основная навигация">
            {NAV_ITEMS.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLink} ${styles.navLinkActive}`
                    : styles.navLink
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p>Учебный проект · Hexlet</p>
      </footer>
    </div>
  )
}

export default AppLayout
