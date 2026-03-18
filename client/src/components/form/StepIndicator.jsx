import { motion } from 'framer-motion'
import { HiCheck } from 'react-icons/hi2'

const steps = [
  { label: 'Personal Info', short: 'Biodata' },
  { label: 'Strength Assessment', short: 'Assessment' },
  { label: 'Role Preferences', short: 'Roles' },
]

export default function StepIndicator({ currentStep }) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-10">
      <div className="flex items-center justify-between">
        {steps.map((step, i) => {
          const stepNum = i + 1
          const isCompleted = currentStep > stepNum
          const isCurrent = currentStep === stepNum
          const isUpcoming = currentStep < stepNum

          return (
            <div key={step.label} className="flex items-center flex-1 last:flex-initial">
              <div className="flex flex-col items-center">
                <motion.div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                    transition-colors duration-300
                    ${isCompleted ? 'bg-primary-600 text-white' : ''}
                    ${isCurrent ? 'bg-primary-600 text-white ring-4 ring-primary-100' : ''}
                    ${isUpcoming ? 'bg-navy-100 text-navy-400' : ''}
                  `}
                  initial={false}
                  animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {isCompleted ? <HiCheck className="w-5 h-5" /> : stepNum}
                </motion.div>
                <span className={`
                  mt-2 text-xs font-medium hidden sm:block
                  ${isCurrent ? 'text-primary-700' : isCompleted ? 'text-navy-600' : 'text-navy-400'}
                `}>
                  {step.label}
                </span>
                <span className={`
                  mt-2 text-xs font-medium sm:hidden
                  ${isCurrent ? 'text-primary-700' : isCompleted ? 'text-navy-600' : 'text-navy-400'}
                `}>
                  {step.short}
                </span>
              </div>

              {i < steps.length - 1 && (
                <div className="flex-1 mx-4 h-0.5 rounded-full overflow-hidden bg-navy-100">
                  <motion.div
                    className="h-full bg-primary-600 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: currentStep > stepNum ? '100%' : '0%' }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
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
