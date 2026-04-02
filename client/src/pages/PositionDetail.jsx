import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  HiOutlineArrowLeft, HiOutlineCheckCircle, HiOutlineXMark,
  HiOutlineUserPlus, HiOutlineExclamationTriangle, HiOutlineStar,
  HiOutlineMagnifyingGlass, HiOutlineArrowDownTray, HiOutlineCalendarDays,
} from 'react-icons/hi2'
import { allocationApi, getFileUrl } from '../api/client'

const STRENGTH_COLORS = {
  Achiever: 'bg-emerald-100 text-emerald-700',
  Activator: 'bg-orange-100 text-orange-700',
  Analytical: 'bg-blue-100 text-blue-700',
  Arranger: 'bg-purple-100 text-purple-700',
  Command: 'bg-red-100 text-red-700',
  Communication: 'bg-sky-100 text-sky-700',
  Connectedness: 'bg-teal-100 text-teal-700',
  Consistency: 'bg-indigo-100 text-indigo-700',
  Deliberative: 'bg-slate-100 text-slate-700',
  Developer: 'bg-green-100 text-green-700',
  Discipline: 'bg-zinc-100 text-zinc-700',
  Empathy: 'bg-pink-100 text-pink-700',
  Focus: 'bg-amber-100 text-amber-700',
  Futuristic: 'bg-violet-100 text-violet-700',
  Ideation: 'bg-fuchsia-100 text-fuchsia-700',
  Includer: 'bg-lime-100 text-lime-700',
  Maximizer: 'bg-yellow-100 text-yellow-700',
  Responsibility: 'bg-cyan-100 text-cyan-700',
  Strategic: 'bg-rose-100 text-rose-700',
}

