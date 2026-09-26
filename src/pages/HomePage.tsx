import styles from './HomePage.module.css'

/**
 * Стартовая страница-заглушка.
 * Наполняется по мере реализации функциональности.
 */
function HomePage() {
  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Календарь звонков</h1>
      <p className={styles.lead}>
        Упрощённый аналог Cal.com: планирование звонков по свободным слотам.
      </p>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Каркас приложения готов</h2>
        <p className={styles.cardText}>
          Настроены маршрутизация, общее состояние, лейаут и дизайн-токены.
          Функциональные страницы появятся на следующих этапах.
        </p>
      </div>
    </section>
  )
}

export default HomePage
