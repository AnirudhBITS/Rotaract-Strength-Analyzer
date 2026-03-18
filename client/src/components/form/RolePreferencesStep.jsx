import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { HiOutlineStar, HiStar, HiOutlineXMark } from 'react-icons/hi2'

export default function RolePreferencesStep({ positions, selected, onChange, recommendations }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

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
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    return result
  }, [positions, activeCategory, searchTerm])

  const togglePosition = (posId) => {
    if (selected.includes(posId)) {
      onChange(selected.filter((id) => id !== posId))
    } else if (selected.length < 3) {
      onChange([...selected, posId])
    }
  }

  const removePosition = (posId) => {
    onChange(selected.filter((id) => id !== posId))
  }

  const selectedPositions = selected.map((id) => positions.find((p) => p.id === id)).filter(Boolean)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
          Choose Your Preferred Roles
        </h2>
        <p className="mt-2 text-navy-500">
          Select exactly <strong>3 district positions</strong> you'd like to be considered for.
        </p>
      </div>

      {/* System Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="mb-8 p-6 bg-gradient-to-br from-gold-50 to-primary-50 rounded-2xl border border-gold-200">
          <div className="flex items-center gap-2 mb-3">
            <HiStar className="w-5 h-5 text-gold-600" />
            <h3 className="text-sm font-bold text-navy-900">Our Recommendations</h3>
          </div>
          <p className="text-sm text-navy-600 mb-4">
            Based on your strength profile, we believe you'd excel in these areas:
          </p>
          <div className="space-y-2">
            {recommendations.map((rec, i) => (
              <div key={rec.category} className="flex items-center gap-3 p-3 bg-white/80 rounded-xl">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-navy-900">{rec.category}</p>
                  <p className="text-xs text-navy-500">
                    Matched strengths: {rec.matchedStrengths.join(', ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-navy-400 italic">
            These are suggestions — the final choice is entirely yours.
          </p>
        </div>
      )}

      {/* Selected Positions */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-navy-900">Your Selections</h3>
          <span className={`text-sm font-semibold ${selected.length === 3 ? 'text-emerald-600' : 'text-navy-400'}`}>
            {selected.length}/3
          </span>
        </div>
        <div className="flex flex-wrap gap-2 min-h-[44px]">
          {selectedPositions.length === 0 && (
            <p className="text-sm text-navy-400 italic py-2">No positions selected yet</p>
          )}
          {selectedPositions.map((pos, i) => (
            <motion.div
              key={pos.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg border border-primary-200"
            >
              <span className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              <span className="text-sm font-medium">{pos.title}</span>
              <button onClick={() => removePosition(pos.id)} className="ml-1 hover:text-red-500">
                <HiOutlineXMark className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="mb-4 space-y-3">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search positions..."
          className="w-full px-4 py-3 text-sm text-navy-900 bg-white border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 placeholder:text-navy-400"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150
                ${activeCategory === cat
                  ? 'bg-navy-900 text-white'
                  : 'bg-navy-50 text-navy-600 hover:bg-navy-100'}
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Position List */}
      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {filtered.map((pos) => {
          const isSelected = selected.includes(pos.id)
          const isDisabled = !isSelected && selected.length >= 3

          return (
            <motion.button
              key={pos.id}
              onClick={() => !isDisabled && togglePosition(pos.id)}
              whileHover={!isDisabled ? { scale: 1.005 } : {}}
              className={`
                w-full text-left p-4 rounded-xl border-2 transition-all duration-200
                ${isSelected ? 'border-primary-500 bg-primary-50' : 'border-border-subtle bg-white'}
                ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:border-navy-200'}
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-navy-900">{pos.title}</p>
                  <p className="text-xs text-navy-500 mt-0.5">{pos.category} &middot; {pos.tier}</p>
                </div>
                {isSelected ? (
                  <HiStar className="w-5 h-5 text-primary-600 flex-shrink-0" />
                ) : (
                  <HiOutlineStar className="w-5 h-5 text-navy-300 flex-shrink-0" />
                )}
              </div>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
