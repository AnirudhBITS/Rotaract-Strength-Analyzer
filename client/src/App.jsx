import { Routes, Route } from 'react-router-dom'
import { Component } from 'react'
import HomePage from './pages/HomePage'
import FormPage from './pages/FormPage'
import ResultPage from './pages/ResultPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import ApplicantDetail from './pages/ApplicantDetail'
import PositionsPage from './pages/PositionsPage'
import PositionDetail from './pages/PositionDetail'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, info: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    this.setState({ info })
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, fontFamily: 'system-ui', maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ color: 'red', fontSize: 18 }}>Something went wrong</h2>
          <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 8, fontSize: 11, whiteSpace: 'pre-wrap', overflow: 'auto', maxHeight: '60vh' }}>
            {String(this.state.error)}
            {'\n\n'}
            {this.state.info?.componentStack}
          </pre>
          <button onClick={() => window.location.href = '/'} style={{ marginTop: 12, padding: '8px 16px', background: '#e71e6d', color: 'white', border: 'none', borderRadius: 8, fontSize: 14 }}>
            Go Home
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/apply" element={<ErrorBoundary><FormPage /></ErrorBoundary>} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/applicant/:id" element={<ApplicantDetail />} />
        <Route path="/admin/positions" element={<PositionsPage />} />
        <Route path="/admin/positions/:positionId" element={<PositionDetail />} />
      </Routes>
    </ErrorBoundary>
  )
}
