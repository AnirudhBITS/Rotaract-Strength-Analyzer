import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  HiOutlineArrowLeft, HiOutlineEnvelope, HiOutlinePhone,
  HiOutlineMapPin, HiOutlineBriefcase, HiOutlineHeart,
} from 'react-icons/hi2'
import { adminApi, getFileUrl } from '../api/client'

const STATUS_OPTIONS = ['pending', 'reviewed', 'shortlisted', 'selected', 'rejected']

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  reviewed: 'bg-blue-100 text-blue-700 border-blue-200',
  shortlisted: 'bg-purple-100 text-purple-700 border-purple-200',
  selected: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
}

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

export default function ApplicantDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) { navigate('/admin/login'); return }

    async function fetchDetail() {
      try {
        const { data: res } = await adminApi.getApplicant(id)
        setData(res)
        setStatus(res.applicant.status)
        setNotes(res.applicant.admin_notes || '')
      } catch {
        toast.error('Failed to load applicant')
        navigate('/admin')
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [id])

  const handleUpdateStatus = async () => {
    setSaving(true)
    try {
      await adminApi.updateStatus(id, { status, adminNotes: notes })
      toast.success('Status updated')
    } catch {
      toast.error('Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    )
  }

  const { applicant, strengthScores, rolePreferences } = data
  const top5 = strengthScores.filter((s) => s.rank <= 5)
  const maxScore = strengthScores[0]?.score || 1
  const userChoices = rolePreferences.filter((r) => r.type === 'user_choice')
  const systemSuggestions = rolePreferences.filter((r) => r.type === 'system_suggestion')

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-white border-b border-border-subtle sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-sm font-medium text-navy-600 hover:text-navy-900"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[applicant.status]}`}>
            {applicant.status}
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Bio Card */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-border-subtle p-6 shadow-sm"
            >
              {/* Photos */}
              <div className="flex gap-3 mb-6">
                {applicant.professional_photo && (
                  <img src={getFileUrl(applicant.professional_photo)} alt="Professional" className="w-20 h-20 rounded-xl object-cover border-2 border-border-subtle" />
                )}
                {applicant.casual_photo && (
                  <img src={getFileUrl(applicant.casual_photo)} alt="Casual" className="w-20 h-20 rounded-xl object-cover border-2 border-border-subtle" />
                )}
              </div>

              <h2 className="text-xl font-extrabold text-navy-950">{applicant.name}</h2>
              <p className="text-sm text-navy-500 mt-1">{applicant.club_name}</p>
              {applicant.application_number && (
                <p className="mt-2 text-xs font-mono font-semibold text-primary-600 bg-primary-50 inline-block px-2 py-1 rounded-lg">
                  {applicant.application_number}
                </p>
              )}

              <div className="mt-6 space-y-3">
                <InfoRow icon={HiOutlineEnvelope} text={applicant.email} />
                <InfoRow icon={HiOutlinePhone} text={applicant.phone} />
                {applicant.secondary_phone && <InfoRow icon={HiOutlinePhone} text={applicant.secondary_phone} />}
                <InfoRow icon={HiOutlineMapPin} text={applicant.address} />
                <InfoRow icon={HiOutlineBriefcase} text={applicant.profession} />
                <InfoRow icon={HiOutlineHeart} text={`${applicant.blood_group} ${applicant.willing_to_donate ? '(Willing to donate)' : ''}`} />
              </div>

              <div className="mt-6 pt-6 border-t border-border-subtle space-y-3">
                <Detail label="Rotary ID" value={applicant.rotary_id} />
                <Detail label="Age" value={applicant.age} />
                <Detail label="DOB" value={new Date(applicant.date_of_birth).toLocaleDateString()} />
                {applicant.hobbies && <Detail label="Hobbies" value={applicant.hobbies} />}
                {applicant.past_positions && <Detail label="Past Positions" value={applicant.past_positions} />}
              </div>
            </motion.div>

            {/* Status Update */}
            <div className="bg-white rounded-2xl border border-border-subtle p-6 shadow-sm">
              <h3 className="text-sm font-bold text-navy-900 mb-4">Update Status</h3>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 text-sm text-navy-900 bg-white border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 mb-3"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Admin notes..."
                rows={3}
                className="w-full px-4 py-3 text-sm text-navy-900 bg-white border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none mb-3"
              />
              <button
                onClick={handleUpdateStatus}
                disabled={saving}
                className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Right: Strength Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-border-subtle p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-navy-950 mb-4">Top 5 Strengths</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {top5.map((s, i) => (
                  <div key={s.theme} className="text-center p-3 rounded-xl bg-surface">
                    <span className="text-2xl font-extrabold text-primary-600">#{i + 1}</span>
                    <p className="text-xs font-bold text-navy-900 mt-1">{s.theme}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${STRENGTH_COLORS[s.theme] || 'bg-gray-100 text-gray-700'}`}>
                      {s.score} pts
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Full Scores */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-border-subtle p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-navy-950 mb-4">Full Strength Breakdown</h3>
              <div className="space-y-2">
                {strengthScores.map((entry) => (
                  <div key={entry.theme} className="flex items-center gap-3">
                    <span className="w-20 sm:w-28 text-xs font-medium text-navy-600 text-right flex-shrink-0">
                      {entry.theme}
                    </span>
                    <div className="flex-1 h-5 bg-navy-50 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${entry.rank <= 5 ? 'bg-gradient-to-r from-primary-500 to-primary-600' : 'bg-navy-200'}`}
                        style={{ width: `${(entry.score / maxScore) * 100}%` }}
                      />
                    </div>
                    <span className="w-8 text-xs font-semibold text-navy-600 text-right flex-shrink-0">
                      {entry.score}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Role Preferences */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl border border-border-subtle p-6 shadow-sm"
              >
                <h3 className="text-sm font-bold text-navy-900 mb-3">Applicant's Choices</h3>
                <div className="space-y-2">
                  {userChoices.map((r) => (
                    <div key={r.id} className="flex items-center gap-2 p-3 bg-surface rounded-xl">
                      <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {r.preference_order}
                      </span>
                      <div>
                        <span className="text-sm font-medium text-navy-700">{r.position_title}</span>
                        {r.position_category && (
                          <p className="text-xs text-navy-400">{r.position_category}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-gold-50 to-white rounded-2xl border border-gold-200 p-6 shadow-sm"
              >
                <h3 className="text-sm font-bold text-navy-900 mb-3">System Suggestions</h3>
                <div className="space-y-1.5">
                  {systemSuggestions.map((r) => (
                    <div key={r.id} className="flex items-center gap-2 px-3 py-2 bg-white/80 rounded-lg">
                      <span className="w-5 h-5 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                        {r.preference_order}
                      </span>
                      <span className="text-sm font-medium text-navy-800">{r.position_title}</span>
                      {r.position_tier && (
                        <span className="ml-auto text-[10px] font-medium text-navy-400 uppercase flex-shrink-0">{r.position_tier}</span>
                      )}
                    </div>
                  ))}
                  {systemSuggestions.length === 0 && (
                    <p className="text-sm text-navy-400 italic py-2">No suggestions recorded</p>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function InfoRow({ icon: Icon, text }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-navy-400 mt-0.5 flex-shrink-0" />
      <span className="text-sm text-navy-700">{text}</span>
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div>
      <span className="text-xs font-medium text-navy-400">{label}</span>
      <p className="text-sm text-navy-700">{value}</p>
    </div>
  )
}
