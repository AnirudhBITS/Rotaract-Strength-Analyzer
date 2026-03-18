import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import FormPage from './pages/FormPage'
import ResultPage from './pages/ResultPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import ApplicantDetail from './pages/ApplicantDetail'
import PositionsPage from './pages/PositionsPage'
import PositionDetail from './pages/PositionDetail'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/apply" element={<FormPage />} />
      <Route path="/result" element={<ResultPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/applicant/:id" element={<ApplicantDetail />} />
      <Route path="/admin/positions" element={<PositionsPage />} />
      <Route path="/admin/positions/:positionId" element={<PositionDetail />} />
    </Routes>
  )
}
