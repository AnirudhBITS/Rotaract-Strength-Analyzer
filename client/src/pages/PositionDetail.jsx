import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  HiOutlineArrowLeft, HiOutlineCheckCircle, HiOutlineXMark,
  HiOutlineUserPlus, HiOutlineExclamationTriangle, HiOutlineStar,
} from 'react-icons/hi2'
import { allocationApi } from '../api/client'

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

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) { navigate('/admin/login'); return }
    fetchData()
  }, [positionId])

  async function fetchData() {
    try {
      const { data: res } = await allocationApi.getCandidates(positionId)
      setData(res)
    } catch {
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
    } catch {
      toast.error('Failed to remove allocation')
    }
  }

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    )
  }

  const { position, userChoices, systemSuggestions, currentAllocation } = data

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
          {currentAllocation && (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
              Filled
            </span>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Current Allocation */}
        {currentAllocation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <HiOutlineCheckCircle className="w-6 h-6 text-emerald-600" />
                <div>
                  <h3 className="text-sm font-bold text-emerald-900">Currently Allocated</h3>
                  <p className="text-sm text-emerald-700">
                    This position is assigned. You can deallocate to reassign.
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDeallocate(currentAllocation.applicant_id, 'this candidate')}
                className="px-4 py-2 text-sm font-semibold text-red-600 bg-white border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
              >
                Deallocate
              </button>
            </div>
          </motion.div>
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
                  isCurrentlyAllocated={!!currentAllocation}
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
                  isCurrentlyAllocated={!!currentAllocation}
                  isSystemSuggestion
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

function CandidateCard({ candidate, preferenceLabel, onAllocate, allocating, isCurrentlyAllocated, isSystemSuggestion }) {
  const isAllocatedElsewhere = candidate.allocated_to !== null

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
              src={candidate.professional_photo}
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
        {!isAllocatedElsewhere && !isCurrentlyAllocated && (
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
