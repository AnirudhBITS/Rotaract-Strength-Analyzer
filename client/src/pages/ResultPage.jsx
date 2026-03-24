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

  // Fall back to sessionStorage if location state is lost (e.g. page reload on laptop)
  let resultData = state
  if (!resultData?.analysis) {
    try {
      const saved = sessionStorage.getItem('rsa_result')
      if (saved) resultData = JSON.parse(saved)
    } catch (e) {}
  }

  if (!resultData?.analysis) {
    return <Navigate to="/" replace />
  }

  const { analysis, name, applicationNumber, selectedPositions, recommendedPositions } = resultData
  const maxScore = analysis.ranked[0]?.score || 1

  const handleDownload = async () => {
    // Load banner image as base64
    let bannerData = null
    try {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = '/hero-laptop.png'
      })
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      canvas.getContext('2d').drawImage(img, 0, 0)
      bannerData = canvas.toDataURL('image/png')
    } catch (e) { /* banner optional */ }

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pw = pdf.internal.pageSize.getWidth()
    const ph = pdf.internal.pageSize.getHeight()
    const m = 20
    const cw = pw - m * 2
    let y = 0

    // Colors
    const pink = [231, 30, 109]
    const sky = [66, 184, 233]
    const gold = [255, 200, 41]
    const orange = [249, 115, 22]
    const dark = [30, 30, 48]
    const gray = [100, 100, 120]
    const lightGray = [140, 140, 160]

    const checkPage = (needed = 12) => {
      if (y + needed > ph - 20) {
        // Footer on current page
        addFooterBar()
        pdf.addPage()
        y = 12
        addHeaderBar()
      }
    }

    const addHeaderBar = () => {
      // Gradient-like top bar (4 color blocks)
      const barH = 2.5
      const segW = pw / 4
      pdf.setFillColor(...sky); pdf.rect(0, 0, segW, barH, 'F')
      pdf.setFillColor(...pink); pdf.rect(segW, 0, segW, barH, 'F')
      pdf.setFillColor(...gold); pdf.rect(segW * 2, 0, segW, barH, 'F')
      pdf.setFillColor(...orange); pdf.rect(segW * 3, 0, segW, barH, 'F')
      y = barH + 8
    }

    const addFooterBar = () => {
      const barH = 2.5
      const segW = pw / 4
      pdf.setFillColor(...sky); pdf.rect(0, ph - barH, segW, barH, 'F')
      pdf.setFillColor(...pink); pdf.rect(segW, ph - barH, segW, barH, 'F')
      pdf.setFillColor(...gold); pdf.rect(segW * 2, ph - barH, segW, barH, 'F')
      pdf.setFillColor(...orange); pdf.rect(segW * 3, ph - barH, segW, barH, 'F')
    }

    const addSection = (icon, title) => {
      checkPage(16)
      y += 3
      pdf.setFillColor(...pink)
      pdf.roundedRect(m, y, 6, 6, 1.5, 1.5, 'F')
      pdf.setFontSize(7)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(255, 255, 255)
      pdf.text(icon, m + 3, y + 4.2, { align: 'center' })

      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(...dark)
      pdf.text(title, m + 9, y + 4.5)
      y += 8

      pdf.setDrawColor(230, 230, 240)
      pdf.setLineWidth(0.3)
      pdf.line(m, y, pw - m, y)
      y += 4
    }

    const addItem = (label, value, color) => {
      checkPage(8)
      pdf.setFontSize(9.5)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(...(color || pink))
      pdf.text(label, m + 4, y)

      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...dark)
      const lines = pdf.splitTextToSize(value, cw - 20)
      pdf.text(lines, m + 18, y)
      y += lines.length * 4.5 + 2.5
    }

    // ===== PAGE 1 =====
    addHeaderBar()

    // Banner image
    if (bannerData) {
      const bannerH = (pw * 600) / 1440 // maintain aspect ratio
      pdf.addImage(bannerData, 'PNG', 0, y - 4, pw, bannerH)
      y += bannerH - 2
    }

    // Title block
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...pink)
    pdf.text('District Officials Screening — Acknowledgement', pw / 2, y, { align: 'center' })
    y += 6

    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...dark)
    pdf.text('Let\'s Unite Together  |  Rotary Year 2026-27', pw / 2, y, { align: 'center' })
    y += 10

    // Application number card
    pdf.setFillColor(245, 245, 255)
    pdf.setDrawColor(210, 215, 240)
    pdf.roundedRect(m + 20, y, cw - 40, 24, 4, 4, 'FD')

    pdf.setFontSize(7)
    pdf.setTextColor(...lightGray)
    pdf.setFont('helvetica', 'normal')
    pdf.text('APPLICATION NUMBER', pw / 2, y + 8, { align: 'center' })

    pdf.setFontSize(16)
    pdf.setTextColor(...dark)
    pdf.setFont('helvetica', 'bold')
    pdf.text(applicationNumber || 'N/A', pw / 2, y + 18, { align: 'center' })
    y += 30

    // Applicant info row
    pdf.setFillColor(250, 250, 255)
    pdf.roundedRect(m, y, cw, 14, 3, 3, 'F')

    pdf.setFontSize(10)
    pdf.setTextColor(...dark)
    pdf.setFont('helvetica', 'bold')
    pdf.text(name, m + 5, y + 6)

    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...lightGray)
    pdf.text(dateStr, pw - m - 5, y + 6, { align: 'right' })

    pdf.setFontSize(7.5)
    pdf.text('Applicant', m + 5, y + 11)
    pdf.text('Submitted', pw - m - 5, y + 11, { align: 'right' })
    y += 20

    // Top 5 Strengths
    addSection('5', 'Your Top 5 Strengths')
    analysis.top5.forEach((t, i) => {
      checkPage(8)
      // Rank badge
      pdf.setFillColor(...(i === 0 ? gold : i === 1 ? sky : [230, 230, 240]))
      pdf.roundedRect(m + 4, y - 3.5, 10, 5.5, 1.5, 1.5, 'F')
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(...(i < 2 ? [255, 255, 255] : dark))
      pdf.text(`#${i + 1}`, m + 9, y, { align: 'center' })

      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...dark)
      pdf.text(t, m + 18, y)

      const score = analysis.ranked.find(r => r.theme === t)?.score
      pdf.setFontSize(8)
      pdf.setTextColor(...lightGray)
      pdf.text(`${score} pts`, pw - m, y, { align: 'right' })
      y += 7
    })
    y += 2

    // Recommended Positions
    addSection('R', 'Recommended Positions')
    if (recommendedPositions?.length) {
      recommendedPositions.forEach((p, i) => {
        addItem(`${i + 1}.`, `${p.title}  —  ${p.category}`, sky)
      })
    } else {
      addItem('—', 'N/A', lightGray)
    }

    // Preferred Positions
    addSection('P', 'Your Preferred Positions')
    selectedPositions.forEach((t, i) => {
      addItem(`${i + 1}.`, t, gold)
    })

    // What Next
    addSection('?', 'What Next?')
    addItem('1.', 'Our team will schedule a screening meet with the District core team.', orange)
    addItem('2.', 'You will receive a confirmation on your selection via mail.', orange)

    // Note box
    checkPage(28)
    y += 2
    pdf.setFillColor(255, 252, 245)
    pdf.setDrawColor(240, 224, 176)
    pdf.roundedRect(m, y, cw, 24, 3, 3, 'FD')
    pdf.setFontSize(7.5)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(180, 140, 50)
    pdf.text('PLEASE NOTE', m + 4, y + 5)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(7)
    pdf.setTextColor(...gray)
    const noteText = 'These suggestions are intended to give you an insight into the roles that may align well with your strengths. Selecting a suggested position does not guarantee a confirmed District Official posting. All submissions will undergo a dedicated screening process, and the final decision rests with the District Core Team.'
    const noteLines = pdf.splitTextToSize(noteText, cw - 8)
    pdf.text(noteLines, m + 4, y + 10)
    y += 30

    // Footer
    checkPage(18)
    pdf.setDrawColor(230, 230, 240)
    pdf.setLineWidth(0.3)
    pdf.line(m, y, pw - m, y)
    y += 6
    pdf.setFontSize(7.5)
    pdf.setTextColor(...lightGray)
    pdf.setFont('helvetica', 'normal')
    pdf.text('This is a system-generated acknowledgement from Rotaract 3234 DO Screening.', pw / 2, y, { align: 'center' })
    y += 4
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...dark)
    pdf.text(`Application: ${applicationNumber || ''}  |  Retain for future reference`, pw / 2, y, { align: 'center' })
    y += 6
    pdf.setFontSize(7)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...sky)
    pdf.setTextColor(...sky)
    pdf.text('Made with <3 by Secretarial Team 26-27', pw / 2, y, { align: 'center' })

    addFooterBar()

    pdf.save(`Acknowledgement-${applicationNumber || 'RSA'}.pdf`)
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white border-b border-border-subtle">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-navy-900">
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
          <img src="/hero-laptop.png" alt="Rotaract 3234" className="h-20 sm:h-28 w-auto mx-auto mb-4 rounded-2xl shadow-sm" />
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
