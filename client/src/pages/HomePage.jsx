import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiOutlineSparkles, HiOutlineUserGroup, HiOutlineChartBar, HiOutlineClipboardDocumentCheck } from 'react-icons/hi2'

const features = [
  {
    icon: HiOutlineClipboardDocumentCheck,
    title: 'Express Your Interest',
    description: 'Share your details and let us know your aspirations for the upcoming Rotary year.',
  },
  {
    icon: HiOutlineSparkles,
    title: 'Discover Your Strengths',
    description: 'Take a 32-question assessment inspired by CliftonStrengths to uncover your top talents.',
  },
  {
    icon: HiOutlineChartBar,
    title: 'Get Matched',
    description: 'Our algorithm maps your strengths to the district roles where you\'ll thrive most.',
  },
  {
    icon: HiOutlineUserGroup,
    title: 'Choose Your Path',
    description: 'Select your preferred postings and see our recommendations — the final choice is yours.',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-primary-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(220,54,38,0.15),transparent)]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-6 py-24 sm:py-32 lg:py-40 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-gold-400 bg-gold-500/10 rounded-full border border-gold-500/20 mb-8">
              Rotary Year 2026–27
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            District Officials
            <br />
            <span className="bg-gradient-to-r from-primary-400 via-primary-300 to-gold-400 bg-clip-text text-transparent">
              Expression of Interest
            </span>
          </motion.h1>

          <motion.p
            className="mt-6 text-lg sm:text-xl text-navy-300 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover your leadership strengths and find the district role where
            you'll make the greatest impact. Your journey to shaping the future
            of Rotaract starts here.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              to="/apply"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-primary-600 rounded-2xl shadow-lg shadow-primary-600/25 transition-all duration-200 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-600/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              Start Application
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-navy-200 bg-white/5 border border-white/10 rounded-2xl transition-all duration-200 hover:bg-white/10 hover:border-white/20"
            >
              How It Works
            </a>
          </motion.div>

          <motion.div
            className="mt-16 flex items-center justify-center gap-8 text-sm text-navy-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              ~15 minutes
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary-400" />
              32 questions
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gold-400" />
              90+ positions
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20 sm:py-28">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-semibold tracking-wider uppercase text-primary-600">
            The Process
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-navy-950">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-navy-500 max-w-xl mx-auto">
            A simple, streamlined process to match your strengths with the right district role.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="relative p-8 bg-white rounded-2xl border border-border-subtle shadow-sm hover:shadow-md transition-shadow duration-300"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div className="absolute top-6 right-6 text-5xl font-extrabold text-navy-100">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary-50 text-primary-600 mb-5">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-navy-500 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-950 text-navy-400 text-sm">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>Rotaract District Strength Analyzer</p>
          <p>Service Above Self</p>
        </div>
      </footer>
    </div>
  )
}
