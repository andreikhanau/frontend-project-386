import { Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import BookingPage from './pages/BookingPage'
import HomePage from './pages/HomePage'

/**
 * Описание маршрутов приложения.
 * Новые страницы подключаются здесь.
 */
function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="booking" element={<BookingPage />} />
      </Route>
    </Routes>
  )
}

export default App
