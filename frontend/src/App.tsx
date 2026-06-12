import { Routes, Route } from 'react-router'
import BookingPage from './pages/booking-page'
import LoginPage from './pages/login-page'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<BookingPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}
