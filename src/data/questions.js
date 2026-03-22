/**
 * 20 Scenario-Based Assessment Questions
 *
 * Each question maps to a primary strength theme and each answer option
 * scores across 2-3 themes. This cross-scoring approach ensures reliable
 * identification of an applicant's top 5 strengths from 19 themes.
 *
 * Scoring: Each option awards points to the listed themes.
 * Points are weighted: primary theme gets 3 pts, secondary gets 2 pts, tertiary gets 1 pt.
 */

const ASSESSMENT_QUESTIONS = [
  // ── ACHIEVER (Q1) ──────────────────────────────────────────
  {
    id: 1,
    theme: 'Achiever',
    question: 'Your club has just finished a major project, but you notice there are still smaller tasks left incomplete. What do you do?',
    options: [
      {
        id: 'a',
        text: 'I stay back and finish every last detail — I can\'t rest until everything is truly done.',
        scores: { Achiever: 3, Responsibility: 2, Focus: 1 },
      },
      {
        id: 'b',
        text: 'I make a checklist and delegate the remaining tasks to ensure they get done by tomorrow.',
        scores: { Arranger: 3, Achiever: 2, Discipline: 1 },
      },
      {
        id: 'c',
        text: 'I celebrate the big win with the team first, then circle back to wrap things up.',
        scores: { Includer: 3, Empathy: 2, Achiever: 1 },
      },
      {
        id: 'd',
        text: 'I evaluate which remaining tasks truly matter and focus only on those.',
        scores: { Strategic: 3, Analytical: 2, Focus: 1 },
      },
    ],
  },

  // ── ACTIVATOR (Q2) ─────────────────────────────────────────
  {
    id: 2,
    theme: 'Activator',
    question: 'During a project discussion, your idea excites a few members, but most are still unsure. What would you do?',
    options: [
      {
        id: 'a',
        text: 'I suggest starting with a small pilot to show how the idea can work in practice.',
        scores: { Activator: 3, Achiever: 2, Strategic: 1 },
      },
      {
        id: 'b',
        text: 'I take time to research similar ideas and refine mine before pushing it further.',
        scores: { Deliberative: 3, Analytical: 2, Activator: 1 },
      },
      {
        id: 'c',
        text: 'I check with the team to see if there\'s enough interest before taking it ahead.',
        scores: { Empathy: 3, Includer: 2, Activator: 1 },
      },
      {
        id: 'd',
        text: 'I work on structuring the idea clearly with timelines before proposing it again.',
        scores: { Discipline: 3, Focus: 2, Arranger: 1 },
      },
    ],
  },

  // ── ANALYTICAL (Q3) ───────────────────────────────────────
  {
    id: 3,
    theme: 'Analytical',
    question: 'Your district\'s membership numbers have been declining. How do you approach the problem?',
    options: [
      {
        id: 'a',
        text: 'I pull the data — when did the drop start, which clubs are affected, what changed?',
        scores: { Analytical: 3, Strategic: 2, Focus: 1 },
      },
      {
        id: 'b',
        text: 'I visit struggling clubs and talk to members to understand their reasons for leaving.',
        scores: { Empathy: 3, Connectedness: 2, Developer: 1 },
      },
      {
        id: 'c',
        text: 'I brainstorm creative retention programs that make membership more exciting.',
        scores: { Ideation: 3, Activator: 2, Futuristic: 1 },
      },
      {
        id: 'd',
        text: 'I look at what successful districts are doing differently and adapt their approach.',
        scores: { Strategic: 3, Maximizer: 2, Analytical: 1 },
      },
    ],
  },

  // ── ARRANGER (Q4) ─────────────────────────────────────────
  {
    id: 4,
    theme: 'Arranger',
    question: 'You\'re organizing a district event and three things go wrong simultaneously. How do you handle it?',
    options: [
      {
        id: 'a',
        text: 'I quickly reshuffle people and resources — I thrive when I\'m juggling multiple moving parts.',
        scores: { Arranger: 3, Activator: 2, Command: 1 },
      },
      {
        id: 'b',
        text: 'I stay calm, prioritize the most critical issue, and address them one by one.',
        scores: { Focus: 3, Deliberative: 2, Discipline: 1 },
      },
      {
        id: 'c',
        text: 'I rally the team — we\'re stronger solving problems together.',
        scores: { Includer: 3, Connectedness: 2, Empathy: 1 },
      },
      {
        id: 'd',
        text: 'I refer to the backup plan I prepared for exactly this kind of situation.',
        scores: { Deliberative: 3, Discipline: 2, Responsibility: 1 },
      },
    ],
  },

  // ── ARRANGER (Q5) ─────────────────────────────────────────
  {
    id: 5,
    theme: 'Arranger',
    question: 'You have a team of 10 volunteers with different skills. How do you assign tasks?',
    options: [
      {
        id: 'a',
        text: 'I match each person to the task that plays to their unique strengths.',
        scores: { Arranger: 3, Developer: 2, Maximizer: 1 },
      },
      {
        id: 'b',
        text: 'I create equal workloads so nobody feels overburdened or left out.',
        scores: { Consistency: 3, Includer: 2, Empathy: 1 },
      },
      {
        id: 'c',
        text: 'I let people volunteer for what they\'re passionate about.',
        scores: { Includer: 3, Developer: 2, Connectedness: 1 },
      },
      {
        id: 'd',
        text: 'I assign the most critical tasks to the most proven people.',
        scores: { Maximizer: 3, Strategic: 2, Responsibility: 1 },
      },
    ],
  },

  // ── COMMAND (Q6) ──────────────────────────────────────────
  {
    id: 6,
    theme: 'Command',
    question: 'A meeting is going off-track with everyone talking over each other. What do you do?',
    options: [
      {
        id: 'a',
        text: 'I take charge — I\'ll call the room to order and refocus the discussion.',
        scores: { Command: 3, Discipline: 2, Focus: 1 },
      },
      {
        id: 'b',
        text: 'I gently suggest we park off-topic items and come back to the agenda.',
        scores: { Communication: 3, Empathy: 2, Arranger: 1 },
      },
      {
        id: 'c',
        text: 'I wait — sometimes the best ideas come from unstructured conversations.',
        scores: { Ideation: 3, Includer: 2, Connectedness: 1 },
      },
      {
        id: 'd',
        text: 'I quietly message the chairperson to intervene.',
        scores: { Deliberative: 3, Responsibility: 2, Empathy: 1 },
      },
    ],
  },

  // ── COMMUNICATION (Q7) ────────────────────────────────────
  {
    id: 7,
    theme: 'Communication',
    question: 'You need to get 50 clubs excited about an upcoming district initiative. What\'s your approach?',
    options: [
      {
        id: 'a',
        text: 'I craft a compelling story about why this initiative matters and present it passionately.',
        scores: { Communication: 3, Futuristic: 2, Maximizer: 1 },
      },
      {
        id: 'b',
        text: 'I share data and past success stories to build a logical case.',
        scores: { Analytical: 3, Communication: 2, Strategic: 1 },
      },
      {
        id: 'c',
        text: 'I personally reach out to key club leaders and build grassroots momentum.',
        scores: { Connectedness: 3, Developer: 2, Includer: 1 },
      },
      {
        id: 'd',
        text: 'I create an action plan with clear steps so clubs know exactly what to do.',
        scores: { Discipline: 3, Arranger: 2, Focus: 1 },
      },
    ],
  },

  // ── CONNECTEDNESS (Q8) ────────────────────────────────────
  {
    id: 8,
    theme: 'Connectedness',
    question: 'What motivates you most about being part of Rotaract?',
    options: [
      {
        id: 'a',
        text: 'Being part of something larger than myself and contributing to society.',
        scores: { Connectedness: 3, Empathy: 2, Responsibility: 1 },
      },
      {
        id: 'b',
        text: 'Developing my leadership and helping others grow.',
        scores: { Developer: 3, Maximizer: 2, Achiever: 1 },
      },
      {
        id: 'c',
        text: 'Creating real impact through meaningful service projects.',
        scores: { Achiever: 3, Futuristic: 2, Activator: 1 },
      },
      {
        id: 'd',
        text: 'Building strong networks and relationships.',
        scores: { Includer: 3, Communication: 2, Connectedness: 1 },
      },
    ],
  },

  // ── CONSISTENCY (Q9) ──────────────────────────────────────
  {
    id: 9,
    theme: 'Consistency',
    question: 'Two clubs submit project proposals — one well-established and one relatively new. How do you evaluate them?',
    options: [
      {
        id: 'a',
        text: 'I ensure both are judged using the exact same criteria.',
        scores: { Consistency: 3, Discipline: 2, Analytical: 1 },
      },
      {
        id: 'b',
        text: 'I give additional guidance to help the newer club compete fairly.',
        scores: { Developer: 3, Empathy: 2, Includer: 1 },
      },
      {
        id: 'c',
        text: 'I choose based purely on which proposal creates more impact.',
        scores: { Maximizer: 3, Strategic: 2, Achiever: 1 },
      },
      {
        id: 'd',
        text: 'I align the decision with district priorities for the year.',
        scores: { Strategic: 3, Focus: 2, Responsibility: 1 },
      },
    ],
  },

  // ── DELIBERATIVE (Q10) ────────────────────────────────────
  {
    id: 10,
    theme: 'Deliberative',
    question: 'A sponsor offers significant funding but requests certain conditions. How do you respond?',
    options: [
      {
        id: 'a',
        text: 'I carefully evaluate all risks before making a decision.',
        scores: { Deliberative: 3, Analytical: 2, Responsibility: 1 },
      },
      {
        id: 'b',
        text: 'I accept if the conditions are reasonable and manageable.',
        scores: { Activator: 3, Achiever: 2, Arranger: 1 },
      },
      {
        id: 'c',
        text: 'I negotiate terms to reach a balanced agreement.',
        scores: { Communication: 3, Command: 2, Strategic: 1 },
      },
      {
        id: 'd',
        text: 'I check if the sponsor aligns with Rotaract\'s values first.',
        scores: { Connectedness: 3, Consistency: 2, Deliberative: 1 },
      },
    ],
  },

  // ── DEVELOPER (Q11) ───────────────────────────────────────
  {
    id: 11,
    theme: 'Developer',
    question: 'A Rotaractor shows potential but lacks confidence to take up leadership roles. What do you do?',
    options: [
      {
        id: 'a',
        text: 'I give them a responsibility slightly beyond their comfort zone and guide them.',
        scores: { Developer: 3, Maximizer: 2, Command: 1 },
      },
      {
        id: 'b',
        text: 'I pair them with a mentor who can support their growth.',
        scores: { Developer: 3, Connectedness: 2, Empathy: 1 },
      },
      {
        id: 'c',
        text: 'I recognize their efforts publicly to build confidence.',
        scores: { Communication: 3, Includer: 2, Empathy: 1 },
      },
      {
        id: 'd',
        text: 'I allow them to grow at their own pace without pressure.',
        scores: { Empathy: 3, Consistency: 2, Includer: 1 },
      },
    ],
  },

  // ── DISCIPLINE (Q12) ──────────────────────────────────────
  {
    id: 12,
    theme: 'Discipline',
    question: 'Deadlines for an important event are repeatedly being missed by team members. What do you do?',
    options: [
      {
        id: 'a',
        text: 'I enforce deadlines strictly and set clear expectations.',
        scores: { Discipline: 3, Command: 2, Responsibility: 1 },
      },
      {
        id: 'b',
        text: 'I understand the reasons and adjust timelines realistically.',
        scores: { Empathy: 3, Arranger: 2, Developer: 1 },
      },
      {
        id: 'c',
        text: 'I identify bottlenecks and fix the process.',
        scores: { Analytical: 3, Strategic: 2, Focus: 1 },
      },
      {
        id: 'd',
        text: 'I remind the team of the purpose and motivate them to act.',
        scores: { Communication: 3, Connectedness: 2, Activator: 1 },
      },
    ],
  },

  // ── EMPATHY (Q13) ─────────────────────────────────────────
  {
    id: 13,
    theme: 'Empathy',
    question: 'A team member who was once active has become quiet and disengaged. What do you do?',
    options: [
      {
        id: 'a',
        text: 'I check in with them personally to understand what\'s going on.',
        scores: { Empathy: 3, Connectedness: 2, Developer: 1 },
      },
      {
        id: 'b',
        text: 'I give them space, trusting they will come back.',
        scores: { Deliberative: 3, Consistency: 2, Includer: 1 },
      },
      {
        id: 'c',
        text: 'I assign them a role to re-engage them.',
        scores: { Activator: 3, Arranger: 2, Developer: 1 },
      },
      {
        id: 'd',
        text: 'I address the issue directly within the team.',
        scores: { Command: 3, Discipline: 2, Communication: 1 },
      },
    ],
  },

  // ── FOCUS (Q14) ───────────────────────────────────────────
  {
    id: 14,
    theme: 'Focus',
    question: 'You are a part of multiple district & club initiatives at the same time. How do you manage your attention?',
    options: [
      {
        id: 'a',
        text: 'I choose a few key initiatives where I can contribute the most and focus on them.',
        scores: { Focus: 3, Strategic: 2, Maximizer: 1 },
      },
      {
        id: 'b',
        text: 'I try to stay involved in all of them and contribute wherever needed.',
        scores: { Achiever: 3, Includer: 2, Responsibility: 1 },
      },
      {
        id: 'c',
        text: 'I take ownership of specific areas while trusting others to handle the rest.',
        scores: { Responsibility: 3, Arranger: 2, Focus: 1 },
      },
      {
        id: 'd',
        text: 'I keep track of everything through regular updates and check-ins.',
        scores: { Discipline: 3, Analytical: 2, Arranger: 1 },
      },
    ],
  },

  // ── FUTURISTIC (Q15) ──────────────────────────────────────
  {
    id: 15,
    theme: 'Futuristic',
    question: 'When you think about your district\'s future, what excites you most?',
    options: [
      {
        id: 'a',
        text: 'The vision of what Rotaract could become in 5 years if we make the right moves today.',
        scores: { Futuristic: 3, Strategic: 2, Ideation: 1 },
      },
      {
        id: 'b',
        text: 'Building stronger clubs that sustain themselves beyond any single leader\'s tenure.',
        scores: { Developer: 3, Responsibility: 2, Consistency: 1 },
      },
      {
        id: 'c',
        text: 'Creating a legacy of impactful community projects that people remember.',
        scores: { Achiever: 3, Connectedness: 2, Futuristic: 1 },
      },
      {
        id: 'd',
        text: 'Establishing systems and traditions that become the standard for future teams.',
        scores: { Discipline: 3, Consistency: 2, Arranger: 1 },
      },
    ],
  },

  // ── IDEATION (Q16) ────────────────────────────────────────
  {
    id: 16,
    theme: 'Ideation',
    question: 'Your entire team\'s engagement has been low recently. How do you approach solving this?',
    options: [
      {
        id: 'a',
        text: 'I throw in a bunch of fresh, even crazy ideas to spark reactions.',
        scores: { Ideation: 3, Activator: 2, Communication: 1 },
      },
      {
        id: 'b',
        text: 'I check what worked in other teams and try something similar.',
        scores: { Strategic: 3, Analytical: 2, Maximizer: 1 },
      },
      {
        id: 'c',
        text: 'I directly ask members what they actually want to see or do.',
        scores: { Empathy: 3, Includer: 2, Connectedness: 1 },
      },
      {
        id: 'd',
        text: 'I take one proven idea and execute it really well to restart momentum.',
        scores: { Achiever: 3, Focus: 2, Activator: 1 },
      },
    ],
  },

  // ── INCLUDER (Q17) ────────────────────────────────────────
  {
    id: 17,
    theme: 'Includer',
    question: 'You are a new DO who feels overshadowed by more experienced DOs. How do you make yourself seen or heard?',
    options: [
      {
        id: 'a',
        text: 'I actively speak up and share my thoughts whenever there\'s an opportunity.',
        scores: { Command: 3, Communication: 2, Activator: 1 },
      },
      {
        id: 'b',
        text: 'I build rapport with a few team members so I feel more comfortable contributing.',
        scores: { Includer: 3, Connectedness: 2, Empathy: 1 },
      },
      {
        id: 'c',
        text: 'I take up responsibilities and let my work speak for me.',
        scores: { Achiever: 3, Responsibility: 2, Focus: 1 },
      },
      {
        id: 'd',
        text: 'I observe and wait for the right time before stepping in.',
        scores: { Deliberative: 3, Strategic: 2, Analytical: 1 },
      },
    ],
  },

  // ── MAXIMIZER (Q18) ───────────────────────────────────────
  {
    id: 18,
    theme: 'Maximizer',
    question: 'A project is good but not great, and the deadline is close. What do you do?',
    options: [
      {
        id: 'a',
        text: 'I push for excellence — I\'d rather request a short extension than deliver something mediocre.',
        scores: { Maximizer: 3, Achiever: 2, Responsibility: 1 },
      },
      {
        id: 'b',
        text: 'I ship it — done is better than perfect, and we can improve next time.',
        scores: { Activator: 3, Achiever: 2, Focus: 1 },
      },
      {
        id: 'c',
        text: 'I identify the things that will make the biggest quality difference and fix only those.',
        scores: { Strategic: 3, Focus: 2, Analytical: 1 },
      },
      {
        id: 'd',
        text: 'I rally the team for a final push — together we can elevate it overnight.',
        scores: { Command: 3, Includer: 2, Connectedness: 1 },
      },
    ],
  },

  // ── REALITY CHECK (Q19) ───────────────────────────────────
  {
    id: 19,
    theme: 'Strategic',
    question: 'Many members lose interest during online meetings or sessions. How can we change this?',
    options: [
      {
        id: 'a',
        text: 'Make sessions more engaging and interactive with activities, polls, or discussions.',
        scores: { Ideation: 3, Communication: 2, Activator: 1 },
      },
      {
        id: 'b',
        text: 'Focus on making the content more relevant and useful to the audience.',
        scores: { Maximizer: 3, Analytical: 2, Strategic: 1 },
      },
      {
        id: 'c',
        text: 'Create more opportunities for members to participate and contribute actively.',
        scores: { Includer: 3, Developer: 2, Empathy: 1 },
      },
      {
        id: 'd',
        text: 'Improve planning and structure to keep sessions smooth and well-paced.',
        scores: { Discipline: 3, Arranger: 2, Focus: 1 },
      },
    ],
  },

  // ── VALUES (Q20) ──────────────────────────────────────────
  {
    id: 20,
    theme: 'Responsibility',
    question: 'When doing a service activity like food distribution, would you take photos? Why?',
    options: [
      {
        id: 'a',
        text: 'Yes, to create awareness and inspire others.',
        scores: { Communication: 3, Futuristic: 2, Activator: 1 },
      },
      {
        id: 'b',
        text: 'Yes, but only with consent and sensitivity.',
        scores: { Responsibility: 3, Empathy: 2, Deliberative: 1 },
      },
      {
        id: 'c',
        text: 'No, I prefer focusing only on service.',
        scores: { Achiever: 3, Connectedness: 2, Responsibility: 1 },
      },
      {
        id: 'd',
        text: 'It depends on the context and purpose.',
        scores: { Deliberative: 3, Analytical: 2, Strategic: 1 },
      },
    ],
  },
];

module.exports = ASSESSMENT_QUESTIONS;
