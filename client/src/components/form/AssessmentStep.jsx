import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AssessmentStep({ questions, responses, onChange }) {
  const [currentQ, setCurrentQ] = useState(0)
  const question = questions[currentQ]
  const totalQ = questions.length
  const answered = Object.keys(responses).length
  const progress = (answered / totalQ) * 100

  const selectOption = (optionId) => {
    const updated = { ...responses, [question.id]: optionId }
    onChange(updated)

    // Auto-advance after brief delay
    if (currentQ < totalQ - 1) {
      setTimeout(() => setCurrentQ((prev) => prev + 1), 300)
    }
  }

  const goTo = (index) => {
    if (index >= 0 && index < totalQ) setCurrentQ(index)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950">
          Strength Assessment
        </h2>
        <p className="mt-2 text-navy-500">
          Choose the response that resonates most with you. Trust your instinct.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-navy-600">
            Question {currentQ + 1} of {totalQ}
          </span>
          <span className="text-sm font-semibold text-primary-600">
            {answered}/{totalQ} answered
          </span>
        </div>
        <div className="h-2 bg-navy-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-2xl border border-border-subtle shadow-sm p-6 sm:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center text-sm font-bold">
              {currentQ + 1}
            </span>
            <h3 className="text-base sm:text-lg font-semibold text-navy-900 leading-snug">
              {question.question}
            </h3>
          </div>

          <div className="space-y-3">
            {question.options.map((option) => {
              const isSelected = responses[question.id] === option.id
              return (
                <motion.button
                  key={option.id}
                  onClick={() => selectOption(option.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`
                    w-full text-left p-4 rounded-xl border-2 transition-all duration-200
                    ${isSelected
                      ? 'border-primary-500 bg-primary-50 shadow-sm'
                      : 'border-border-subtle bg-white hover:border-navy-200 hover:bg-navy-50/50'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className={`
                      flex-shrink-0 w-6 h-6 mt-0.5 rounded-full border-2 flex items-center justify-center transition-colors
                      ${isSelected ? 'border-primary-500 bg-primary-500' : 'border-navy-300'}
                    `}>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 rounded-full bg-white"
                        />
                      )}
                    </div>
                    <span className={`text-sm leading-relaxed ${isSelected ? 'text-navy-900 font-medium' : 'text-navy-600'}`}>
                      {option.text}
                    </span>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => goTo(currentQ - 1)}
          disabled={currentQ === 0}
          className="px-5 py-2.5 text-sm font-semibold text-navy-600 bg-white border border-border-subtle rounded-xl transition-all duration-200 hover:bg-navy-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <button
          onClick={() => goTo(currentQ + 1)}
          disabled={currentQ === totalQ - 1}
          className="px-5 py-2.5 text-sm font-semibold text-navy-600 bg-white border border-border-subtle rounded-xl transition-all duration-200 hover:bg-navy-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      {/* Question Grid Navigator */}
      <div className="mt-6 p-4 bg-white rounded-2xl border border-border-subtle">
        <p className="text-xs font-medium text-navy-500 mb-3">Quick Navigation</p>
        <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5">
          {questions.map((q, i) => {
            const isAnswered = responses[q.id] !== undefined
            const isCurrent = i === currentQ
            return (
              <button
                key={q.id}
                onClick={() => goTo(i)}
                className={`
                  w-full aspect-square rounded-lg text-xs font-medium transition-all duration-150
                  ${isCurrent ? 'bg-primary-600 text-white ring-2 ring-primary-200' : ''}
                  ${isAnswered && !isCurrent ? 'bg-primary-100 text-primary-700' : ''}
                  ${!isAnswered && !isCurrent ? 'bg-navy-50 text-navy-400 hover:bg-navy-100' : ''}
                `}
              >
                {i + 1}
              </button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
