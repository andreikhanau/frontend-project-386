import ButtonLink from '../components/ButtonLink'
import styles from './HomePage.module.css'

interface Step {
  /** Заголовок шага: что делает пользователь. */
  readonly title: string
  /** Пояснение шага. */
  readonly text: string
}

const STEPS: readonly Step[] = [
  {
    title: 'Выберите звонок.',
    text: 'Посмотрите доступные варианты и решите, на что хотите записаться.',
  },
  {
    title: 'Выберите свободное время.',
    text: 'Откройте календарь и найдите удобное время.',
  },
  {
    title: 'Получите подтверждение.',
    text: 'Время закреплено за вами, звонок подтверждён.',
  },
]

/**
 * Главная страница: рассказывает о сервисе и ведёт на страницу записи.
 *
 * Статична: не обращается к API. Решение зафиксировано в ADR-0002.
 */
function HomePage() {
  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Календарь звонков</h1>
        <p className={styles.lead}>
          Сервис для записи на звонки: выберите свободное время в календаре и
          запишитесь.
        </p>
        <ButtonLink to="/booking">Записаться на звонок</ButtonLink>
      </div>

      <section className={styles.howTo}>
        <h2 className={styles.howToTitle}>Как записаться</h2>
        <ol className={styles.steps}>
          {STEPS.map(({ title, text }, index) => (
            <li key={title} className={styles.step}>
              <span className={styles.stepTitle}>
                {`${index + 1}. ${title}`}
              </span>
              <span className={styles.stepText}>{text}</span>
            </li>
          ))}
        </ol>
      </section>
    </section>
  )
}

export default HomePage
