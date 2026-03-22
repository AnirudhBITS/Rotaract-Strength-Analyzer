import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineStar, HiStar, HiOutlineXMark, HiOutlineMagnifyingGlass, HiOutlineCheckCircle } from 'react-icons/hi2'

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

const CATEGORY_ICONS = {
  'Executive Leadership': '👑',
  'Administration': '📋',
  'Event Management': '🎪',
  'Group Management': '👥',
  'Operations/Protocol': '⚙️',
  'Service Avenues': '🤝',
  'Specialized': '🎯',
  'Communications & Media': '📣',
}

const SLOT_COLORS = [
  { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-700', dot: 'bg-sky-500', ring: 'ring-sky-200' },
  { bg: 'bg-primary-50', border: 'border-primary-400', text: 'text-primary-700', dot: 'bg-primary-500', ring: 'ring-primary-200' },
  { bg: 'bg-gold-50', border: 'border-gold-400', text: 'text-gold-700', dot: 'bg-gold-500', ring: 'ring-gold-200' },
]

const SELECTION_MESSAGES = [
  '',
  '1 down, 2 to go!',
  'Almost there! Pick your final choice.',
  'All 3 selected — you\'re ready to submit!',
]

export default function RolePreferencesStep({ positions, selected, onChange, recommendations, analysis }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [lastAction, setLastAction] = useState(null)

  const categories = useMemo(() => {
    const cats = [...new Set(positions.map((p) => p.category))]
    return ['All', ...cats]
  }, [positions])

  const filtered = useMemo(() => {
    let result = positions
    if (activeCategory !== 'All') {
      result = result.filter((p) => p.category === activeCategory)
    }
    if (searchTerm) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    return result
  }, [positions, activeCategory, searchTerm])

  const togglePosition = (posId) => {
    if (selected.includes(posId)) {
      onChange(selected.filter((id) => id !== posId))
      setLastAction('removed')
    } else if (selected.length < 3) {
      onChange([...selected, posId])
      setLastAction('added')
    }
  }

  const removePosition = (posId) => {
    onChange(selected.filter((id) => id !== posId))
    setLastAction('removed')
  }

  const selectedPositions = selected.map((id) => positions.find((p) => p.id === id)).filter(Boolean)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Analysis Results */}
      {analysis && (
        <>
          {/* Top 5 Strengths */}
          <div className="mb-6">
            <div className="text-center mb-4">
              <span className="text-3xl">🏅</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-navy-950 mt-2">
                Your Strength Profile
              </h2>
              <p className="mt-1 text-sm text-navy-500">
                Based on your answers, here are your <strong>top 5 strengths</strong>:
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mb-2">
              {analysis.top5.map((theme, i) => (
                <motion.div
                  key={theme}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`px-4 py-2 rounded-xl text-sm font-bold ${STRENGTH_COLORS[theme] || 'bg-gray-100 text-gray-700'} flex items-center gap-2`}
                >
                  <span className="text-xs font-extrabold opacity-60">#{i + 1}</span>
                  {theme}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Top 3 Categories */}
          {analysis.topCategories && analysis.topCategories.length > 0 && (
            <div className="mb-8">
              <div className="text-center mb-4">
                <p className="text-sm text-navy-500">
                  Based on these strengths, we suggest you explore roles in:
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {analysis.topCategories.map((cat, i) => (
                  <motion.div
                    key={cat.category}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.12 }}
                    className="p-4 bg-white rounded-2xl border border-border-subtle text-center hover:shadow-sm transition-shadow"
                  >
                    <span className="text-2xl">{CATEGORY_ICONS[cat.category] || '📌'}</span>
                    <h3 className="text-sm font-bold text-navy-900 mt-2">{cat.category}</h3>
                    <div className="mt-2 flex flex-wrap justify-center gap-1">
                      {cat.matchedStrengths.map((s) => (
                        <span key={s} className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${STRENGTH_COLORS[s] || 'bg-gray-100 text-gray-700'}`}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="relative flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border-subtle" />
            <span className="text-xs font-bold text-navy-300 uppercase">Now choose your roles</span>
            <div className="flex-1 h-px bg-border-subtle" />
          </div>
        </>
      )}

      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-navy-950">
          Choose Your Preferred Roles
        </h2>
        <p className="mt-1.5 text-navy-500 text-sm">
          Select exactly <strong>3 district positions</strong> you'd like to be considered for.
        </p>
      </div>

      {/* Selection Slots — visual 3-slot picker */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-navy-900">Your Picks</h3>
          <AnimatePresence mode="wait">
            <motion.span
              key={selected.length}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className={`text-xs font-bold ${selected.length === 3 ? 'text-emerald-600' : 'text-navy-400'}`}
            >
              {SELECTION_MESSAGES[selected.length]}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[0, 1, 2].map((slot) => {
            const pos = selectedPositions[slot]
            const colors = SLOT_COLORS[slot]

            return (
              <motion.div
                key={slot}
                layout
                className={`
                  relative p-4 rounded-2xl border-2 border-dashed transition-all duration-300 min-h-[100px] flex flex-col justify-center
                  ${pos ? `${colors.bg} ${colors.border} border-solid` : 'border-border-subtle bg-navy-50/50'}
                `}
              >
                {pos ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                  >
                    <div className={`w-7 h-7 rounded-full ${colors.dot} text-white flex items-center justify-center text-xs font-bold mx-auto mb-2 shadow-sm`}>
                      {slot + 1}
                    </div>
                    <p className={`text-xs font-bold ${colors.text} leading-tight`}>{pos.title}</p>
                    <p className="text-[10px] text-navy-400 mt-1">{pos.tier}</p>
                    <button
                      onClick={() => removePosition(pos.id)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-red-50 transition-colors shadow-sm"
                    >
                      <HiOutlineXMark className="w-3 h-3 text-red-400" />
                    </button>
                  </motion.div>
                ) : (
                  <div className="text-center">
                    <div className="w-7 h-7 rounded-full bg-navy-100 flex items-center justify-center text-xs font-bold text-navy-300 mx-auto mb-2">
                      {slot + 1}
                    </div>
                    <p className="text-[10px] font-medium text-navy-300">Pick #{slot + 1}</p>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* All 3 selected celebration */}
        <AnimatePresence>
          {selected.length === 3 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2"
            >
              <HiOutlineCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <p className="text-xs font-semibold text-emerald-700">
                All 3 positions selected! Scroll down and click Submit Application when ready.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* System Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6 overflow-hidden rounded-2xl border border-gold-200"
        >
          <div className="h-1 bg-gradient-to-r from-sky-400 via-primary-500 to-gold-400" />
          <div className="p-5 bg-gradient-to-br from-gold-50/80 to-primary-50/30">
            <div className="flex items-center gap-2 mb-3">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
              >
                <HiStar className="w-5 h-5 text-gold-500" />
              </motion.div>
              <h3 className="text-sm font-bold text-navy-900">Our Recommendations</h3>
            </div>
            <p className="text-xs text-navy-500 mb-4">
              Based on your strengths, we believe you'd excel in these positions. Tap to select:
            </p>
            <div className="space-y-2">
              {recommendations.map((pos, i) => {
                const isSelected = selected.includes(pos.id)
                const isDisabled = !isSelected && selected.length >= 3
                const colors = SLOT_COLORS[i] || SLOT_COLORS[0]

                return (
                  <motion.button
                    key={pos.id}
                    onClick={() => !isDisabled && togglePosition(pos.id)}
                    whileHover={!isDisabled ? { scale: 1.01, x: 4 } : {}}
                    whileTap={!isDisabled ? { scale: 0.98 } : {}}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`
                      w-full text-left flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200
                      ${isSelected
                        ? `${colors.bg} border-2 ${colors.border} shadow-sm`
                        : isDisabled
                          ? 'bg-white/60 opacity-40 cursor-not-allowed border-2 border-transparent'
                          : 'bg-white/80 hover:bg-white cursor-pointer border-2 border-transparent hover:border-gold-200'}
                    `}
                  >
                    <span className={`flex-shrink-0 w-8 h-8 rounded-xl ${isSelected ? colors.dot + ' text-white' : 'bg-gold-100 text-gold-700'} flex items-center justify-center text-xs font-bold shadow-sm`}>
                      {isSelected ? '✓' : i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-navy-900 truncate">{pos.title}</p>
                      <p className="text-[10px] text-navy-400 mt-0.5">
                        {pos.category} · Matched: {pos.matchedStrengths.join(', ')}
                      </p>
                    </div>
                    {isSelected && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <HiStar className="w-5 h-5 text-primary-500 flex-shrink-0" />
                      </motion.div>
                    )}
                  </motion.button>
                )
              })}
            </div>
            <p className="mt-4 text-[10px] text-navy-400 leading-relaxed">
              <strong>Please note:</strong> These suggestions are intended to give you an insight into the roles that may align well with your strengths. Selecting a suggested position does not guarantee a confirmed District Official posting. All submissions will undergo a dedicated screening process, and the final decision rests with the District Core Team.
            </p>
          </div>
        </motion.div>
      )}

      {/* Search & Filter */}
      <div className="mb-4 space-y-3">
        <div className="relative">
          <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search positions..."
            className="w-full pl-10 pr-4 py-3 text-sm text-navy-900 bg-white border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 placeholder:text-navy-400"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              whileTap={{ scale: 0.95 }}
              className={`
                px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200
                ${activeCategory === cat
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm'
                  : 'bg-navy-50 text-navy-500 hover:bg-navy-100'}
              `}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Position List */}
      <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
        <AnimatePresence>
          {filtered.map((pos, i) => {
            const isSelected = selected.includes(pos.id)
            const slotIndex = selected.indexOf(pos.id)
            const isDisabled = !isSelected && selected.length >= 3
            const colors = slotIndex >= 0 ? SLOT_COLORS[slotIndex] : null

            return (
              <motion.button
                key={pos.id}
                layout
                onClick={() => !isDisabled && togglePosition(pos.id)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.3) }}
                whileHover={!isDisabled ? { scale: 1.005, x: 3 } : {}}
                whileTap={!isDisabled ? { scale: 0.995 } : {}}
                className={`
                  w-full text-left p-4 rounded-xl border-2 transition-all duration-200 relative
                  ${isSelected ? `${colors?.bg || 'bg-primary-50'} ${colors?.border || 'border-primary-500'} shadow-sm` : 'border-border-subtle bg-white'}
                  ${isDisabled ? 'opacity-35 cursor-not-allowed' : 'cursor-pointer hover:border-navy-200'}
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`flex-shrink-0 w-6 h-6 rounded-full ${colors?.dot || 'bg-primary-500'} text-white flex items-center justify-center text-[10px] font-bold shadow-sm`}
                      >
                        {slotIndex + 1}
                      </motion.span>
                    )}
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold truncate ${isSelected ? (colors?.text || 'text-primary-700') : 'text-navy-900'}`}>
                        {pos.title}
                      </p>
                      <p className="text-xs text-navy-400 mt-0.5">{pos.category} · {pos.tier}</p>
                    </div>
                  </div>
                  {isSelected ? (
                    <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}>
                      <HiStar className="w-5 h-5 text-primary-500 flex-shrink-0" />
                    </motion.div>
                  ) : !isDisabled ? (
                    <HiOutlineStar className="w-5 h-5 text-navy-200 flex-shrink-0" />
                  ) : null}
                </div>
              </motion.button>
            )
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-navy-400">No positions found. Try a different search.</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
