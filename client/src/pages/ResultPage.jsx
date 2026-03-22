import { useLocation, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { jsPDF } from 'jspdf'
import { HiOutlineTrophy, HiOutlineSparkles, HiOutlineCheckCircle, HiOutlineArrowLeft, HiOutlineArrowDownTray } from 'react-icons/hi2'

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

  const { analysis, name, applicationNumber, selectedPositions, recommendedPositions } = state
  const maxScore = analysis.ranked[0]?.score || 1

  const handleDownload = () => {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const margin = 20
    const contentWidth = pageWidth - margin * 2
    let y = 20

    const checkPage = (needed = 10) => {
      if (y + needed > pdf.internal.pageSize.getHeight() - 15) {
        pdf.addPage()
        y = 20
      }
    }

    // Title
    pdf.setFontSize(18)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Rotaract 3234 DO Screening', pageWidth / 2, y, { align: 'center' })
    y += 7

    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(100)
    pdf.text('District Officials Recruitment — Expression of Interest Acknowledgement', pageWidth / 2, y, { align: 'center' })
    y += 12

    // Application number box
    pdf.setDrawColor(200, 210, 240)
    pdf.setFillColor(240, 244, 255)
    const boxW = 70
    const boxX = (pageWidth - boxW) / 2
    pdf.roundedRect(boxX, y, boxW, 20, 3, 3, 'FD')

    pdf.setFontSize(7)
    pdf.setTextColor(120)
    pdf.setFont('helvetica', 'normal')
    pdf.text('APPLICATION NUMBER', pageWidth / 2, y + 7, { align: 'center' })

    pdf.setFontSize(14)
    pdf.setTextColor(26, 26, 46)
    pdf.setFont('helvetica', 'bold')
    pdf.text(applicationNumber || 'N/A', pageWidth / 2, y + 15, { align: 'center' })
    y += 28

    // Applicant name
    pdf.setFontSize(11)
    pdf.setTextColor(50)
    pdf.setFont('helvetica', 'normal')
    pdf.text('Applicant: ', pageWidth / 2 - pdf.getTextWidth('Applicant: ' + name) / 2, y)
    pdf.setFont('helvetica', 'bold')
    pdf.text(name, pageWidth / 2 - pdf.getTextWidth('Applicant: ' + name) / 2 + pdf.getTextWidth('Applicant: '), y)
    y += 6

    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(140)
    pdf.text(`Submitted on ${dateStr}`, pageWidth / 2, y, { align: 'center' })
    y += 12

    // Section helper
    const addSectionTitle = (title) => {
      checkPage(15)
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(26, 26, 46)
      pdf.text(title, margin, y)
      y += 1
      pdf.setDrawColor(220)
      pdf.setLineWidth(0.5)
      pdf.line(margin, y, pageWidth - margin, y)
      y += 6
    }

    const addBullet = (text) => {
      checkPage(8)
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(60)
      const lines = pdf.splitTextToSize(text, contentWidth - 8)
      pdf.text('•', margin + 2, y)
      pdf.text(lines, margin + 8, y)
      y += lines.length * 5 + 2
    }

    // Top 5 Strengths
    addSectionTitle('Top 5 Strengths')
    analysis.top5.forEach((t, i) => {
      const score = analysis.ranked.find(r => r.theme === t)?.score
      addBullet(`#${i + 1}  ${t}  (${score} pts)`)
    })
    y += 4

    // Recommended Positions
    addSectionTitle('Recommended Positions')
    if (recommendedPositions?.length) {
      recommendedPositions.forEach((p, i) => {
        addBullet(`Match #${i + 1}:  ${p.title}  —  ${p.category}`)
      })
    } else {
      addBullet('N/A')
    }
    y += 2

    // Note
    checkPage(25)
    pdf.setFillColor(255, 251, 240)
    pdf.setDrawColor(240, 224, 176)
    pdf.roundedRect(margin, y, contentWidth, 22, 2, 2, 'FD')
    pdf.setFontSize(7.5)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(80)
    pdf.text('Please note:', margin + 4, y + 5)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(100)
    const noteText = 'These suggestions are intended to give you an insight into the roles that may align well with your strengths. Selecting a suggested position does not guarantee a confirmed District Official posting. All submissions will undergo a dedicated screening process, and the final decision rests with the District Core Team.'
    const noteLines = pdf.splitTextToSize(noteText, contentWidth - 8)
    pdf.text(noteLines, margin + 4, y + 10)
    y += 28

    // Your Preferred Positions
    addSectionTitle('Your Preferred Positions')
    selectedPositions.forEach((t, i) => {
      addBullet(`${i + 1}.  ${t}`)
    })
    y += 8

    // Footer
    checkPage(15)
    pdf.setDrawColor(220)
    pdf.setLineWidth(0.3)
    pdf.line(margin, y, pageWidth - margin, y)
    y += 6
    pdf.setFontSize(8)
    pdf.setTextColor(160)
    pdf.setFont('helvetica', 'normal')
    pdf.text('This is a system-generated acknowledgement from the Rotaract 3234 DO Screening.', pageWidth / 2, y, { align: 'center' })
    y += 5
    pdf.text(`Please retain your Application Number ${applicationNumber || ''} for future reference.`, pageWidth / 2, y, { align: 'center' })

    pdf.save(`Acknowledgement-${applicationNumber || 'RSA'}.pdf`)
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white border-b border-border-subtle">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold text-navy-900">
            <img src="/year-theme-logo.png" alt="Year Theme" className="h-8 w-auto" />
            Rotaract<span className="text-primary-600">3234</span>
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
          <img src="/year-theme-logo.png" alt="Rotaract 3234" className="h-16 sm:h-20 w-auto mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950">
            Application Submitted!
          </h1>
          <p className="mt-3 text-lg text-navy-500">
            Thank you, <span className="font-semibold text-navy-700">{name}</span>. Here's your strength profile.
          </p>
          {applicationNumber && (
            <div className="mt-4 inline-block px-5 py-3 bg-navy-50 rounded-xl border border-navy-200">
              <p className="text-xs font-medium text-navy-500 uppercase tracking-wider">Application Number</p>
              <p className="text-xl font-extrabold text-navy-900 tracking-wide mt-0.5">{applicationNumber}</p>
              <p className="text-xs text-navy-400 mt-1">Please note this down for future follow-ups.</p>
            </div>
          )}
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
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
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
                <span className="w-20 sm:w-36 text-xs sm:text-sm font-medium text-navy-700 text-right flex-shrink-0">
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

        {/* Recommended Positions */}
        {recommendedPositions && recommendedPositions.length > 0 && (
          <motion.section
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <h2 className="text-xl font-bold text-navy-950 mb-6">Recommended Positions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recommendedPositions.map((pos, i) => (
                <div key={pos.id} className="p-5 bg-gradient-to-br from-gold-50 to-white rounded-2xl border border-gold-200">
                  <span className="text-xs font-bold text-gold-600 uppercase tracking-wider">Match #{i + 1}</span>
                  <h3 className="mt-2 text-lg font-bold text-navy-900">{pos.title}</h3>
                  <p className="mt-1 text-xs text-navy-500">{pos.category}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {pos.matchedStrengths.map((s) => (
                      <span key={s} className={`px-2 py-0.5 rounded-full text-xs font-medium ${STRENGTH_COLORS[s] || 'bg-gray-100 text-gray-700'}`}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-navy-500 leading-relaxed">
              <strong>Please note:</strong> These suggestions are intended to give you an insight into the roles that may align well with your strengths. Selecting a suggested position does not guarantee a confirmed District Official posting. All submissions will undergo a dedicated screening process, and the final decision rests with the District Core Team.
            </p>
          </motion.section>
        )}

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

        <div className="flex items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-navy-700 bg-white border border-border-subtle rounded-xl shadow-sm hover:bg-navy-50"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-primary-600 rounded-xl shadow-sm hover:bg-primary-700 transition-colors"
          >
            <HiOutlineArrowDownTray className="w-4 h-4" />
            Download Acknowledgement
          </button>
        </div>
      </main>
    </div>
  )
}
