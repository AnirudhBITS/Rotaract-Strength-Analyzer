import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiOutlineSparkles, HiOutlineUserGroup, HiOutlineChartBar, HiOutlineClipboardDocumentCheck } from 'react-icons/hi2'

const features = [
  {
    icon: HiOutlineClipboardDocumentCheck,
    title: 'Express Your Interest',
    description: 'Share your details and let us know your aspirations for the upcoming Rotary year.',
    accent: 'from-sky-400 to-sky-500',
    iconBg: 'bg-sky-50 text-sky-600',
    border: 'hover:border-sky-200',
  },
  {
    icon: HiOutlineSparkles,
    title: 'Discover Your Strengths',
    description: 'Take a 20-question assessment inspired by CliftonStrengths to uncover your top talents.',
    accent: 'from-primary-400 to-primary-500',
    iconBg: 'bg-primary-50 text-primary-600',
    border: 'hover:border-primary-200',
  },
  {
    icon: HiOutlineChartBar,
    title: 'Get Matched',
    description: 'Our algorithm maps your strengths to the district roles where you\'ll thrive most.',
    accent: 'from-gold-400 to-gold-500',
    iconBg: 'bg-gold-50 text-gold-600',
    border: 'hover:border-gold-200',
  },
  {
    icon: HiOutlineUserGroup,
    title: 'Choose Your Path',
    description: 'Select your preferred postings and see our recommendations — the final choice is yours.',
    accent: 'from-accent-400 to-accent-500',
    iconBg: 'bg-accent-50 text-accent-600',
    border: 'hover:border-accent-200',
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
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Soft gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-primary-50" />

        {/* Decorative shapes inspired by the year theme logo silhouettes */}
        <div className="absolute top-12 left-8 w-56 h-56 rounded-full bg-sky-200/30 blur-3xl" />
        <div className="absolute top-24 left-32 w-44 h-44 rounded-full bg-primary-200/25 blur-3xl" />
        <div className="absolute top-16 right-16 w-48 h-48 rounded-full bg-gold-200/30 blur-3xl" />
        <div className="absolute bottom-12 right-40 w-36 h-36 rounded-full bg-accent-200/20 blur-3xl" />

        {/* Thin top bar with year theme colors */}
        <div className="h-1 bg-gradient-to-r from-sky-400 via-primary-500 via-gold-400 to-accent-500" />

        <div className="relative max-w-5xl mx-auto px-6 py-20 sm:py-28 lg:py-36 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold tracking-widest uppercase text-primary-700 bg-primary-50 rounded-full border border-primary-100 mb-8">
              Rotary Year 2025-26
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-950 tracking-tight leading-[1.08]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            District Officials
            <br />
            <span className="bg-gradient-to-r from-sky-500 via-primary-600 to-gold-500 bg-clip-text text-transparent">
              Expression of Interest
            </span>
          </motion.h1>

          <motion.p
            className="mt-6 text-lg sm:text-xl text-navy-500 max-w-2xl mx-auto leading-relaxed font-medium"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            Discover your leadership strengths and find the district role where
            you'll make the greatest impact. Your journey to shaping the future
            of Rotaract starts here.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
          >
            <Link
              to="/apply"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl shadow-lg shadow-primary-300/40 transition-all duration-200 hover:shadow-xl hover:shadow-primary-400/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              Start Application
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-navy-700 bg-white border border-border-subtle rounded-2xl shadow-sm transition-all duration-200 hover:bg-navy-50 hover:border-navy-200"
            >
              How It Works
            </a>
          </motion.div>

          <motion.div
            className="mt-14 flex items-center justify-center gap-8 text-sm text-navy-400 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              ~15 minutes
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
              20 questions
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-gold-400" />
              43 positions
            </div>
          </motion.div>
        </div>
      </section>

      {/* Year Theme Banner */}
      <section className="bg-navy-950">
        <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <p className="text-sm font-semibold tracking-wide text-white/90">
            Let's <span className="text-primary-400 font-extrabold">Unite</span> Together
          </p>
          <div className="hidden sm:block w-px h-5 bg-white/20" />
          <p className="text-xs text-white/50 font-medium tracking-wider uppercase">
            Rotaract District 3234 &middot; 2025-26
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-20 sm:py-28">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sm font-bold tracking-widest uppercase text-primary-500">
              The Process
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-navy-950">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-navy-500 max-w-xl mx-auto font-medium">
              A simple, streamlined process to match your strengths with the right district role.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className={`relative p-8 bg-white rounded-2xl border border-border-subtle shadow-sm hover:shadow-lg transition-all duration-300 ${feature.border}`}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                {/* Top accent bar */}
                <div className={`absolute top-0 left-6 right-6 h-1 rounded-b-full bg-gradient-to-r ${feature.accent}`} />

                <div className="absolute top-6 right-6 text-5xl font-extrabold text-navy-100/50">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${feature.iconBg} mb-5`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-navy-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-950">
        <div className="h-1 bg-gradient-to-r from-sky-400 via-primary-500 via-gold-400 to-accent-500" />
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/60 font-medium">Rotaract District Strength Analyzer</p>
          <p className="text-sm text-white/40">
            Let's <span className="text-primary-400 font-bold">Unite</span> Together &middot; 2025-26
          </p>
        </div>
      </footer>
    </div>
  )
}
