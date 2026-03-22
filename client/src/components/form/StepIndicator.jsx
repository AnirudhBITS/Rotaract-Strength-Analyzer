import { motion } from 'framer-motion'
import { HiCheck } from 'react-icons/hi2'

const steps = [
  { label: 'Personal Info', short: 'Profile', emoji: '👤' },
  { label: 'Strength Assessment', short: 'Assessment', emoji: '🎯' },
  { label: 'Role Preferences', short: 'Roles', emoji: '⭐' },
]

const STEP_COLORS = [
  { active: 'from-sky-500 to-sky-600', ring: 'ring-sky-200', bar: 'from-sky-400 to-primary-400' },
  { active: 'from-primary-500 to-primary-600', ring: 'ring-primary-200', bar: 'from-primary-400 to-gold-400' },
  { active: 'from-gold-500 to-gold-600', ring: 'ring-gold-200', bar: 'from-gold-400 to-accent-400' },
]

export default function StepIndicator({ currentStep }) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-10">
      <div className="flex items-center justify-between">
        {steps.map((step, i) => {
          const stepNum = i + 1
          const isCompleted = currentStep > stepNum
          const isCurrent = currentStep === stepNum
          const colors = STEP_COLORS[i]

          return (
            <div key={step.label} className="flex items-center flex-1 last:flex-initial">
              <div className="flex flex-col items-center">
                <motion.div
                  className={`
                    w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold
                    transition-all duration-300 shadow-sm
                    ${isCompleted ? 'bg-emerald-500 text-white' : ''}
                    ${isCurrent ? `bg-gradient-to-br ${colors.active} text-white ring-4 ${colors.ring}` : ''}
                    ${!isCompleted && !isCurrent ? 'bg-navy-100 text-navy-400' : ''}
                  `}
                  initial={false}
                  animate={isCurrent ? { scale: [1, 1.08, 1] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  {isCompleted ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <HiCheck className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <span>{step.emoji}</span>
                  )}
                </motion.div>
                <span className={`
                  mt-2 text-xs font-bold hidden sm:block
                  ${isCurrent ? 'text-primary-600' : isCompleted ? 'text-emerald-600' : 'text-navy-400'}
                `}>
                  {step.label}
                </span>
                <span className={`
                  mt-2 text-xs font-bold sm:hidden
                  ${isCurrent ? 'text-primary-600' : isCompleted ? 'text-emerald-600' : 'text-navy-400'}
                `}>
                  {step.short}
                </span>
              </div>

              {i < steps.length - 1 && (
                <div className="flex-1 mx-4 h-1 rounded-full overflow-hidden bg-navy-100">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${colors.bar}`}
                    initial={{ width: '0%' }}
                    animate={{ width: currentStep > stepNum ? '100%' : '0%' }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
