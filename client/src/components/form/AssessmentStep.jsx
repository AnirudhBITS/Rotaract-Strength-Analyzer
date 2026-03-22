import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Motivational messages shown randomly after answering
const ENCOURAGEMENTS = [
  'Great pick!', 'Nice instinct!', 'You got this!', 'Keep going!',
  'Awesome!', 'Good choice!', 'On fire!', 'Fantastic!', 'Well done!',
  'You\'re crushing it!', 'Brilliant!', 'Strong choice!', 'Love it!',
]

// Milestone celebrations
const MILESTONES = {
  5: {
    emoji: '🎯',
    title: '25% Complete!',
    subtitle: 'Great start! You\'re getting into the flow.',
    color: 'from-sky-400 to-sky-500',
  },
  10: {
    emoji: '🔥',
    title: 'Halfway There!',
    subtitle: 'You\'re doing amazing. Keep the momentum going!',
    color: 'from-primary-400 to-primary-500',
  },
  15: {
    emoji: '⚡',
    title: '75% Done!',
    subtitle: 'Almost there! Just 5 more questions to go.',
    color: 'from-gold-400 to-gold-500',
  },
  20: {
    emoji: '🏆',
    title: 'All Done!',
    subtitle: 'You\'ve completed the assessment! Click Continue to see your results.',
    color: 'from-accent-400 to-accent-500',
  },
}

// Fun facts shown between milestones
const FUN_FACTS = [
  'Rotaract has members in over 180 countries worldwide.',
  'The word "Rotaract" combines "Rotary" and "Action".',
  'Rotaract was founded in 1968 in Charlotte, North Carolina.',
  'There are over 250,000 Rotaractors globally.',
]

const OPTION_LABELS = ['A', 'B', 'C', 'D']
const OPTION_COLORS = [
  { bg: 'bg-sky-50', border: 'border-sky-200', activeBg: 'bg-sky-100', activeBorder: 'border-sky-500', text: 'text-sky-700', dot: 'bg-sky-500' },
  { bg: 'bg-primary-50', border: 'border-primary-200', activeBg: 'bg-primary-100', activeBorder: 'border-primary-500', text: 'text-primary-700', dot: 'bg-primary-500' },
  { bg: 'bg-gold-50', border: 'border-gold-200', activeBg: 'bg-gold-100', activeBorder: 'border-gold-500', text: 'text-gold-700', dot: 'bg-gold-500' },
  { bg: 'bg-accent-50', border: 'border-accent-200', activeBg: 'bg-accent-100', activeBorder: 'border-accent-500', text: 'text-accent-700', dot: 'bg-accent-500' },
]

// Confetti particle component
function ConfettiParticle({ delay, color }) {
  const x = Math.random() * 100
  const rotation = Math.random() * 360
  const size = 6 + Math.random() * 8

  return (
    <motion.div
      className="absolute rounded-sm"
      style={{
        left: `${x}%`,
        top: '-10px',
        width: size,
        height: size * 0.6,
        backgroundColor: color,
        transform: `rotate(${rotation}deg)`,
      }}
      initial={{ y: 0, opacity: 1, rotate: rotation }}
      animate={{
        y: [0, 300 + Math.random() * 200],
        opacity: [1, 1, 0],
        rotate: rotation + 360 + Math.random() * 360,
        x: [-20 + Math.random() * 40, -40 + Math.random() * 80],
      }}
      transition={{
        duration: 1.5 + Math.random(),
        delay: delay,
        ease: 'easeOut',
      }}
    />
  )
}

function Confetti() {
  const colors = ['#42b8e9', '#e71e6d', '#ffc829', '#f97316', '#9c27b0', '#4caf50']
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    delay: Math.random() * 0.5,
    color: colors[i % colors.length],
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
      {particles.map((p) => (
        <ConfettiParticle key={p.id} delay={p.delay} color={p.color} />
      ))}
    </div>
  )
}

// Streak flame component
function StreakFlame({ streak }) {
  if (streak < 3) return null
  return (
    <motion.div
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      className="flex items-center gap-1.5 px-3 py-1 bg-accent-50 border border-accent-200 rounded-full"
    >
      <motion.span
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 0.6 }}
        className="text-sm"
      >
        🔥
      </motion.span>
      <span className="text-xs font-bold text-accent-600">{streak} streak!</span>
    </motion.div>
  )
}

