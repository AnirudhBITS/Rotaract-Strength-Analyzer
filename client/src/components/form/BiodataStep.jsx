import { useState, useCallback, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { HiOutlineCamera, HiOutlineXMark, HiOutlineCheckCircle } from 'react-icons/hi2'
import { uploadApi, getFileUrl, applicationApi } from '../../api/client'
import toast from 'react-hot-toast'

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

const SECTIONS = [
  { id: 'verification', emoji: '🔐', label: 'Verification' },
  { id: 'identity', emoji: '👤', label: 'Identity' },
  { id: 'rotaract', emoji: '🎯', label: 'Rotaract' },
  { id: 'personal', emoji: '📋', label: 'Personal' },
  { id: 'health', emoji: '🩸', label: 'Health' },
  { id: 'details', emoji: '📝', label: 'Details' },
  { id: 'photos', emoji: '📸', label: 'Photos' },
]

const TIPS = {
  verification: 'Let\'s start by verifying your email. We\'ll send a 6-digit code to get you going!',
  identity: 'We\'ll use this to reach you with updates about your application.',
  rotaract: 'This helps us verify your membership and connect with your club.',
  personal: 'Basic details to build your Rotaract profile.',
  health: 'Blood donation saves lives! Let us know if you\'re willing to help.',
  details: 'Share a bit more about yourself — this makes your profile stand out.',
  photos: 'A professional and casual photo helps the team know you better.',
}

const CELEBRATIONS = {
  verification: { emoji: '🔐', title: 'Email Verified!', subtitle: 'Great start! Now let\'s fill in your profile details.' },
  identity: { emoji: '🎉', title: 'Great start!', subtitle: 'Your identity section is complete. Let\'s move on!' },
  rotaract: { emoji: '🏅', title: 'Rotaract details done!', subtitle: 'We can now connect you with your club.' },
  personal: { emoji: '✨', title: 'Halfway there!', subtitle: 'Personal details locked in. Keep going!' },
  health: { emoji: '❤️', title: 'Health info saved!', subtitle: 'Thank you for sharing. Almost done!' },
  details: { emoji: '📝', title: 'Almost there!', subtitle: 'Just your photos left and you\'re good to go.' },
  photos: { emoji: '📸', title: 'Profile Complete!', subtitle: 'You\'re all set. Click Continue to begin the assessment!' },
}

const REQUIRED = {
  verification: [],
  identity: ['name', 'email', 'phone'],
  rotaract: ['clubName', 'rotaryId'],
  personal: ['age', 'dateOfBirth', 'profession'],
  health: ['bloodGroup'],
  details: ['address'],
  photos: [],
}

function PhotoUpload({ label, value, onChange, id }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const { data } = await uploadApi.uploadPhoto(file)
      onChange(data.path)
      toast.success(`${label} uploaded`)
    } catch {
      toast.error('Upload failed. Please try again.')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }, [label, onChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  })

  const clear = (e) => {
    e.stopPropagation()
    setPreview(null)
    onChange('')
  }

  const hasImage = preview || value

  return (
    <div>
      <label className="block text-sm font-semibold text-navy-700 mb-1.5">{label}</label>
      <div
        {...getRootProps()}
        className={`
          relative flex flex-col items-center justify-center w-full h-44
          border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300
          ${isDragActive ? 'border-primary-500 bg-primary-50 scale-[1.02]' : hasImage ? 'border-primary-300 bg-primary-50/30' : 'border-border-subtle bg-white hover:border-primary-300 hover:bg-primary-50/20'}
          ${uploading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input {...getInputProps()} id={id} />
        {hasImage ? (
          <div className="relative">
            <img src={preview || getFileUrl(value)} alt={label} className="w-28 h-28 object-cover rounded-2xl shadow-sm" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
              <HiOutlineCheckCircle className="w-4 h-4 text-white" />
            </div>
            <button onClick={clear} className="absolute -bottom-2 -right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors">
              <HiOutlineXMark className="w-3.5 h-3.5 text-red-500" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-navy-400">
            <div className="w-14 h-14 rounded-2xl bg-navy-50 flex items-center justify-center mb-3">
              <HiOutlineCamera className="w-7 h-7" />
            </div>
            <span className="text-sm font-semibold">
              {uploading ? 'Uploading...' : isDragActive ? 'Drop it here!' : 'Drop or tap to upload'}
            </span>
            <span className="text-xs mt-1 text-navy-300">JPG, PNG, WebP (max 5MB)</span>
          </div>
        )}
      </div>
    </div>
  )
}

function ClubSelect({ clubs, value, onChange, error }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const filtered = query
    ? clubs.filter((c) => c.toLowerCase().includes(query.toLowerCase()))
    : clubs

  return (
    <div className="relative">
      <input
        type="text"
        value={open ? query : value}
        onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
        onFocus={() => { setOpen(true); setQuery(value || '') }}
        placeholder="Search your Rotaract Club..."
        className={`w-full px-4 py-3 text-sm text-navy-900 bg-white border rounded-xl transition-all duration-200 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${error ? 'border-red-400 ring-2 ring-red-100' : 'border-border-subtle'}`}
      />
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setQuery('') }} />
          <div className="absolute z-50 mt-1 w-full max-h-52 overflow-y-auto bg-white border border-border-subtle rounded-xl shadow-lg">
            {filtered.length > 0 ? (
              filtered.map((club) => (
                <button
                  key={club}
                  type="button"
                  onClick={() => { onChange(club); setOpen(false); setQuery('') }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-primary-50 ${value === club ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-navy-700'}`}
                >
                  {club}
                </button>
              ))
            ) : (
              <p className="px-4 py-3 text-sm text-navy-400 italic">No clubs found</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function loadDraft() {
  try { return JSON.parse(sessionStorage.getItem('rsa_biodata_state')) } catch { return null }
}
function saveDraft(s) {
  try { sessionStorage.setItem('rsa_biodata_state', JSON.stringify(s)) } catch {}
}

export default function BiodataStep({ data, onChange, errors, clubs = [], onSectionChange }) {
  const draft = loadDraft()
  const [section, setSection] = useState(draft?.section || 0)
  const [celebration, setCelebration] = useState(null)
  const [celebrated, setCelebrated] = useState(new Set(draft?.celebrated || []))
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(draft?.otpVerified || false)
  const [otpValue, setOtpValue] = useState('')
  const [otpSending, setOtpSending] = useState(false)
  const [otpVerifying, setOtpVerifying] = useState(false)
  const [otpCooldown, setOtpCooldown] = useState(0)

  const current = SECTIONS[section]
  const isLast = section >= SECTIONS.length - 1

  // Notify parent on mount and section change
  useEffect(() => {
    if (onSectionChange) onSectionChange(section, SECTIONS.length)
  }, [section])

  // Persist state
  useEffect(() => {
    saveDraft({ section, otpVerified, celebrated: [...celebrated] })
  }, [section, otpVerified, celebrated])

  const update = (field) => (e) => {
    onChange({ ...data, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
  }

  const goTo = (i) => setSection(i)

  const totalRequired = ['name', 'email', 'phone', 'clubName', 'rotaryId', 'age', 'dateOfBirth', 'profession', 'bloodGroup', 'address']
  const filledRequired = totalRequired.filter((f) => data[f] && String(data[f]).trim())
  const progress = (filledRequired.length / totalRequired.length) * 100

  const isSectionDone = (id) => {
    const req = REQUIRED[id] || []
    if (id === 'verification') return otpVerified
    if (req.length === 0) return true
    return req.every((f) => data[f] && String(data[f]).trim())
  }

  // OTP
  const handleSendOTP = async () => {
    if (!data.email || !data.email.includes('@')) { toast.error('Please enter a valid email address'); return }
    if (otpCooldown > 0) return
    setOtpSending(true)
    try {
      await applicationApi.sendOTP({ email: data.email })
      setOtpSent(true)
      setOtpValue('')
      toast.success(otpSent ? 'New code sent!' : 'Verification code sent!')
      setOtpCooldown(60)
      const t = setInterval(() => setOtpCooldown((p) => { if (p <= 1) { clearInterval(t); return 0 } return p - 1 }), 1000)
    } catch { toast.error('Failed to send code. Please try again.') }
    finally { setOtpSending(false) }
  }

  const handleVerifyOTP = async () => {
    if (otpValue.length !== 6) { toast.error('Please enter the 6-digit code'); return }
    setOtpVerifying(true)
    try {
      await applicationApi.verifyOTP({ email: data.email, otp: otpValue })
      setOtpVerified(true)
      setCelebrated((p) => new Set([...p, 'verification']))
      setCelebration(CELEBRATIONS.verification)
    } catch (err) { toast.error(err.response?.data?.error || 'Verification failed.') }
    finally { setOtpVerifying(false) }
  }

  const handleNext = () => {
    if (current.id === 'verification' && !otpVerified) {
      toast.error('Please verify your email before proceeding')
      return
    }
    const req = REQUIRED[current.id] || []
    const missing = req.filter((f) => !data[f] || !String(data[f]).trim())
    if (missing.length > 0) {
      toast.error('Please fill all required fields in this section')
      return
    }
    if (!celebrated.has(current.id)) {
      setCelebrated((p) => new Set([...p, current.id]))
      setCelebration(CELEBRATIONS[current.id])
      return
    }
    if (!isLast) goTo(section + 1)
  }

  const dismissCelebration = () => {
    setCelebration(null)
  }

  const fc = (field) => `
    w-full px-4 py-3 text-sm text-navy-900 bg-white border rounded-xl transition-all duration-200
    placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
    ${errors[field] ? 'border-red-400 ring-2 ring-red-100' : 'border-border-subtle'}
  `

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950">Personal Information</h2>
        <p className="mt-1.5 text-navy-500 text-sm">Tell us about yourself. This helps build your profile.</p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-navy-700">Profile Completion</span>
          <span className="text-sm font-bold text-primary-600">{Math.round(progress)}%</span>
        </div>
        <div className="h-3 bg-navy-100 rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-sky-400 via-primary-500 to-gold-400" animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1">
        {SECTIONS.map((s, i) => {
          const done = isSectionDone(s.id) && celebrated.has(s.id)
          const active = i === section
          const hasErr = (REQUIRED[s.id] || []).some((f) => errors[f])
          return (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border-2
                ${active ? 'bg-primary-50 border-primary-400 text-primary-700'
                  : hasErr ? 'bg-red-50 border-red-200 text-red-600'
                  : done ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-white border-border-subtle text-navy-500 hover:border-navy-200'}`}
            >
              <span>{s.emoji}</span>
              <span>{s.label}</span>
              {done && !hasErr && <HiOutlineCheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
            </button>
          )
        })}
      </div>

      {/* Celebration Popup */}
      {celebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/40 backdrop-blur-sm px-6" onClick={dismissCelebration}>
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center relative overflow-hidden animate-[scaleIn_0.3s_ease-out]" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-400 via-primary-500 to-gold-400" />
            <div className="text-5xl mb-4">{celebration.emoji}</div>
            <h3 className="text-xl font-extrabold text-navy-950">{celebration.title}</h3>
            <p className="mt-2 text-navy-500 text-sm">{celebration.subtitle}</p>
            <button
              onClick={dismissCelebration}
              className="mt-6 px-8 py-3 text-sm font-bold text-white rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg hover:scale-105 active:scale-95 transition-transform"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Tip */}
      <div className="mb-5 p-3 bg-sky-50 border border-sky-200 rounded-xl flex items-start gap-2">
        <span className="text-sm mt-0.5">💡</span>
        <p className="text-xs text-sky-700 font-medium leading-relaxed">{TIPS[current.id]}</p>
      </div>

      {/* Section Content */}
      <div className="bg-white rounded-2xl border border-border-subtle shadow-sm">
        <div className="h-1 bg-gradient-to-r from-sky-400 via-primary-500 to-gold-400 rounded-t-2xl" />
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">

            {current.id === 'verification' && (
              <div className="sm:col-span-2">
                {otpVerified ? (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                      <HiOutlineCheckCircle className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-extrabold text-emerald-700">Email Verified!</h3>
                    <p className="mt-1 text-sm text-navy-500">{data.email}</p>
                    <p className="mt-4 text-xs text-navy-400">Tap <strong>Next →</strong> to start filling your profile.</p>
                  </div>
                ) : (
                  <div className="py-4">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-primary-50 flex items-center justify-center">
                        <span className="text-3xl">📧</span>
                      </div>
                      <h3 className="text-lg font-bold text-navy-900">Verify Your Email</h3>
                      <p className="mt-1 text-sm text-navy-500">Enter your email and we'll send a 6-digit verification code.</p>
                    </div>
                    <div className="max-w-sm mx-auto mb-5">
                      <label className="block text-sm font-semibold text-navy-700 mb-1.5">Email Address <span className="text-red-400">*</span></label>
                      <input type="email" value={data.email} onChange={update('email')} disabled={otpSent} placeholder="your@email.com"
                        className={`w-full px-4 py-3 text-sm text-navy-900 bg-white border border-border-subtle rounded-xl placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 ${otpSent ? 'bg-navy-50 opacity-70' : ''}`}
                      />
                    </div>
                    {!otpSent ? (
                      <div className="text-center">
                        <button type="button" onClick={handleSendOTP} disabled={otpSending || !data.email}
                          className="px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                          {otpSending ? 'Sending...' : 'Send Verification Code'}
                        </button>
                      </div>
                    ) : (
                      <div className="max-w-xs mx-auto">
                        <label className="block text-sm font-semibold text-navy-700 mb-2 text-center">Enter the 6-digit code</label>
                        <input type="text" inputMode="numeric" maxLength={6} value={otpValue}
                          onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="000000" autoFocus
                          className="w-full text-center text-2xl font-bold tracking-[0.5em] px-4 py-4 border-2 border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 placeholder:text-navy-200 placeholder:tracking-[0.5em] mb-4"
                        />
                        <button type="button" onClick={handleVerifyOTP} disabled={otpVerifying || otpValue.length !== 6}
                          className="w-full py-3 text-sm font-bold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                          {otpVerifying ? 'Verifying...' : 'Verify'}
                        </button>
                        <div className="mt-4 text-center">
                          <button type="button" onClick={handleSendOTP} disabled={otpSending || otpCooldown > 0}
                            className="text-xs font-semibold text-primary-600 hover:text-primary-700 disabled:text-navy-300 disabled:cursor-not-allowed">
                            {otpCooldown > 0 ? `Resend code in ${otpCooldown}s` : 'Resend Code'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {current.id === 'identity' && (
              <>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-navy-700 mb-1.5">Full Name <span className="text-red-400">*</span></label>
                  <input type="text" value={data.name} onChange={update('name')} placeholder="Enter your full name" className={fc('name')} />
                  {errors.name && <p className="mt-1 text-xs text-red-500 font-medium">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1.5">Email Address <span className="text-red-400">*</span></label>
                  <input type="email" value={data.email} onChange={update('email')} placeholder="your@email.com" disabled={otpVerified} className={fc('email') + (otpVerified ? ' bg-navy-50 opacity-70' : '')} />
                  {otpVerified && <p className="mt-1 text-xs text-emerald-600 font-medium flex items-center gap-1"><HiOutlineCheckCircle className="w-3.5 h-3.5" /> Verified</p>}
                  {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1.5">Phone Number <span className="text-red-400">*</span></label>
                  <input type="tel" value={data.phone} onChange={update('phone')} placeholder="+91 9876543210" className={fc('phone')} />
                  {errors.phone && <p className="mt-1 text-xs text-red-500 font-medium">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1.5">Secondary Phone <span className="text-navy-300 text-xs font-normal">(optional)</span></label>
                  <input type="tel" value={data.secondaryPhone} onChange={update('secondaryPhone')} placeholder="Optional" className={fc('secondaryPhone')} />
                </div>
              </>
            )}

            {current.id === 'rotaract' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1.5">Club Name <span className="text-red-400">*</span></label>
                  <ClubSelect
                    clubs={clubs}
                    value={data.clubName}
                    onChange={(val) => onChange({ ...data, clubName: val })}
                    error={errors.clubName}
                  />
                  {errors.clubName && <p className="mt-1 text-xs text-red-500 font-medium">{errors.clubName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1.5">My Rotary ID <span className="text-red-400">*</span></label>
                  <input type="text" value={data.rotaryId} onChange={update('rotaryId')} placeholder="Your Rotary ID" className={fc('rotaryId')} />
                  {errors.rotaryId && <p className="mt-1 text-xs text-red-500 font-medium">{errors.rotaryId}</p>}
                </div>
              </>
            )}

            {current.id === 'personal' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1.5">Age <span className="text-red-400">*</span></label>
                  <input type="number" min="18" max="35" value={data.age} onChange={update('age')} placeholder="18-35" className={fc('age')} />
                  {errors.age && <p className="mt-1 text-xs text-red-500 font-medium">{errors.age}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1.5">Date of Birth <span className="text-red-400">*</span></label>
                  <DatePicker
                    selected={data.dateOfBirth ? new Date(data.dateOfBirth) : null}
                    onChange={(date) => {
                      if (date) {
                        const y = date.getFullYear(), m = String(date.getMonth() + 1).padStart(2, '0'), d = String(date.getDate()).padStart(2, '0')
                        onChange({ ...data, dateOfBirth: `${y}-${m}-${d}` })
                      } else { onChange({ ...data, dateOfBirth: '' }) }
                    }}
                    dateFormat="dd/MM/yyyy" showMonthDropdown showYearDropdown dropdownMode="select"
                    maxDate={new Date()} minDate={new Date('1990-01-01')}
                    placeholderText="Select your date of birth" className={fc('dateOfBirth')} wrapperClassName="w-full"
                  />
                  {errors.dateOfBirth && <p className="mt-1 text-xs text-red-500 font-medium">{errors.dateOfBirth}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-navy-700 mb-1.5">Profession <span className="text-red-400">*</span></label>
                  <input type="text" value={data.profession} onChange={update('profession')} placeholder="Your profession" className={fc('profession')} />
                  {errors.profession && <p className="mt-1 text-xs text-red-500 font-medium">{errors.profession}</p>}
                </div>
              </>
            )}

            {current.id === 'health' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1.5">Blood Group <span className="text-red-400">*</span></label>
                  <div className="grid grid-cols-4 gap-2">
                    {BLOOD_GROUPS.map((bg) => (
                      <button key={bg} type="button" onClick={() => onChange({ ...data, bloodGroup: bg })}
                        className={`py-3 rounded-xl text-sm font-bold transition-all duration-200 border-2
                          ${data.bloodGroup === bg ? 'bg-primary-100 border-primary-500 text-primary-700 shadow-sm' : 'bg-white border-border-subtle text-navy-600 hover:border-primary-200'}`}>
                        {bg}
                      </button>
                    ))}
                  </div>
                  {errors.bloodGroup && <p className="mt-2 text-xs text-red-500 font-medium">{errors.bloodGroup}</p>}
                </div>
                <div className="flex items-center">
                  <button type="button" onClick={() => onChange({ ...data, willingToDonate: !data.willingToDonate })}
                    className={`w-full p-5 rounded-2xl border-2 transition-all duration-300 text-left
                      ${data.willingToDonate ? 'bg-emerald-50 border-emerald-400' : 'bg-white border-border-subtle hover:border-navy-200'}`}>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{data.willingToDonate ? '❤️' : '🩸'}</div>
                      <div>
                        <p className={`text-sm font-bold ${data.willingToDonate ? 'text-emerald-700' : 'text-navy-700'}`}>
                          {data.willingToDonate ? 'Yes, I\'m willing to donate!' : 'Willing to donate blood?'}
                        </p>
                        <p className="text-xs text-navy-400 mt-0.5">Tap to {data.willingToDonate ? 'change' : 'opt in'}</p>
                      </div>
                    </div>
                  </button>
                </div>
              </>
            )}

            {current.id === 'details' && (
              <>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-navy-700 mb-1.5">Address <span className="text-red-400">*</span></label>
                  <textarea rows={3} value={data.address} onChange={update('address')} placeholder="Your full address" className={fc('address') + ' resize-none'} />
                  {errors.address && <p className="mt-1 text-xs text-red-500 font-medium">{errors.address}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-navy-700 mb-1.5">Past Positions Held <span className="text-navy-300 text-xs font-normal">(optional)</span></label>
                  <textarea rows={3} value={data.pastPositions} onChange={update('pastPositions')} placeholder="e.g., Club President 2024-25, Club Secretary 2023-24" className={fc('pastPositions') + ' resize-none'} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-navy-700 mb-1.5">Hobbies & Interests <span className="text-navy-300 text-xs font-normal">(optional)</span></label>
                  <input type="text" value={data.hobbies} onChange={update('hobbies')} placeholder="Reading, sports, photography..." className={fc('hobbies')} />
                </div>
              </>
            )}

            {current.id === 'photos' && (
              <>
                <PhotoUpload label="Professional Photo" id="professionalPhoto" value={data.professionalPhoto} onChange={(path) => onChange({ ...data, professionalPhoto: path })} />
                <PhotoUpload label="Casual Photo" id="casualPhoto" value={data.casualPhoto} onChange={(path) => onChange({ ...data, casualPhoto: path })} />
              </>
            )}

          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-5 flex items-center justify-between">
        <button onClick={() => goTo(Math.max(0, section - 1))} disabled={section === 0}
          className="px-5 py-2.5 text-sm font-semibold text-navy-600 bg-white border border-border-subtle rounded-xl hover:bg-navy-50 disabled:opacity-30 disabled:cursor-not-allowed">
          ← Previous
        </button>
        <span className="text-xs font-bold text-navy-400">{section + 1} / {SECTIONS.length}</span>
        <button onClick={handleNext} disabled={isLast}
          className="px-5 py-2.5 text-sm font-semibold text-navy-600 bg-white border border-border-subtle rounded-xl hover:bg-navy-50 disabled:opacity-30 disabled:cursor-not-allowed">
          Next →
        </button>
      </div>
    </motion.div>
  )
}
