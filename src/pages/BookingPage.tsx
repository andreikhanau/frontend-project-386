import ButtonLink from '../components/ButtonLink'
import styles from './BookingPage.module.css'

/**
 * Страница записи.
 *
 * Пока заглушка: выбор звонка, календарь и форма бронирования
 * реализуются на следующих этапах.
 */
function BookingPage() {
  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Запись на звонок</h1>
      <p className={styles.text}>
        Выбор звонка, календарь со свободным временем и подтверждение записи
        появятся на следующем этапе.
      </p>
      <ButtonLink to="/" variant="secondary">
        На главную
      </ButtonLink>
    </section>
  )
}

export default BookingPage
