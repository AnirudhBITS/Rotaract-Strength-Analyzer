import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import StepIndicator from '../components/form/StepIndicator'
import BiodataStep from '../components/form/BiodataStep'
import AssessmentStep from '../components/form/AssessmentStep'
import RolePreferencesStep from '../components/form/RolePreferencesStep'
import { applicationApi } from '../api/client'
import { analyzeLocally, getTopPositions } from '../utils/localScoring'

const INITIAL_BIODATA = {
  name: '', email: '', phone: '', secondaryPhone: '',
  clubName: '', rotaryId: '', age: '', dateOfBirth: '',
  profession: '', bloodGroup: '', willingToDonate: false,
  address: '', pastPositions: '', hobbies: '',
  professionalPhoto: '', casualPhoto: '',
}

const SESSION_KEY = 'rsa_form_draft'

function loadDraft() {
  return null
}

function saveDraft(data) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(data)) } catch (e) {}
}

function clearDraft() {
  try { sessionStorage.removeItem(SESSION_KEY) } catch (e) {}
}

export default function FormPage() {
  const navigate = useNavigate()
  const draft = loadDraft()

  const [step, setStep] = useState(draft?.step || 1)
  const [biodata, setBiodata] = useState(draft?.biodata || INITIAL_BIODATA)
  const [biodataErrors, setBiodataErrors] = useState({})
  const [questions, setQuestions] = useState([])
  const [positions, setPositions] = useState([])
  const [clubs, setClubs] = useState([])
  const [responses, setResponses] = useState(draft?.responses || {})
  const [selectedPositions, setSelectedPositions] = useState(draft?.selectedPositions || [])
  const [recommendations, setRecommendations] = useState(draft?.recommendations || null)
  const [analysisResult, setAnalysisResult] = useState(draft?.analysisResult || null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [biodataReady, setBiodataReady] = useState(draft?.step > 1 || false)

  // Persist form state to sessionStorage
  useEffect(() => {
    saveDraft({ step, biodata, responses, selectedPositions, recommendations, analysisResult })
  }, [step, biodata, responses, selectedPositions, recommendations])

  useEffect(() => {
    async function fetchData() {
      // Wait for prefetched data from index.html
      const waitForPrefetch = () => new Promise((resolve) => {
        if (window.__PREFETCH_DONE__) return resolve()
        const check = setInterval(() => {
          if (window.__PREFETCH_DONE__) { clearInterval(check); resolve() }
        }, 50)
        setTimeout(() => { clearInterval(check); resolve() }, 5000)
      })

      await waitForPrefetch()

      const pf = window.__PREFETCH__ || {}

      try {
        if (pf.questions) {
          setQuestions(pf.questions.questions)
        } else {
          const res = await applicationApi.getQuestions()
          setQuestions(res.data.questions)
        }

        if (pf.positions) {
          setPositions(pf.positions.positions)
        } else {
          const res = await applicationApi.getPositions()
          setPositions(res.data.positions)
        }

        if (pf.clubs) {
          setClubs(pf.clubs.clubs)
        } else {
          const res = await applicationApi.getClubs()
          setClubs(res.data.clubs)
        }
      } catch (e) {
        toast.error('Failed to load form data. Please refresh.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const validateBiodata = () => {
    const errors = {}
    if (!biodata.name.trim()) errors.name = 'Name is required'
    if (!biodata.email.trim() || !/\S+@\S+\.\S+/.test(biodata.email)) errors.email = 'Valid email is required'
    if (!biodata.phone.trim()) errors.phone = 'Phone number is required'
    if (!biodata.clubName.trim()) errors.clubName = 'Club name is required'
    if (!biodata.rotaryId.trim()) errors.rotaryId = 'Rotary ID is required'
    if (!biodata.age || biodata.age < 18 || biodata.age > 35) errors.age = 'Age must be between 18 and 35'
    if (!biodata.dateOfBirth) errors.dateOfBirth = 'Date of birth is required'
    if (!biodata.profession.trim()) errors.profession = 'Profession is required'
    if (!biodata.bloodGroup) errors.bloodGroup = 'Blood group is required'
    if (!biodata.address.trim()) errors.address = 'Address is required'
    setBiodataErrors(errors)
    return Object.keys(errors).length === 0
  }

  const [checking, setChecking] = useState(false)

  const handleNext = async () => {
    if (step === 1) {
      if (!validateBiodata()) {
        toast.error('Please fill all required fields')
        return
      }

      // Check for duplicate before proceeding
      setChecking(true)
      try {
        await applicationApi.checkDuplicate({
          email: biodata.email,
          phone: biodata.phone,
        })
      } catch (err) {
        if (err.response?.status === 409 && err.response?.data?.duplicate) {
          toast.error(err.response.data.message)
        } else {
          toast.error('Could not verify application. Please try again.')
        }
        setChecking(false)
        return
      }
      setChecking(false)

      setStep(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (step === 2) {
      if (Object.keys(responses).length < 20) {
        toast.error(`Please answer all 20 questions (${Object.keys(responses).length}/20 completed)`)
        return
      }
      // Calculate local recommendations before showing step 3
      const formattedResponses = Object.entries(responses).map(([qId, opt]) => ({
        questionId: parseInt(qId, 10),
        selectedOption: opt,
      }))
      const analysis = analyzeLocally(formattedResponses, questions)
      setRecommendations(getTopPositions(analysis.recommendations, positions))
      setAnalysisResult({
        top5: analysis.top5,
        topCategories: analysis.recommendations.slice(0, 3).map((r) => ({
          category: r.category,
          matchedStrengths: r.matchedStrengths,
          matchScore: r.matchScore,
        })),
      })
      setStep(3)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async () => {
    if (selectedPositions.length !== 3) {
      toast.error('Please select exactly 3 preferred positions')
      return
    }

    setSubmitting(true)
    try {
      const formattedResponses = Object.entries(responses).map(([qId, opt]) => ({
        questionId: parseInt(qId, 10),
        selectedOption: opt,
      }))

      const { data } = await applicationApi.submit({
        biodata: {
          ...biodata,
          age: parseInt(biodata.age, 10),
          willingToDonate: Boolean(biodata.willingToDonate),
        },
        responses: formattedResponses,
        preferredPositions: selectedPositions,
      })

      clearDraft()
      try { sessionStorage.removeItem('rsa_biodata_state') } catch (e) {}
      toast.success('Application submitted successfully!')
      navigate('/result', {
        state: {
          analysis: data.analysis,
          name: biodata.name,
          applicationNumber: data.applicationNumber,
          selectedPositions: selectedPositions.map(
            (id) => positions.find((p) => p.id === id)?.title
          ),
          recommendedPositions: recommendations,
        },
      })
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.errors?.[0]?.message || 'Submission failed. Please try again.'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-navy-500 font-medium">Loading form...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white border-b border-border-subtle sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="text-base sm:text-lg font-bold text-navy-900 font-[var(--font-display)] flex-shrink-0">
            Rotaract<span className="text-primary-600">3234</span>
          </Link>
          <span className="text-xs sm:text-sm text-navy-500 text-right hidden sm:block">District Officials Recruitment</span>
          <span className="text-[10px] text-navy-400 text-right sm:hidden">DO Recruitment</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <StepIndicator currentStep={step} />

        <AnimatePresence mode="wait">
          {step === 1 && (
            <BiodataStep
              key="biodata"
              data={biodata}
              onChange={setBiodata}
              errors={biodataErrors}
              clubs={clubs}
              onSectionChange={(index, total) => setBiodataReady(index === total - 1)}
            />
          )}
          {step === 2 && (
            <AssessmentStep
              key="assessment"
              questions={questions}
              responses={responses}
              onChange={setResponses}
              onComplete={() => {
                const formattedResponses = Object.entries(responses).map(([qId, opt]) => ({
                  questionId: parseInt(qId, 10),
                  selectedOption: opt,
                }))
                const analysis = analyzeLocally(formattedResponses, questions)
                setRecommendations(getTopPositions(analysis.recommendations, positions))
                setAnalysisResult({
                  top5: analysis.top5,
                  topCategories: analysis.recommendations.slice(0, 3).map((r) => ({
                    category: r.category,
                    matchedStrengths: r.matchedStrengths,
                    matchScore: r.matchScore,
                  })),
                })
                setStep(3)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
          )}
          {step === 3 && (
            <RolePreferencesStep
              key="roles"
              positions={positions}
              selected={selectedPositions}
              onChange={setSelectedPositions}
              recommendations={recommendations}
              analysis={analysisResult}
            />
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="px-6 py-3 text-sm font-semibold text-navy-700 bg-white border border-border-subtle rounded-xl shadow-sm transition-all duration-200 hover:bg-navy-50 hover:shadow-md disabled:opacity-0 disabled:pointer-events-none"
          >
            Back
          </button>

          {step < 3 ? (
            (step !== 1 || biodataReady) ? (
              <button
                onClick={handleNext}
                disabled={checking}
                className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg shadow-primary-300/30 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {checking ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  'Continue →'
                )}
              </button>
            ) : <div />
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting || selectedPositions.length !== 3}
              className="px-8 py-3 text-sm font-semibold text-white bg-primary-600 rounded-xl shadow-sm transition-all duration-200 hover:bg-primary-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                'Submit Application'
              )}
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