export default function PositionDetail() {
  const { positionId } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [allocating, setAllocating] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [unallocated, setUnallocated] = useState([])
  const [loadingUnallocated, setLoadingUnallocated] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [scheduleForm, setScheduleForm] = useState({ applicantId: '', date: '', time: '', meetLink: '' })
  const [scheduling, setScheduling] = useState(false)
  const [scheduledMap, setScheduledMap] = useState({})

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) { navigate('/admin/login'); return }
    fetchData()
  }, [positionId])

  async function fetchData() {
    try {
      const [candidatesRes, unallocRes, meetingsRes] = await Promise.all([
        allocationApi.getCandidates(positionId),
        allocationApi.getUnallocated(),
        allocationApi.getScheduledMeetings({ positionId }),
      ])
      setData(candidatesRes.data)
      setUnallocated(unallocRes.data.applicants)
      const map = {}
      for (const m of meetingsRes.data.meetings) {
        map[m.applicant_id] = { date: m.date, time: m.time, meetLink: m.meet_link }
      }
      setScheduledMap(map)
    } catch (e) {
      toast.error('Failed to load position details')
      navigate('/admin/positions')
    } finally {
      setLoading(false)
    }
  }

  const handleAllocate = async (applicantId, applicantName) => {
    if (!confirm(`Allocate ${applicantName} to "${data.position.title}"?`)) return

    setAllocating(applicantId)
    try {
      const { data: res } = await allocationApi.allocate(positionId, { applicantId })
      toast.success(res.message)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Allocation failed')
    } finally {
      setAllocating(null)
    }
  }

  const handleDeallocate = async (applicantId, applicantName) => {
    if (!confirm(`Remove ${applicantName} from "${data.position.title}"?`)) return

    try {
      await allocationApi.deallocate(positionId, applicantId)
      toast.success('Allocation removed')
      fetchData()
    } catch (e) {
      toast.error('Failed to remove allocation')
    }
  }

  const handleScheduleMeeting = async (e) => {
    e.preventDefault()
    if (!scheduleForm.applicantId || !scheduleForm.date || !scheduleForm.time || !scheduleForm.meetLink) {
      toast.error('Please fill all fields')
      return
    }
    setScheduling(true)
    try {
      const res = await allocationApi.scheduleMeeting({
        applicantId: parseInt(scheduleForm.applicantId, 10),
        positionId: parseInt(positionId, 10),
        date: scheduleForm.date,
        time: scheduleForm.time,
        meetLink: scheduleForm.meetLink,
      })
      toast.success(res.data.message)
      setShowScheduleModal(false)
      setScheduleForm({ applicantId: '', date: '', time: '', meetLink: '' })
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send meeting schedule')
    } finally {
      setScheduling(false)
    }
  }

  const handleExportCandidates = async () => {
    try {
      const response = await allocationApi.exportPositionCandidates(positionId)
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${data.position.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-candidates.xlsx`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Export downloaded')
    } catch (e) {
      toast.error('Export failed')
    }
  }

  const handleSearch = async (q) => {
    setSearchQuery(q)
    if (q.length < 2) { setSearchResults([]); return }
    setSearching(true)
    try {
      const { data: res } = await allocationApi.searchApplicants(q)
      setSearchResults(res.applicants)
    } catch (e) { setSearchResults([]) }
    finally { setSearching(false) }
  }

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    )
  }

  const { position, userChoices, systemSuggestions, currentAllocations = [] } = data
  const allocatedIds = currentAllocations.map((a) => a.applicant_id)

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-white border-b border-border-subtle sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin/positions" className="text-navy-500 hover:text-navy-700">
              <HiOutlineArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-navy-900">{position.title}</h1>
              <p className="text-xs text-navy-500">{position.category} &middot; {position.tier}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowScheduleModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-xl hover:bg-pink-700 transition-colors"
            >
              <HiOutlineCalendarDays className="w-4 h-4" />
              Schedule Meet
            </button>
            <button
              onClick={handleExportCandidates}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-navy-700 bg-white border border-border-subtle rounded-xl hover:bg-navy-50 transition-colors"
            >
              <HiOutlineArrowDownTray className="w-4 h-4" />
              Export
            </button>
            {currentAllocations.length > 0 && (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                {currentAllocations.length} Allocated
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Current Allocations */}
        {currentAllocations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <HiOutlineCheckCircle className="w-6 h-6 text-emerald-600" />
              <div>
                <h3 className="text-sm font-bold text-emerald-900">Currently Allocated ({currentAllocations.length})</h3>
                <p className="text-sm text-emerald-700">You can add more or deallocate existing ones.</p>
              </div>
            </div>
            <div className="space-y-2">
              {currentAllocations.map((a) => (
                <div key={a.applicant_id} className="flex items-center justify-between p-3 bg-white rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-navy-900">{a.applicant_name}</p>
                    <p className="text-xs text-navy-500">{a.club_name} &middot; {a.applicant_email}</p>
                  </div>
                  <button
                    onClick={() => handleDeallocate(a.applicant_id, a.applicant_name)}
                    className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Schedule Summary */}
        {userChoices.length > 0 && (
          <div className="flex items-center gap-4 mb-6 p-4 bg-white rounded-2xl border border-border-subtle">
            <HiOutlineCalendarDays className="w-5 h-5 text-navy-500" />
            <div className="flex items-center gap-4 text-sm">
              <span className="font-semibold text-navy-700">Interview Schedule:</span>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                {userChoices.filter((c) => scheduledMap[c.id]).length} Scheduled
              </span>
              <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                {userChoices.filter((c) => !scheduledMap[c.id]).length} Pending
              </span>
            </div>
          </div>
        )}

        {/* Applicants Who Chose This Position */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <HiOutlineStar className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-bold text-navy-950">
              Applicants Who Chose This Position
              <span className="ml-2 text-sm font-normal text-navy-400">({userChoices.length})</span>
            </h2>
          </div>

          {userChoices.length === 0 ? (
            <p className="text-sm text-navy-400 italic py-4">No applicants chose this position.</p>
          ) : (
            <div className="space-y-3">
              {userChoices.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  preferenceLabel={`Choice #${candidate.preference_order}`}
                  onAllocate={handleAllocate}
                  allocating={allocating}
                  allocatedIds={allocatedIds}
                  scheduled={scheduledMap[candidate.id]}
                />
              ))}
            </div>
          )}
        </section>

        {/* System Suggested Candidates */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <HiOutlineUserPlus className="w-5 h-5 text-gold-600" />
            <h2 className="text-lg font-bold text-navy-950">
              System Suggested Candidates
              <span className="ml-2 text-sm font-normal text-navy-400">({systemSuggestions.length})</span>
            </h2>
          </div>

          {systemSuggestions.length === 0 ? (
            <p className="text-sm text-navy-400 italic py-4">No system suggestions for this position.</p>
          ) : (
            <div className="space-y-3">
              {systemSuggestions.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  preferenceLabel="System Suggested"
                  onAllocate={handleAllocate}
                  allocating={allocating}
                  allocatedIds={allocatedIds}
                  isSystemSuggestion
                  scheduled={scheduledMap[candidate.id]}
                />
              ))}
            </div>
          )}
        </section>

        {/* Allocate Any Applicant */}
        <section className="mt-10 pt-8 border-t border-border-subtle">
            <div className="flex items-center gap-2 mb-4">
              <HiOutlineUserPlus className="w-5 h-5 text-navy-500" />
              <h2 className="text-lg font-bold text-navy-950">Allocate Any Applicant</h2>
            </div>

            {/* Quick Pick — Unallocated Dropdown */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-navy-700 mb-1.5">
                Quick Pick — Unallocated Applicants ({unallocated.length})
              </label>
              <div className="flex gap-2">
                <select
                  value=""
                  onChange={(e) => {
                    const id = parseInt(e.target.value, 10)
                    if (!id) return
                    const applicant = unallocated.find((a) => a.id === id)
                    if (applicant) handleAllocate(applicant.id, applicant.name)
                  }}
                  className="flex-1 px-4 py-3 text-sm text-navy-900 bg-white border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                >
                  <option value="">Select an applicant to allocate...</option>
                  {unallocated.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} — {a.club_name} ({a.application_number || a.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Or Search */}
            <div className="relative flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-border-subtle" />
              <span className="text-xs font-bold text-navy-300 uppercase">or search</span>
              <div className="flex-1 h-px bg-border-subtle" />
            </div>

            <div className="relative mb-4">
              <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by name, email, club, or application number..."
                className="w-full pl-10 pr-4 py-3 text-sm text-navy-900 bg-white border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 placeholder:text-navy-400"
              />
              {searching && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-navy-200 border-t-primary-500 rounded-full animate-spin" />
              )}
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-2">
                {searchResults.map((a) => (
                  <div key={a.id} className={`flex items-center justify-between p-4 bg-white rounded-xl border border-border-subtle ${a.allocated_to ? 'opacity-50' : 'hover:shadow-sm'}`}>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link to={`/admin/applicant/${a.id}`} className="text-sm font-bold text-navy-900 hover:text-primary-600">
                          {a.name}
                        </Link>
                        {a.application_number && (
                          <span className="text-xs font-mono text-navy-400">{a.application_number}</span>
                        )}
                        {a.allocated_to && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 flex items-center gap-1">
                            <HiOutlineExclamationTriangle className="w-3 h-3" />
                            Allocated: {a.allocated_position_title}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-navy-500 mt-0.5">{a.club_name} &middot; {a.email}</p>
                    </div>
                    {!a.allocated_to && (
                      <button
                        onClick={() => handleAllocate(a.id, a.name)}
                        disabled={allocating === a.id}
                        className="flex-shrink-0 ml-4 px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
                      >
                        {allocating === a.id ? 'Allocating...' : 'Allocate'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {searchQuery.length >= 2 && searchResults.length === 0 && !searching && (
              <p className="text-sm text-navy-400 italic py-4">No applicants found for "{searchQuery}"</p>
            )}
          </section>
      </main>

      {/* Schedule Meeting Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowScheduleModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-navy-900">Schedule Meeting</h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-navy-400 hover:text-navy-600">
                <HiOutlineXMark className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleMeeting} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1.5">Candidate</label>
                <select
                  value={scheduleForm.applicantId}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, applicantId: e.target.value })}
                  className="w-full px-4 py-3 text-sm text-navy-900 bg-white border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  required
                >
                  <option value="">Select a candidate...</option>
                  {userChoices.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} — {c.club_name}</option>
                  ))}
                  {systemSuggestions.filter((s) => !userChoices.some((u) => u.id === s.id)).map((c) => (
                    <option key={c.id} value={c.id}>{c.name} — {c.club_name} (Suggested)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1.5">Date</label>
                  <input
                    type="date"
                    value={scheduleForm.date}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                    className="w-full px-4 py-3 text-sm text-navy-900 bg-white border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1.5">Time</label>
                  <input
                    type="time"
                    value={scheduleForm.time}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                    className="w-full px-4 py-3 text-sm text-navy-900 bg-white border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1.5">Meeting Link</label>
                <input
                  type="url"
                  value={scheduleForm.meetLink}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, meetLink: e.target.value })}
                  placeholder="https://meet.google.com/..."
                  className="w-full px-4 py-3 text-sm text-navy-900 bg-white border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 placeholder:text-navy-400"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={scheduling}
                className="w-full py-3 text-sm font-semibold text-white bg-pink-600 rounded-xl hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {scheduling ? 'Sending...' : 'Send Meeting Invite'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

function CandidateCard({ candidate, preferenceLabel, onAllocate, allocating, allocatedIds = [], isSystemSuggestion, scheduled }) {
  const isAllocatedHere = allocatedIds.includes(candidate.id)
  const isAllocatedElsewhere = candidate.allocated_to !== null && !isAllocatedHere

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-5 rounded-2xl border transition-all ${
        isAllocatedElsewhere
          ? 'bg-navy-50/50 border-border-subtle opacity-60'
          : 'bg-white border-border-subtle hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          {candidate.professional_photo && (
            <img
              src={getFileUrl(candidate.professional_photo)}
              alt={candidate.name}
              className="w-12 h-12 rounded-xl object-cover border border-border-subtle flex-shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                to={`/admin/applicant/${candidate.id}`}
                className="text-sm font-bold text-navy-900 hover:text-primary-600 transition-colors"
              >
                {candidate.name}
              </Link>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                isSystemSuggestion ? 'bg-gold-100 text-gold-700' : 'bg-primary-100 text-primary-700'
              }`}>
                {preferenceLabel}
              </span>
              {scheduled ? (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                  <HiOutlineCalendarDays className="w-3 h-3" />
                  {scheduled.date} at {scheduled.time}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                  Not Scheduled
                </span>
              )}
              {isAllocatedElsewhere && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 flex items-center gap-1">
                  <HiOutlineExclamationTriangle className="w-3 h-3" />
                  Allocated to: {candidate.allocated_position_title}
                </span>
              )}
            </div>
            <p className="text-xs text-navy-500 mt-0.5">{candidate.club_name} &middot; {candidate.email}</p>

            {/* Top 5 Strengths */}
            <div className="mt-2 flex flex-wrap gap-1">
              {candidate.top5.map((theme) => (
                <span key={theme} className={`px-2 py-0.5 rounded-full text-xs font-medium ${STRENGTH_COLORS[theme] || 'bg-gray-100 text-gray-700'}`}>
                  {theme}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Allocate Button */}
        {isAllocatedHere && (
          <span className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100 rounded-lg">
            Allocated
          </span>
        )}
        {!isAllocatedElsewhere && !isAllocatedHere && (
          <button
            onClick={() => onAllocate(candidate.id, candidate.name)}
            disabled={allocating === candidate.id}
            className="flex-shrink-0 px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {allocating === candidate.id ? (
              <span className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Allocating
              </span>
            ) : (
              'Allocate'
            )}
          </button>
        )}
      </div>
    </motion.div>
  )
}
