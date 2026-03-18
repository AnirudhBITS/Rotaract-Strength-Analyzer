import { useState, useEffect, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  HiOutlineMagnifyingGlass, HiOutlineFunnel, HiOutlineCheckCircle,
  HiOutlineExclamationCircle, HiOutlineUserGroup, HiOutlineArrowLeft,
  HiOutlineChartBar,
} from 'react-icons/hi2'
import { allocationApi } from '../api/client'

const CATEGORY_COLORS = {
  'Executive Leadership': 'bg-red-100 text-red-700',
  'Administration': 'bg-blue-100 text-blue-700',
  'Event Management': 'bg-purple-100 text-purple-700',
  'Group Management': 'bg-teal-100 text-teal-700',
  'Operations/Protocol': 'bg-orange-100 text-orange-700',
  'Service Avenues': 'bg-emerald-100 text-emerald-700',
  'Specialized': 'bg-pink-100 text-pink-700',
  'Communications & Media': 'bg-sky-100 text-sky-700',
}

export default function PositionsPage() {
  const navigate = useNavigate()
  const [positions, setPositions] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) { navigate('/admin/login'); return }
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [posRes, sumRes] = await Promise.all([
        allocationApi.getPositions(),
        allocationApi.getSummary(),
      ])
      setPositions(posRes.data.positions)
      setSummary(sumRes.data)
    } catch {
      toast.error('Failed to load positions')
    } finally {
      setLoading(false)
    }
  }

  const categories = useMemo(() => {
    const cats = [...new Set(positions.map((p) => p.category))]
    return ['All', ...cats]
  }, [positions])

  const filtered = useMemo(() => {
    let result = positions
    if (categoryFilter !== 'All') {
      result = result.filter((p) => p.category === categoryFilter)
    }
    if (statusFilter === 'filled') {
      result = result.filter((p) => p.is_filled)
    } else if (statusFilter === 'vacant') {
      result = result.filter((p) => !p.is_filled)
    }
    if (search) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      )
    }
    return result
  }, [positions, categoryFilter, statusFilter, search])

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
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-navy-500 hover:text-navy-700">
              <HiOutlineArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-navy-900">
                Position <span className="text-primary-600">Allocation</span>
              </h1>
              <p className="text-xs text-navy-500">Manage district position assignments</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <SummaryCard label="Total Positions" value={summary.totalPositions} color="navy" icon={HiOutlineChartBar} />
            <SummaryCard label="Filled" value={summary.filledPositions} color="emerald" icon={HiOutlineCheckCircle} />
            <SummaryCard label="Vacant" value={summary.vacantPositions} color="amber" icon={HiOutlineExclamationCircle} />
            <SummaryCard
              label="Fill Rate"
              value={`${summary.fillRate}%`}
              color={summary.fillRate > 70 ? 'emerald' : summary.fillRate > 40 ? 'amber' : 'red'}
              icon={HiOutlineUserGroup}
            />
          </div>
        )}

        {/* Category Progress */}
        {summary?.categoryStats && (
          <div className="mb-8 bg-white rounded-2xl border border-border-subtle p-6 shadow-sm">
            <h2 className="text-sm font-bold text-navy-900 mb-4">Category Breakdown</h2>
            <div className="space-y-3">
              {Object.entries(summary.categoryStats).map(([category, stats]) => {
                const percent = stats.total > 0 ? Math.round((stats.filled / stats.total) * 100) : 0
                return (
                  <div key={category} className="flex items-center gap-4">
                    <span className="w-44 text-sm font-medium text-navy-700 flex-shrink-0 truncate">{category}</span>
                    <div className="flex-1 h-4 bg-navy-50 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${percent === 100 ? 'bg-emerald-500' : percent > 0 ? 'bg-primary-500' : 'bg-navy-100'}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="w-20 text-xs font-semibold text-navy-600 text-right flex-shrink-0">
                      {stats.filled}/{stats.total}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search positions..."
              className="w-full pl-10 pr-4 py-3 text-sm text-navy-900 bg-white border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 placeholder:text-navy-400"
            />
          </div>
          <div className="relative">
            <HiOutlineFunnel className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-9 pr-8 py-3 text-sm text-navy-900 bg-white border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            {['all', 'filled', 'vacant'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                  statusFilter === s ? 'bg-navy-900 text-white' : 'bg-white text-navy-600 border border-border-subtle hover:bg-navy-50'
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Positions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((pos, i) => (
            <motion.div
              key={pos.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
            >
              <Link
                to={`/admin/positions/${pos.id}`}
                className={`block p-5 rounded-2xl border-2 transition-all duration-200 hover:shadow-md ${
                  pos.is_filled
                    ? 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-300'
                    : 'bg-white border-border-subtle hover:border-navy-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${CATEGORY_COLORS[pos.category] || 'bg-gray-100 text-gray-700'}`}>
                    {pos.category}
                  </span>
                  {pos.is_filled ? (
                    <HiOutlineCheckCircle className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <HiOutlineExclamationCircle className="w-5 h-5 text-navy-300" />
                  )}
                </div>

                <h3 className="text-sm font-bold text-navy-900 mb-1 leading-snug">{pos.title}</h3>
                <p className="text-xs text-navy-400 mb-4">{pos.tier}</p>

                <div className="flex items-center gap-4 text-xs">
                  <span className="text-navy-500">
                    <strong className="text-navy-700">{pos.interest_count}</strong> interested
                  </span>
                  <span className="text-navy-500">
                    <strong className="text-navy-700">{pos.suggestion_count}</strong> suggested
                  </span>
                </div>

                {pos.is_filled && pos.allocated[0] && (
                  <div className="mt-3 pt-3 border-t border-emerald-200">
                    <p className="text-xs font-semibold text-emerald-700">
                      Allocated: {pos.allocated[0].applicant_name}
                    </p>
                    <p className="text-xs text-emerald-600">{pos.allocated[0].club_name}</p>
                  </div>
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-navy-500">
            No positions match your filters.
          </div>
        )}
      </main>
    </div>
  )
}

function SummaryCard({ label, value, color, icon: Icon }) {
  const colorMap = {
    navy: 'bg-navy-50 text-navy-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
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
