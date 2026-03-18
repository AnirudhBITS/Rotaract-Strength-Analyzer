import { useLocation, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiOutlineTrophy, HiOutlineSparkles, HiOutlineCheckCircle, HiOutlineArrowLeft } from 'react-icons/hi2'

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

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function ResultPage() {
  const { state } = useLocation()

  if (!state?.analysis) {
    return <Navigate to="/" replace />
  }

  const { analysis, name, selectedPositions } = state
  const maxScore = analysis.ranked[0]?.score || 1

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white border-b border-border-subtle">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-navy-900">
            Rotaract <span className="text-primary-600">EOI</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Success Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
            <HiOutlineCheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950">
            Application Submitted!
          </h1>
          <p className="mt-3 text-lg text-navy-500">
            Thank you, <span className="font-semibold text-navy-700">{name}</span>. Here's your strength profile.
          </p>
        </motion.div>

        {/* Top 5 Strengths */}
        <motion.section
          className="mb-10"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <div className="flex items-center gap-2 mb-6">
            <HiOutlineTrophy className="w-6 h-6 text-gold-600" />
            <h2 className="text-xl font-bold text-navy-950">Your Top 5 Strengths</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {analysis.top5.map((theme, i) => (
              <motion.div
                key={theme}
                custom={i}
                variants={fadeUp}
                className="p-5 bg-white rounded-2xl border border-border-subtle shadow-sm text-center"
              >
                <span className="text-3xl font-extrabold text-primary-600">#{i + 1}</span>
                <p className="mt-2 text-sm font-bold text-navy-900">{theme}</p>
                <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-semibold ${STRENGTH_COLORS[theme] || 'bg-gray-100 text-gray-700'}`}>
                  {analysis.ranked.find((r) => r.theme === theme)?.score} pts
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Full Score Breakdown */}
        <motion.section
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <HiOutlineSparkles className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold text-navy-950">Full Strength Profile</h2>
          </div>
          <div className="bg-white rounded-2xl border border-border-subtle p-6 space-y-3">
            {analysis.ranked.map((entry) => (
              <div key={entry.theme} className="flex items-center gap-4">
                <span className="w-28 sm:w-36 text-sm font-medium text-navy-700 text-right flex-shrink-0">
                  {entry.theme}
                </span>
                <div className="flex-1 h-6 bg-navy-50 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${entry.rank <= 5 ? 'bg-gradient-to-r from-primary-500 to-primary-600' : 'bg-navy-200'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(entry.score / maxScore) * 100}%` }}
                    transition={{ delay: 0.6 + entry.rank * 0.03, duration: 0.5 }}
                  />
                </div>
                <span className="w-10 text-sm font-semibold text-navy-600 text-right flex-shrink-0">
                  {entry.score}
                </span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Recommended Categories */}
        <motion.section
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <h2 className="text-xl font-bold text-navy-950 mb-6">Recommended Role Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {analysis.recommendations.map((rec, i) => (
              <div key={rec.category} className="p-5 bg-gradient-to-br from-gold-50 to-white rounded-2xl border border-gold-200">
                <span className="text-xs font-bold text-gold-600 uppercase tracking-wider">Match #{i + 1}</span>
                <h3 className="mt-2 text-lg font-bold text-navy-900">{rec.category}</h3>
                <div className="mt-3 flex flex-wrap gap-1">
                  {rec.matchedStrengths.map((s) => (
                    <span key={s} className={`px-2 py-0.5 rounded-full text-xs font-medium ${STRENGTH_COLORS[s] || 'bg-gray-100 text-gray-700'}`}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Your Choices */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <h2 className="text-xl font-bold text-navy-950 mb-4">Your Preferred Positions</h2>
          <div className="space-y-2">
            {selectedPositions.map((title, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-border-subtle">
                <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-navy-900">{title}</span>
              </div>
            ))}
          </div>
        </motion.section>

        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-navy-700 bg-white border border-border-subtle rounded-xl shadow-sm hover:bg-navy-50"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  )
}
