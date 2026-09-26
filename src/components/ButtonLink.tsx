import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styles from './ButtonLink.module.css'

type ButtonVariant = 'primary' | 'secondary'

interface ButtonLinkProps {
  /** Адрес страницы, на которую ведёт ссылка. */
  readonly to: string
  /** Подпись на кнопке. */
  readonly children: ReactNode
  /** Оформление: основное действие или второстепенный переход. */
  readonly variant?: ButtonVariant
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
}

/**
 * Кнопка-ссылка: переход по маршруту приложения.
 *
 * Ссылка, а не `<button>`: это навигация, а не действие над данными.
 */
function ButtonLink({ to, children, variant = 'primary' }: ButtonLinkProps) {
  return (
    <Link to={to} className={`${styles.button} ${VARIANT_CLASS[variant]}`}>
      {children}
    </Link>
  )
}

export default ButtonLink
