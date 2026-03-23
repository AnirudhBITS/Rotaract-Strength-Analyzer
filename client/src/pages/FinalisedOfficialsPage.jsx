import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  HiOutlineArrowLeft, HiOutlineArrowDownTray, HiOutlineFunnel,
  HiOutlineShieldCheck, HiOutlineHeart, HiOutlinePhone,
} from 'react-icons/hi2'
import { allocationApi, getFileUrl } from '../api/client'

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export default function FinalisedOfficialsPage() {
  const navigate = useNavigate()
  const [officials, setOfficials] = useState([])
  const [loading, setLoading] = useState(true)
  const [bloodGroupFilter, setBloodGroupFilter] = useState('')
  const [donateFilter, setDonateFilter] = useState('')
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) { navigate('/admin/login'); return }
    fetchData()
  }, [bloodGroupFilter, donateFilter])

  async function fetchData() {
    try {
      const params = {}
      if (bloodGroupFilter) params.blood_group = bloodGroupFilter
      if (donateFilter !== '') params.willing_to_donate = donateFilter
      const { data } = await allocationApi.getFinalisedOfficials(params)
      setOfficials(data.officials)
    } catch (e) {
      toast.error('Failed to load finalised officials')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const params = {}
      if (bloodGroupFilter) params.blood_group = bloodGroupFilter
      if (donateFilter !== '') params.willing_to_donate = donateFilter
      const response = await allocationApi.exportFinalisedOfficials(params)
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `finalised-officials-${new Date().toISOString().split('T')[0]}.xlsx`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Export downloaded')
    } catch (e) {
      toast.error('Export failed')
    } finally {
      setExporting(false)
    }
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
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-navy-500 hover:text-navy-700">
              <HiOutlineArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-navy-900">
                Finalised <span className="text-primary-600">Officials</span>
              </h1>
              <p className="text-xs text-navy-500">
                {officials.length} confirmed district official{officials.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting || officials.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {exporting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <HiOutlineArrowDownTray className="w-4 h-4" />
            )}
            Export Excel
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative">
            <HiOutlineFunnel className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
            <select
              value={bloodGroupFilter}
              onChange={(e) => { setBloodGroupFilter(e.target.value); setLoading(true) }}
              className="pl-9 pr-8 py-3 text-sm text-navy-900 bg-white border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none"
            >
              <option value="">All Blood Groups</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            {[
              { value: '', label: 'All' },
              { value: 'true', label: 'Willing to Donate' },
              { value: 'false', label: 'Not Willing' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => { setDonateFilter(opt.value); setLoading(true) }}
                className={`px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                  donateFilter === opt.value ? 'bg-navy-900 text-white' : 'bg-white text-navy-600 border border-border-subtle hover:bg-navy-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Officials Grid */}
        {officials.length === 0 ? (
          <div className="text-center py-16">
            <HiOutlineShieldCheck className="w-12 h-12 text-navy-300 mx-auto mb-4" />
            <p className="text-sm text-navy-500">No finalised officials yet.</p>
            <Link
              to="/admin/all-allocations"
              className="inline-block mt-3 text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              Go to All Allocations to confirm officials
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {officials.map((official, i) => (
              <motion.div
                key={official.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white rounded-2xl border border-border-subtle p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Photos */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex gap-2 flex-shrink-0">
                    {official.professional_photo && (
                      <img
                        src={getFileUrl(official.professional_photo)}
                        alt={`${official.name} - Professional`}
                        className="w-14 h-14 rounded-xl object-cover border border-border-subtle"
                      />
                    )}
                    {official.casual_photo && (
                      <img
                        src={getFileUrl(official.casual_photo)}
                        alt={`${official.name} - Casual`}
                        className="w-14 h-14 rounded-xl object-cover border border-border-subtle"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-navy-900 truncate">{official.name}</h3>
                    <p className="text-xs text-navy-500 truncate">{official.club_name}</p>
                  </div>
                </div>

                {/* Position Badge */}
                <div className="mb-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                    <HiOutlineShieldCheck className="w-3.5 h-3.5" />
                    {official.position_title}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-navy-600">
                    <HiOutlinePhone className="w-3.5 h-3.5 text-navy-400" />
                    <span>{official.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-navy-600">
                    <span className="font-semibold text-navy-500">Blood Group:</span>
                    <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 font-semibold">{official.blood_group}</span>
                  </div>
                  <div className="flex items-center gap-2 text-navy-600">
                    <HiOutlineHeart className={`w-3.5 h-3.5 ${official.willing_to_donate ? 'text-red-500' : 'text-navy-300'}`} />
                    <span>{official.willing_to_donate ? 'Willing to donate blood' : 'Not willing to donate'}</span>
                  </div>
                  <div className="text-navy-500">
                    <span className="font-semibold">Profession:</span> {official.profession}
                  </div>
                  <div className="text-navy-500">
                    <span className="font-semibold">Rotary ID:</span> {official.rotary_id}
                  </div>
                  <div className="text-navy-500">
                    <span className="font-semibold">Email:</span> {official.email}
                  </div>
                </div>

                {/* Confirmed At */}
                {official.confirmed_at && (
                  <div className="mt-3 pt-3 border-t border-border-subtle">
                    <p className="text-xs text-navy-400">
                      Confirmed {new Date(official.confirmed_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