export default function AssessmentStep({ questions, responses, onChange }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [direction, setDirection] = useState(1)
  const [encouragement, setEncouragement] = useState(null)
  const [milestone, setMilestone] = useState(null)
  const [streak, setStreak] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [funFact, setFunFact] = useState(null)

  const question = questions[currentQ]
  const totalQ = questions.length
  const answered = Object.keys(responses).length
  const progress = (answered / totalQ) * 100

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (milestone) return // Don't navigate during milestone
      if (e.key === 'ArrowLeft' && currentQ > 0) {
        setDirection(-1)
        setCurrentQ((p) => p - 1)
      }
      if (e.key === 'ArrowRight' && currentQ < totalQ - 1) {
        setDirection(1)
        setCurrentQ((p) => p + 1)
      }
      // 1-4 keys to select options
      const num = parseInt(e.key)
      if (num >= 1 && num <= 4 && question?.options[num - 1]) {
        selectOption(question.options[num - 1].id)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [currentQ, totalQ, milestone, question])

  const selectOption = useCallback((optionId) => {
    const wasAlreadyAnswered = responses[question.id] !== undefined
    const updated = { ...responses, [question.id]: optionId }
    onChange(updated)

    const newAnswered = Object.keys(updated).length

    // Show encouragement
    if (!wasAlreadyAnswered) {
      const msg = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]
      setEncouragement(msg)
      setTimeout(() => setEncouragement(null), 1200)

      // Update streak
      setStreak((s) => s + 1)
    }

    // Check milestones
    if (MILESTONES[newAnswered] && !wasAlreadyAnswered) {
      setTimeout(() => {
        setMilestone(MILESTONES[newAnswered])
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 2500)
      }, 400)
      return // Don't auto-advance during milestone
    }

    // Show fun fact occasionally (at questions 3, 8, 13)
    if ([3, 8, 13].includes(newAnswered) && !wasAlreadyAnswered) {
      const fact = FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)]
      setFunFact(fact)
      setTimeout(() => {
        setFunFact(null)
        // Then advance
        if (currentQ < totalQ - 1) {
          setDirection(1)
          setCurrentQ((prev) => prev + 1)
        }
      }, 2200)
      return
    }

    // Auto-advance
    if (currentQ < totalQ - 1) {
      setTimeout(() => {
        setDirection(1)
        setCurrentQ((prev) => prev + 1)
      }, 400)
    }
  }, [responses, question, currentQ, totalQ, onChange])

  const dismissMilestone = () => {
    setMilestone(null)
    // Advance to next question if not at end
    if (currentQ < totalQ - 1 && answered < totalQ) {
      setDirection(1)
      setCurrentQ((prev) => prev + 1)
    }
  }

  const goTo = (index) => {
    if (index >= 0 && index < totalQ) {
      setDirection(index > currentQ ? 1 : -1)
      setCurrentQ(index)
    }
  }

  // Progress bar segment colors
  const getSegmentColor = () => {
    if (progress < 25) return 'from-sky-400 to-sky-500'
    if (progress < 50) return 'from-sky-400 via-primary-500 to-primary-500'
    if (progress < 75) return 'from-sky-400 via-primary-500 to-gold-400'
    return 'from-sky-400 via-primary-500 via-gold-400 to-accent-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
          Strength Assessment
        </h2>
        <p className="mt-1.5 text-navy-500 text-sm">
          Choose the response that resonates most. Trust your instinct!
        </p>
      </div>

      {/* Progress Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-navy-700">
              {currentQ + 1} / {totalQ}
            </span>
            <StreakFlame streak={streak} />
          </div>
          <span className="text-sm font-bold text-primary-600">
            {Math.round(progress)}%
          </span>
        </div>

        {/* Multi-color progress bar */}
        <div className="relative h-3 bg-navy-100 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${getSegmentColor()}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          {/* Milestone markers */}
          {[25, 50, 75].map((mark) => (
            <div
              key={mark}
              className="absolute top-0 bottom-0 w-0.5 bg-white/60"
              style={{ left: `${mark}%` }}
            />
          ))}
        </div>

        {/* Milestone labels */}
        <div className="flex justify-between mt-1">
          {['Start', '25%', '50%', '75%', 'Done'].map((label, i) => (
            <span
              key={label}
              className={`text-[10px] font-medium ${
                progress >= i * 25 ? 'text-primary-500' : 'text-navy-300'
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Encouragement Toast */}
      <AnimatePresence>
        {encouragement && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-40 px-4 py-2 bg-navy-900 text-white text-sm font-bold rounded-full shadow-lg"
          >
            {encouragement}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fun Fact Toast */}
      <AnimatePresence>
        {funFact && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-4 p-4 bg-sky-50 border border-sky-200 rounded-2xl"
          >
            <p className="text-xs font-bold text-sky-600 mb-1">💡 Did you know?</p>
            <p className="text-sm text-sky-800">{funFact}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Milestone Celebration Overlay */}
      <AnimatePresence>
        {milestone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/40 backdrop-blur-sm px-6"
            onClick={dismissMilestone}
          >
            {showConfetti && <Confetti />}
            <motion.div
              initial={{ scale: 0.5, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gradient top bar */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${milestone.color}`} />

              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
                className="text-6xl mb-4"
              >
                {milestone.emoji}
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-extrabold text-navy-950"
              >
                {milestone.title}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-2 text-navy-500 text-sm leading-relaxed"
              >
                {milestone.subtitle}
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={dismissMilestone}
                className={`mt-6 px-8 py-3 text-sm font-bold text-white rounded-2xl bg-gradient-to-r ${milestone.color} shadow-lg transition-transform hover:scale-105 active:scale-95`}
              >
                {answered >= totalQ ? 'See Results →' : 'Keep Going →'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question Card */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={question.id}
          custom={direction}
          initial={{ opacity: 0, x: direction * 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -60 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="bg-white rounded-2xl border border-border-subtle shadow-sm overflow-hidden"
        >
          {/* Question theme accent */}
          <div className="h-1 bg-gradient-to-r from-sky-400 via-primary-500 to-gold-400" />

          <div className="p-6 sm:p-8">
            {/* Question header */}
            <div className="flex items-start gap-3 mb-6">
              <motion.span
                key={currentQ}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center text-sm font-bold shadow-sm"
              >
                {currentQ + 1}
              </motion.span>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest mb-1">
                  {question.theme}
                </p>
                <h3 className="text-base sm:text-lg font-semibold text-navy-900 leading-snug">
                  {question.question}
                </h3>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, oi) => {
                const isSelected = responses[question.id] === option.id
                const colors = OPTION_COLORS[oi]

                return (
                  <motion.button
                    key={option.id}
                    onClick={() => selectOption(option.id)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: oi * 0.06 }}
                    whileHover={{ scale: 1.01, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      w-full text-left p-4 rounded-xl border-2 transition-all duration-200 relative
                      ${isSelected
                        ? `${colors.activeBg} ${colors.activeBorder} shadow-sm`
                        : `bg-white ${colors.border} border-opacity-50 hover:${colors.bg} hover:border-opacity-100`
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`
                        flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-200
                        ${isSelected
                          ? `${colors.dot} text-white shadow-sm`
                          : `bg-navy-100 text-navy-400`
                        }
                      `}>
                        {isSelected ? (
                          <motion.svg
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={3}
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </motion.svg>
                        ) : (
                          OPTION_LABELS[oi]
                        )}
                      </div>
                      <span className={`text-sm leading-relaxed ${isSelected ? `${colors.text} font-semibold` : 'text-navy-600'}`}>
                        {option.text}
                      </span>
                    </div>

                    {/* Selection ripple effect */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0.3 }}
                        animate={{ scale: 2.5, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className={`absolute top-1/2 left-8 w-8 h-8 rounded-full ${colors.dot} -translate-y-1/2`}
                      />
                    )}
                  </motion.button>
                )
              })}
            </div>

            {/* Keyboard hint */}
            <p className="mt-5 text-[10px] text-navy-300 text-center hidden sm:block">
              Press <kbd className="px-1.5 py-0.5 bg-navy-50 rounded text-navy-400 font-mono">1</kbd>-<kbd className="px-1.5 py-0.5 bg-navy-50 rounded text-navy-400 font-mono">4</kbd> to select &middot; <kbd className="px-1.5 py-0.5 bg-navy-50 rounded text-navy-400 font-mono">←</kbd> <kbd className="px-1.5 py-0.5 bg-navy-50 rounded text-navy-400 font-mono">→</kbd> to navigate
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-5 flex items-center justify-between">
        <button
          onClick={() => goTo(currentQ - 1)}
          disabled={currentQ === 0}
          className="px-5 py-2.5 text-sm font-semibold text-navy-600 bg-white border border-border-subtle rounded-xl transition-all duration-200 hover:bg-navy-50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        <button
          onClick={() => goTo(currentQ + 1)}
          disabled={currentQ === totalQ - 1}
          className="px-5 py-2.5 text-sm font-semibold text-navy-600 bg-white border border-border-subtle rounded-xl transition-all duration-200 hover:bg-navy-50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>

      {/* Question Grid Navigator */}
      <div className="mt-5 p-4 bg-white rounded-2xl border border-border-subtle">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-navy-500 uppercase tracking-wider">Questions</p>
          <p className="text-xs font-semibold text-primary-500">
            {answered} of {totalQ} answered
          </p>
        </div>
        <div className="grid grid-cols-10 gap-1.5">
          {questions.map((q, i) => {
            const isAnswered = responses[q.id] !== undefined
            const isCurrent = i === currentQ
            return (
              <motion.button
                key={q.id}
                onClick={() => goTo(i)}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className={`
                  w-full aspect-square rounded-lg text-xs font-bold transition-all duration-150
                  ${isCurrent ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white ring-2 ring-primary-200 shadow-sm' : ''}
                  ${isAnswered && !isCurrent ? 'bg-primary-100 text-primary-700' : ''}
                  ${!isAnswered && !isCurrent ? 'bg-navy-50 text-navy-400 hover:bg-navy-100' : ''}
                `}
              >
                {isAnswered && !isCurrent ? '✓' : i + 1}
              </motion.button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
