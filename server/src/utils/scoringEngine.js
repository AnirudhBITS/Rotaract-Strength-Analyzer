const ASSESSMENT_QUESTIONS = require('../data/questions');
const { ROLE_STRENGTH_MAP, DISTRICT_POSITIONS } = require('../config/constants');

/**
 * Calculates strength scores from assessment responses.
 *
 * Each question has 4 options, each option awards points to 2-3 themes:
 *   - Primary theme:   3 points
 *   - Secondary theme: 2 points
 *   - Tertiary theme:  1 point
 *
 * @param {Array<{questionId: number, selectedOption: string}>} responses
 * @returns {Object} { scores: {theme: score}, ranked: [{theme, score, rank}], top5: string[] }
 */
function calculateStrengthScores(responses) {
  const scores = {};

  for (const { questionId, selectedOption } of responses) {
    const question = ASSESSMENT_QUESTIONS.find((q) => q.id === questionId);
    if (!question) continue;

    const option = question.options.find((o) => o.id === selectedOption);
    if (!option) continue;

    for (const [theme, points] of Object.entries(option.scores)) {
      scores[theme] = (scores[theme] || 0) + points;
    }
  }

  const ranked = Object.entries(scores)
    .map(([theme, score]) => ({ theme, score }))
    .sort((a, b) => b.score - a.score)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));

  const top5 = ranked.slice(0, 5).map((entry) => entry.theme);

  return { scores, ranked, top5 };
}

/**
 * Recommends district role categories based on strength profile.
 *
 * Algorithm:
 * 1. For each role category, count how many of the applicant's top 5 strengths
 *    appear in that category's required strengths.
 * 2. Weight by the strength's rank (higher rank = more weight).
 * 3. Return the top 3 categories sorted by match score.
 *
 * @param {string[]} top5 - The applicant's top 5 strength themes
 * @param {Array<{theme: string, score: number, rank: number}>} ranked - Full ranked scores
 * @returns {Array<{category: string, matchScore: number, matchedStrengths: string[], positions: Object[]}>}
 */
function recommendRoles(top5, ranked) {
  const categoryScores = [];

  for (const [category, requiredStrengths] of Object.entries(ROLE_STRENGTH_MAP)) {
    let matchScore = 0;
    const matchedStrengths = [];

    for (const strength of top5) {
      if (requiredStrengths.includes(strength)) {
        const rankData = ranked.find((r) => r.theme === strength);
        const weight = rankData ? (6 - rankData.rank) : 1; // top1 = 5pts, top5 = 1pt
        matchScore += weight;
        matchedStrengths.push(strength);
      }
    }

    // Bonus: check if any strengths beyond top 5 also match (minor weight)
    for (const entry of ranked.slice(5, 10)) {
      if (requiredStrengths.includes(entry.theme)) {
        matchScore += 0.5;
      }
    }

    const positions = DISTRICT_POSITIONS.filter((p) => p.category === category);

    categoryScores.push({
      category,
      matchScore,
      matchedStrengths,
      positions,
    });
  }

  return categoryScores
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);
}

/**
 * Full pipeline: responses → scores → recommendations
 */
function analyzeApplicant(responses) {
  const { scores, ranked, top5 } = calculateStrengthScores(responses);
  const recommendations = recommendRoles(top5, ranked);

  return {
    scores,
    ranked,
    top5,
    recommendations,
  };
}

module.exports = {
  calculateStrengthScores,
  recommendRoles,
  analyzeApplicant,
};
