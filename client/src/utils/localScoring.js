/**
 * Client-side scoring engine (mirrors server logic)
 * Used to show recommendations on Step 3 before final submission
 */

const ROLE_STRENGTH_MAP = {
  'Executive Leadership': ['Strategic', 'Futuristic', 'Command', 'Communication', 'Achiever', 'Deliberative', 'Developer', 'Maximizer'],
  'Administration': ['Discipline', 'Responsibility', 'Analytical', 'Deliberative', 'Focus', 'Consistency'],
  'Event Management': ['Arranger', 'Activator', 'Strategic', 'Command', 'Developer', 'Communication', 'Focus'],
  'Group Management': ['Developer', 'Empathy', 'Communication', 'Includer', 'Responsibility', 'Connectedness'],
  'Operations/Protocol': ['Command', 'Discipline', 'Responsibility', 'Focus', 'Consistency'],
  'Service Avenues': ['Ideation', 'Empathy', 'Connectedness', 'Includer', 'Achiever', 'Futuristic'],
  'Specialized': ['Communication', 'Developer', 'Connectedness', 'Includer', 'Activator'],
  'Communications & Media': ['Communication', 'Ideation', 'Maximizer', 'Focus', 'Strategic'],
}

export function analyzeLocally(responses, questions) {
  const scores = {}

  for (const { questionId, selectedOption } of responses) {
    const question = questions.find((q) => q.id === questionId)
    if (!question) continue

    const option = question.options.find((o) => o.id === selectedOption)
    if (!option) continue

    for (const [theme, points] of Object.entries(option.scores)) {
      scores[theme] = (scores[theme] || 0) + points
    }
  }

  const ranked = Object.entries(scores)
    .map(([theme, score]) => ({ theme, score }))
    .sort((a, b) => b.score - a.score)
    .map((entry, index) => ({ ...entry, rank: index + 1 }))

  const top5 = ranked.slice(0, 5).map((e) => e.theme)

  // Calculate role recommendations
  const categoryScores = []
  for (const [category, requiredStrengths] of Object.entries(ROLE_STRENGTH_MAP)) {
    let matchScore = 0
    const matchedStrengths = []

    for (const strength of top5) {
      if (requiredStrengths.includes(strength)) {
        const rankData = ranked.find((r) => r.theme === strength)
        const weight = rankData ? (6 - rankData.rank) : 1
        matchScore += weight
        matchedStrengths.push(strength)
      }
    }

    for (const entry of ranked.slice(5, 10)) {
      if (requiredStrengths.includes(entry.theme)) {
        matchScore += 0.5
      }
    }

    categoryScores.push({ category, matchScore, matchedStrengths })
  }

  const recommendations = categoryScores
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3)

  return { scores, ranked, top5, recommendations }
}
