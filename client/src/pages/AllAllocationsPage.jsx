import { useState, useEffect, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  HiOutlineArrowLeft, HiOutlineCheckCircle, HiOutlineXCircle,
  HiOutlineMagnifyingGlass, HiOutlineShieldCheck, HiOutlineClipboardDocumentCheck,
} from 'react-icons/hi2'
import { allocationApi, getFileUrl } from '../api/client'

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

export default function AllAllocationsPage() {
  const navigate = useNavigate()
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [confirming, setConfirming] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) { navigate('/admin/login'); return }
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const { data } = await allocationApi.getAllAllocations()
      setPositions(data.positions)
    } catch (e) {
      toast.error('Failed to load allocations')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async (allocationId, name) => {
    if (!confirm(`Confirm ${name} as a finalised district official?`)) return

    setConfirming(allocationId)
    try {
      const { data } = await allocationApi.confirmAllocation(allocationId)
      toast.success(data.message)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Confirmation failed')
    } finally {
      setConfirming(null)
    }
  }

  const handleRemoveConfirmation = async (allocationId, name) => {
    if (!confirm(`Remove confirmation for ${name}?`)) return

    setConfirming(allocationId)
    try {
      await allocationApi.removeConfirmation(allocationId)
      toast.success('Confirmation removed')
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to remove confirmation')
    } finally {
      setConfirming(null)
    }
  }

  const handleDeallocate = async (positionId, applicantId, name) => {
    if (!confirm(`Deallocate ${name} from this position?`)) return

    try {
      await allocationApi.deallocate(positionId, applicantId)
      toast.success('Allocation removed')
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to deallocate')
    }
  }

  // Flatten all allocations for table display
  const allRows = useMemo(() => {
    const rows = []
    for (const pos of positions) {
      for (const alloc of pos.allocations) {
        rows.push({
          ...alloc,
          position_id: pos.position_id,
          position_title: pos.position_title,
          category: pos.category,
          tier: pos.tier,
        })
      }
    }
    return rows
  }, [positions])

  const filtered = useMemo(() => {
    let result = allRows
    if (statusFilter === 'confirmed') {
      result = result.filter((r) => r.is_confirmed)
    } else if (statusFilter === 'allocated') {
      result = result.filter((r) => !r.is_confirmed)
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((r) =>
        r.name?.toLowerCase().includes(q) ||
        r.club_name?.toLowerCase().includes(q) ||
        r.position_title?.toLowerCase().includes(q)
      )
    }
    return result
  }, [allRows, statusFilter, search])

  const totalAllocated = allRows.length
  const totalConfirmed = allRows.filter((r) => r.is_confirmed).length

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
                All <span className="text-primary-600">Allocations</span>
              </h1>
              <p className="text-xs text-navy-500">Manage and confirm district allocations</p>
            </div>
          </div>
          <Link
            to="/admin/finalised"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors"
          >
            <HiOutlineShieldCheck className="w-4 h-4" />
            Finalised Officials
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-border-subtle p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-navy-50 text-navy-600">
              <HiOutlineClipboardDocumentCheck className="w-5 h-5" />
            </div>
            <p className="text-2xl font-extrabold text-navy-950">{positions.length}</p>
            <p className="text-xs font-medium text-navy-500 mt-0.5">Positions Filled</p>
          </div>
          <div className="bg-white rounded-2xl border border-border-subtle p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-blue-50 text-blue-600">
              <HiOutlineCheckCircle className="w-5 h-5" />
            </div>
            <p className="text-2xl font-extrabold text-navy-950">{totalAllocated}</p>
            <p className="text-xs font-medium text-navy-500 mt-0.5">Total Allocated</p>
          </div>
          <div className="bg-white rounded-2xl border border-border-subtle p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-emerald-50 text-emerald-600">
              <HiOutlineShieldCheck className="w-5 h-5" />
            </div>
            <p className="text-2xl font-extrabold text-navy-950">{totalConfirmed}</p>
            <p className="text-xs font-medium text-navy-500 mt-0.5">Confirmed</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, club, or position..."
              className="w-full pl-10 pr-4 py-3 text-sm text-navy-900 bg-white border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 placeholder:text-navy-400"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'allocated', 'confirmed'].map((s) => (
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

        {/* Table */}
        <div className="bg-white rounded-2xl border border-border-subtle overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle bg-navy-50/50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">Position</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">Applicant</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">Club</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-navy-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => (
                  <motion.tr
                    key={row.allocation_id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-border-subtle last:border-0 hover:bg-navy-50/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-navy-900">{row.position_title}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${CATEGORY_COLORS[row.category] || 'bg-gray-100 text-gray-700'}`}>
                        {row.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {row.professional_photo && (
                          <img
                            src={getFileUrl(row.professional_photo)}
                            alt={row.name}
                            className="w-8 h-8 rounded-lg object-cover border border-border-subtle flex-shrink-0"
                          />
                        )}
                        <div>
                          <Link
                            to={`/admin/applicant/${row.applicant_id}`}
                            className="text-sm font-semibold text-navy-900 hover:text-primary-600"
                          >
                            {row.name}
                          </Link>
                          <p className="text-xs text-navy-500">{row.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-navy-600">{row.club_name}</td>
                    <td className="px-6 py-4">
                      {row.is_confirmed ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                          <HiOutlineShieldCheck className="w-3.5 h-3.5" />
                          Confirmed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          <HiOutlineCheckCircle className="w-3.5 h-3.5" />
                          Allocated
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {!row.is_confirmed ? (
                          <button
                            onClick={() => handleConfirm(row.allocation_id, row.name)}
                            disabled={confirming === row.allocation_id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                          >
                            {confirming === row.allocation_id ? (
                              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <HiOutlineCheckCircle className="w-3.5 h-3.5" />
                            )}
                            Confirm
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRemoveConfirmation(row.allocation_id, row.name)}
                            disabled={confirming === row.allocation_id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors disabled:opacity-50"
                          >
                            Undo Confirm
                          </button>
                        )}
                        <button
                          onClick={() => handleDeallocate(row.position_id, row.applicant_id, row.name)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <HiOutlineXCircle className="w-3.5 h-3.5" />
                          Deallocate
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-navy-500">
                      No allocations found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
