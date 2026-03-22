import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  HiOutlineUsers, HiOutlineClock, HiOutlineCheckCircle,
  HiOutlineStar, HiOutlineXCircle, HiOutlineMagnifyingGlass,
  HiOutlineFunnel, HiOutlineArrowDownTray, HiOutlineArrowRightOnRectangle,
  HiOutlineSquares2X2,
} from 'react-icons/hi2'
import { adminApi } from '../api/client'

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  reviewed: 'bg-blue-100 text-blue-700',
  shortlisted: 'bg-purple-100 text-purple-700',
  selected: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
}

const STATUS_ICONS = {
  pending: HiOutlineClock,
  reviewed: HiOutlineMagnifyingGlass,
  shortlisted: HiOutlineStar,
  selected: HiOutlineCheckCircle,
  rejected: HiOutlineXCircle,
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [applicants, setApplicants] = useState([])
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)

  const adminInfo = JSON.parse(localStorage.getItem('admin_info') || '{}')

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      navigate('/admin/login')
      return
    }
    fetchData()
  }, [page, search, statusFilter])

  async function fetchData() {
    try {
      const [statsRes, applicantsRes] = await Promise.all([
        adminApi.getDashboard(),
        adminApi.getApplicants({ page, limit: 20, search, status: statusFilter || undefined }),
      ])
      setStats(statsRes.data)
      setApplicants(applicantsRes.data.applicants)
      setPagination(applicantsRes.data.pagination)
    } catch {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const response = await adminApi.exportAll()
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `rotaract-applicants-${new Date().toISOString().split('T')[0]}.xlsx`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Export downloaded')
    } catch {
      toast.error('Export failed')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_info')
    navigate('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white border-b border-border-subtle sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-navy-900">
              Admin <span className="text-primary-600">Dashboard</span>
            </h1>
            <p className="text-xs text-navy-500">Welcome, {adminInfo.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/positions"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors"
            >
              <HiOutlineSquares2X2 className="w-4 h-4" />
              Positions
            </Link>
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-navy-700 bg-white border border-border-subtle rounded-xl hover:bg-navy-50 transition-colors"
            >
              <HiOutlineArrowDownTray className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-border-subtle rounded-xl hover:bg-red-50 transition-colors"
            >
              <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stat Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <StatCard label="Total" value={stats.total} icon={HiOutlineUsers} color="navy" />
            <StatCard label="Pending" value={stats.statusCounts?.pending || 0} icon={HiOutlineClock} color="amber" />
            <StatCard label="Reviewed" value={stats.statusCounts?.reviewed || 0} icon={HiOutlineMagnifyingGlass} color="blue" />
            <StatCard label="Shortlisted" value={stats.statusCounts?.shortlisted || 0} icon={HiOutlineStar} color="purple" />
            <StatCard label="Selected" value={stats.statusCounts?.selected || 0} icon={HiOutlineCheckCircle} color="emerald" />
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by name, email, or club..."
              className="w-full pl-10 pr-4 py-3 text-sm text-navy-900 bg-white border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 placeholder:text-navy-400"
            />
          </div>
          <div className="relative">
            <HiOutlineFunnel className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
              className="pl-9 pr-8 py-3 text-sm text-navy-900 bg-white border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="selected">Selected</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-border-subtle overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle bg-navy-50/50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">App #</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">Club</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">Applied</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((a, i) => {
                  const StatusIcon = STATUS_ICONS[a.status] || HiOutlineClock
                  return (
                    <motion.tr
                      key={a.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border-subtle last:border-0 hover:bg-navy-50/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-xs font-mono font-semibold text-navy-600">{a.application_number || '—'}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-navy-900">{a.name}</td>
                      <td className="px-6 py-4 text-sm text-navy-600">{a.club_name}</td>
                      <td className="px-6 py-4 text-sm text-navy-500">{a.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[a.status]}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {a.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-navy-500">
                        {new Date(a.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/admin/applicant/${a.id}`}
                          className="text-sm font-medium text-primary-600 hover:text-primary-700"
                        >
                          View
                        </Link>
                      </td>
                    </motion.tr>
                  )
                })}
                {applicants.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-sm text-navy-500">
                      No applicants found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border-subtle">
              <p className="text-sm text-navy-500">
                Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, pagination.total)} of {pagination.total}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-sm font-medium text-navy-600 bg-white border border-border-subtle rounded-lg hover:bg-navy-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                <span className="px-3 py-1.5 text-sm font-semibold text-primary-600 bg-primary-50 rounded-lg">
                  {page}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="px-3 py-1.5 text-sm font-medium text-navy-600 bg-white border border-border-subtle rounded-lg hover:bg-navy-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Top Strengths */}
        {stats?.topStrengths?.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl border border-border-subtle p-6">
            <h2 className="text-lg font-bold text-navy-900 mb-4">Most Common Top 5 Strengths</h2>
            <div className="flex flex-wrap gap-2">
              {stats.topStrengths.map((s) => (
                <span key={s.theme} className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium">
                  {s.theme} ({s.count})
                </span>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, color }) {
  const colorMap = {
    navy: 'bg-navy-50 text-navy-600',
    amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  }

  return (
    <div className="bg-white rounded-2xl border border-border-subtle p-5 shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colorMap[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-extrabold text-navy-950">{value}</p>
      <p className="text-xs font-medium text-navy-500 mt-0.5">{label}</p>
    </div>
  )
}
