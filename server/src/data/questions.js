/**
 * 32 Scenario-Based Assessment Questions
 *
 * Each question maps to a primary strength theme and each answer option
 * scores across 2-3 themes. This cross-scoring approach ensures reliable
 * identification of an applicant's top 5 strengths from 19 themes.
 *
 * Scoring: Each option awards points to the listed themes.
 * Points are weighted: primary theme gets 3 pts, secondary gets 2 pts, tertiary gets 1 pt.
 */

const ASSESSMENT_QUESTIONS = [
  // ── ACHIEVER (Q1, Q2) ──────────────────────────────────────────
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
  {
    id: 2,
    theme: 'Achiever',
    question: 'At the end of a busy week, how do you feel about your productivity?',
    options: [
      {
        id: 'a',
        text: 'I measure my week by tangible outcomes — if I got things done, I feel fulfilled.',
        scores: { Achiever: 3, Focus: 2, Discipline: 1 },
      },
      {
        id: 'b',
        text: 'I feel best when the team collectively accomplished more than expected.',
        scores: { Developer: 3, Includer: 2, Achiever: 1 },
      },
      {
        id: 'c',
        text: 'I reflect on what I learned and how I grew through the challenges.',
        scores: { Futuristic: 3, Strategic: 2, Achiever: 1 },
      },
      {
        id: 'd',
        text: 'I focus on whether the quality of work met the highest standards.',
        scores: { Maximizer: 3, Deliberative: 2, Achiever: 1 },
      },
    ],
  },

  // ── ACTIVATOR (Q3, Q4) ─────────────────────────────────────────
  {
    id: 3,
    theme: 'Activator',
    question: 'A new community service idea comes up during a meeting. The team is still debating the details. What\'s your instinct?',
    options: [
      {
        id: 'a',
        text: 'Let\'s start with a small pilot right away — we\'ll learn more by doing than by discussing.',
        scores: { Activator: 3, Achiever: 2, Strategic: 1 },
      },
      {
        id: 'b',
        text: 'I\'d want to research similar projects first to avoid mistakes others have made.',
        scores: { Deliberative: 3, Analytical: 2, Activator: 1 },
      },
      {
        id: 'c',
        text: 'I\'d check if everyone in the team is genuinely excited before moving forward.',
        scores: { Empathy: 3, Includer: 2, Activator: 1 },
      },
      {
        id: 'd',
        text: 'I\'d create a structured plan with timelines before we begin anything.',
        scores: { Discipline: 3, Focus: 2, Arranger: 1 },
      },
    ],
  },
  {
    id: 4,
    theme: 'Activator',
    question: 'You spot a problem in how your district communicates with clubs. How do you respond?',
    options: [
      {
        id: 'a',
        text: 'I immediately try a new approach and see if it works better.',
        scores: { Activator: 3, Command: 2, Ideation: 1 },
      },
      {
        id: 'b',
        text: 'I draft a proposal and present it to the leadership for approval.',
        scores: { Communication: 3, Deliberative: 2, Activator: 1 },
      },
      {
        id: 'c',
        text: 'I talk to clubs first to understand their perspective on the issue.',
        scores: { Empathy: 3, Connectedness: 2, Includer: 1 },
      },
      {
        id: 'd',
        text: 'I analyze what exactly is broken before suggesting any changes.',
        scores: { Analytical: 3, Strategic: 2, Deliberative: 1 },
      },
    ],
  },

  // ── ANALYTICAL (Q5, Q6) ────────────────────────────────────────
  {
    id: 5,
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
  {
    id: 6,
    theme: 'Analytical',
    question: 'Someone proposes a big-budget district event. How do you evaluate it?',
    options: [
      {
        id: 'a',
        text: 'I want to see the numbers — projected costs, expected attendance, ROI, and past event data.',
        scores: { Analytical: 3, Deliberative: 2, Discipline: 1 },
      },
      {
        id: 'b',
        text: 'I focus on the vision — if the concept is powerful enough, the logistics will follow.',
        scores: { Futuristic: 3, Ideation: 2, Activator: 1 },
      },
      {
        id: 'c',
        text: 'I consider whether this event will truly benefit every club and member equally.',
        scores: { Consistency: 3, Includer: 2, Empathy: 1 },
      },
      {
        id: 'd',
        text: 'I\'d back it if the right leader is chairing it — execution depends on people.',
        scores: { Developer: 3, Command: 2, Responsibility: 1 },
      },
    ],
  },

  // ── ARRANGER (Q7, Q8) ──────────────────────────────────────────
  {
    id: 7,
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
        scores: { Deliberative: 3, Discipline: 2, Strategic: 1 },
      },
    ],
  },
  {
    id: 8,
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
        scores: { Empathy: 3, Developer: 2, Includer: 1 },
      },
      {
        id: 'd',
        text: 'I assign the most critical tasks to the most proven people.',
        scores: { Command: 3, Achiever: 2, Responsibility: 1 },
      },
    ],
  },

  // ── COMMAND (Q9, Q10) ──────────────────────────────────────────
  {
    id: 9,
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
  {
    id: 10,
    theme: 'Command',
    question: 'A club president is not performing their duties and it\'s affecting the group. How do you handle it?',
    options: [
      {
        id: 'a',
        text: 'I have a direct, honest conversation — they need to know the impact of their actions.',
        scores: { Command: 3, Responsibility: 2, Communication: 1 },
      },
      {
        id: 'b',
        text: 'I try to understand their situation first — maybe they\'re going through something tough.',
        scores: { Empathy: 3, Developer: 2, Connectedness: 1 },
      },
      {
        id: 'c',
        text: 'I offer to mentor them and help them improve their leadership skills.',
        scores: { Developer: 3, Maximizer: 2, Includer: 1 },
      },
      {
        id: 'd',
        text: 'I document the issues and escalate to the appropriate district authority.',
        scores: { Discipline: 3, Analytical: 2, Responsibility: 1 },
      },
    ],
  },

  // ── COMMUNICATION (Q11, Q12) ───────────────────────────────────
  {
    id: 11,
    theme: 'Communication',
    question: 'You need to get 50 clubs excited about an upcoming district initiative. What\'s your approach?',
    options: [
      {
        id: 'a',
        text: 'I craft a compelling story about why this initiative matters and present it passionately.',
        scores: { Communication: 3, Maximizer: 2, Futuristic: 1 },
      },
      {
        id: 'b',
        text: 'I share data and past success stories to build a logical case.',
        scores: { Analytical: 3, Communication: 2, Strategic: 1 },
      },
      {
        id: 'c',
        text: 'I personally reach out to key club leaders and build grassroots momentum.',
        scores: { Connectedness: 3, Developer: 2, Empathy: 1 },
      },
      {
        id: 'd',
        text: 'I create an action plan with clear steps so clubs know exactly what to do.',
        scores: { Discipline: 3, Arranger: 2, Focus: 1 },
      },
    ],
  },
  {
    id: 12,
    theme: 'Communication',
    question: 'How do you prefer to share important updates with the district?',
    options: [
      {
        id: 'a',
        text: 'Through well-written, engaging messages that capture attention and inspire action.',
        scores: { Communication: 3, Ideation: 2, Maximizer: 1 },
      },
      {
        id: 'b',
        text: 'Through structured reports with clear data and outcomes.',
        scores: { Analytical: 3, Discipline: 2, Consistency: 1 },
      },
      {
        id: 'c',
        text: 'Through personal conversations — the human touch matters most.',
        scores: { Empathy: 3, Connectedness: 2, Developer: 1 },
      },
      {
        id: 'd',
        text: 'Through creative visuals and social media that reach the widest audience.',
        scores: { Ideation: 3, Communication: 2, Futuristic: 1 },
      },
    ],
  },

  // ── CONNECTEDNESS (Q13, Q14) ───────────────────────────────────
  {
    id: 13,
    theme: 'Connectedness',
    question: 'A small Rotaract club in a rural area feels disconnected from district activities. What do you do?',
    options: [
      {
        id: 'a',
        text: 'I reach out personally — every club matters, and they need to feel part of the larger family.',
        scores: { Connectedness: 3, Includer: 2, Empathy: 1 },
      },
      {
        id: 'b',
        text: 'I create a buddy system pairing them with a stronger urban club.',
        scores: { Developer: 3, Arranger: 2, Connectedness: 1 },
      },
      {
        id: 'c',
        text: 'I organize a virtual district event they can easily participate in.',
        scores: { Ideation: 3, Activator: 2, Includer: 1 },
      },
      {
        id: 'd',
        text: 'I assign their GRR to check in weekly and report back on their progress.',
        scores: { Responsibility: 3, Discipline: 2, Focus: 1 },
      },
    ],
  },
  {
    id: 14,
    theme: 'Connectedness',
    question: 'What motivates you most about being part of Rotaract?',
    options: [
      {
        id: 'a',
        text: 'The sense that we\'re all connected by something bigger — service above self isn\'t just a motto.',
        scores: { Connectedness: 3, Futuristic: 2, Empathy: 1 },
      },
      {
        id: 'b',
        text: 'The opportunity to develop my leadership skills and help others grow.',
        scores: { Developer: 3, Maximizer: 2, Achiever: 1 },
      },
      {
        id: 'c',
        text: 'The tangible impact we create through community service projects.',
        scores: { Achiever: 3, Responsibility: 2, Connectedness: 1 },
      },
      {
        id: 'd',
        text: 'The network — connecting with driven individuals across clubs and districts.',
        scores: { Communication: 3, Connectedness: 2, Strategic: 1 },
      },
    ],
  },

  // ── CONSISTENCY (Q15, Q16) ─────────────────────────────────────
  {
    id: 15,
    theme: 'Consistency',
    question: 'Two clubs submit project proposals. One is from a well-known club, the other from a new small club. How do you evaluate them?',
    options: [
      {
        id: 'a',
        text: 'Both get judged by the same criteria — fairness means no special treatment.',
        scores: { Consistency: 3, Analytical: 2, Responsibility: 1 },
      },
      {
        id: 'b',
        text: 'I give the smaller club extra support to level the playing field.',
        scores: { Developer: 3, Includer: 2, Empathy: 1 },
      },
      {
        id: 'c',
        text: 'I evaluate based on impact potential — the better idea wins regardless of who submitted it.',
        scores: { Strategic: 3, Maximizer: 2, Analytical: 1 },
      },
      {
        id: 'd',
        text: 'I check which one aligns better with the district\'s goals this year.',
        scores: { Focus: 3, Strategic: 2, Futuristic: 1 },
      },
    ],
  },
  {
    id: 16,
    theme: 'Consistency',
    question: 'How do you feel about having standardized processes across all district operations?',
    options: [
      {
        id: 'a',
        text: 'Essential — consistent processes ensure fairness and reduce chaos.',
        scores: { Consistency: 3, Discipline: 2, Responsibility: 1 },
      },
      {
        id: 'b',
        text: 'Useful as guidelines, but flexibility is needed for different situations.',
        scores: { Arranger: 3, Strategic: 2, Empathy: 1 },
      },
      {
        id: 'c',
        text: 'They can feel restrictive — I prefer creative freedom to solve problems my way.',
        scores: { Ideation: 3, Activator: 2, Futuristic: 1 },
      },
      {
        id: 'd',
        text: 'Important for documentation and records, but leadership needs room to innovate.',
        scores: { Communication: 3, Analytical: 2, Maximizer: 1 },
      },
    ],
  },

  // ── DELIBERATIVE (Q17, Q18) ────────────────────────────────────
  {
    id: 17,
    theme: 'Deliberative',
    question: 'A sponsor offers a large sum for a district event but wants certain conditions. How do you decide?',
    options: [
      {
        id: 'a',
        text: 'I carefully review the conditions, consult with the team, and weigh all risks before deciding.',
        scores: { Deliberative: 3, Analytical: 2, Responsibility: 1 },
      },
      {
        id: 'b',
        text: 'If the conditions are reasonable, I\'d accept — we can\'t afford to lose funding.',
        scores: { Activator: 3, Achiever: 2, Strategic: 1 },
      },
      {
        id: 'c',
        text: 'I negotiate — find a middle ground that works for both parties.',
        scores: { Communication: 3, Strategic: 2, Command: 1 },
      },
      {
        id: 'd',
        text: 'I check if the sponsor\'s values align with Rotaract\'s principles first.',
        scores: { Connectedness: 3, Consistency: 2, Deliberative: 1 },
      },
    ],
  },
  {
    id: 18,
    theme: 'Deliberative',
    question: 'Before launching a new initiative, what\'s most important to you?',
    options: [
      {
        id: 'a',
        text: 'Identifying every possible risk and having contingency plans ready.',
        scores: { Deliberative: 3, Discipline: 2, Strategic: 1 },
      },
      {
        id: 'b',
        text: 'Getting started quickly — we\'ll learn and adapt as we go.',
        scores: { Activator: 3, Achiever: 2, Ideation: 1 },
      },
      {
        id: 'c',
        text: 'Making sure the right people are involved and enthusiastic.',
        scores: { Developer: 3, Includer: 2, Empathy: 1 },
      },
      {
        id: 'd',
        text: 'Ensuring it creates maximum impact with the resources we have.',
        scores: { Maximizer: 3, Focus: 2, Strategic: 1 },
      },
    ],
  },

  // ── DEVELOPER (Q19, Q20) ───────────────────────────────────────
  {
    id: 19,
    theme: 'Developer',
    question: 'A young Rotaractor shows potential but lacks confidence. How do you respond?',
    options: [
      {
        id: 'a',
        text: 'I give them a meaningful responsibility that\'s slightly above their comfort zone and guide them through it.',
        scores: { Developer: 3, Maximizer: 2, Command: 1 },
      },
      {
        id: 'b',
        text: 'I pair them with an experienced member who can mentor them.',
        scores: { Arranger: 3, Developer: 2, Connectedness: 1 },
      },
      {
        id: 'c',
        text: 'I publicly recognize their small wins to build their confidence.',
        scores: { Communication: 3, Empathy: 2, Developer: 1 },
      },
      {
        id: 'd',
        text: 'I let them find their own path — growth happens naturally when you don\'t force it.',
        scores: { Includer: 3, Empathy: 2, Connectedness: 1 },
      },
    ],
  },
  {
    id: 20,
    theme: 'Developer',
    question: 'What gives you the most satisfaction in a leadership role?',
    options: [
      {
        id: 'a',
        text: 'Watching someone I mentored step up and lead confidently on their own.',
        scores: { Developer: 3, Empathy: 2, Connectedness: 1 },
      },
      {
        id: 'b',
        text: 'Delivering exceptional results that set a new benchmark for the district.',
        scores: { Achiever: 3, Maximizer: 2, Focus: 1 },
      },
      {
        id: 'c',
        text: 'Building systems and processes that will outlast my tenure.',
        scores: { Futuristic: 3, Discipline: 2, Strategic: 1 },
      },
      {
        id: 'd',
        text: 'Bringing people together who wouldn\'t have connected otherwise.',
        scores: { Connectedness: 3, Includer: 2, Communication: 1 },
      },
    ],
  },

  // ── DISCIPLINE (Q21, Q22) ──────────────────────────────────────
  {
    id: 21,
    theme: 'Discipline',
    question: 'How do you manage your tasks when leading a large project?',
    options: [
      {
        id: 'a',
        text: 'Detailed timelines, checklists, and daily progress tracking — structure is my strength.',
        scores: { Discipline: 3, Focus: 2, Achiever: 1 },
      },
      {
        id: 'b',
        text: 'I keep the big picture in mind and adjust as needed — over-planning can slow you down.',
        scores: { Strategic: 3, Activator: 2, Futuristic: 1 },
      },
      {
        id: 'c',
        text: 'I rely on my team leads to manage their areas while I focus on key decisions.',
        scores: { Command: 3, Developer: 2, Arranger: 1 },
      },
      {
        id: 'd',
        text: 'I make sure everyone knows their role and check in regularly to ensure accountability.',
        scores: { Responsibility: 3, Consistency: 2, Discipline: 1 },
      },
    ],
  },
  {
    id: 22,
    theme: 'Discipline',
    question: 'A district event timeline keeps getting delayed by various team members. What\'s your reaction?',
    options: [
      {
        id: 'a',
        text: 'I enforce deadlines strictly — discipline is non-negotiable when others are counting on us.',
        scores: { Discipline: 3, Command: 2, Consistency: 1 },
      },
      {
        id: 'b',
        text: 'I understand the reasons for delays and adjust the timeline realistically.',
        scores: { Empathy: 3, Arranger: 2, Deliberative: 1 },
      },
      {
        id: 'c',
        text: 'I identify the bottleneck and reallocate resources to fix it.',
        scores: { Analytical: 3, Arranger: 2, Strategic: 1 },
      },
      {
        id: 'd',
        text: 'I motivate the team with the bigger vision — remind them why this event matters.',
        scores: { Communication: 3, Futuristic: 2, Activator: 1 },
      },
    ],
  },

  // ── EMPATHY (Q23, Q24) ─────────────────────────────────────────
  {
    id: 23,
    theme: 'Empathy',
    question: 'A fellow district team member seems disengaged and withdrawn during meetings. What do you do?',
    options: [
      {
        id: 'a',
        text: 'I privately check in — something is clearly affecting them, and I want them to know I care.',
        scores: { Empathy: 3, Developer: 2, Connectedness: 1 },
      },
      {
        id: 'b',
        text: 'I give them space — they\'ll come around when they\'re ready.',
        scores: { Includer: 3, Empathy: 2, Deliberative: 1 },
      },
      {
        id: 'c',
        text: 'I assign them a task they\'re good at to help them re-engage.',
        scores: { Arranger: 3, Developer: 2, Maximizer: 1 },
      },
      {
        id: 'd',
        text: 'I address it directly — the team needs everyone fully present and committed.',
        scores: { Command: 3, Responsibility: 2, Discipline: 1 },
      },
    ],
  },
  {
    id: 24,
    theme: 'Empathy',
    question: 'During a heated debate between two club leaders, how do you step in?',
    options: [
      {
        id: 'a',
        text: 'I listen to both sides carefully — understanding their emotions is the first step to resolution.',
        scores: { Empathy: 3, Connectedness: 2, Communication: 1 },
      },
      {
        id: 'b',
        text: 'I call for order and present the facts neutrally.',
        scores: { Command: 3, Analytical: 2, Consistency: 1 },
      },
      {
        id: 'c',
        text: 'I redirect the energy toward finding a solution that benefits the district.',
        scores: { Strategic: 3, Focus: 2, Maximizer: 1 },
      },
      {
        id: 'd',
        text: 'I remind them of our shared purpose — we\'re on the same team.',
        scores: { Connectedness: 3, Communication: 2, Includer: 1 },
      },
    ],
  },

  // ── FOCUS (Q25, Q26) ───────────────────────────────────────────
  {
    id: 25,
    theme: 'Focus',
    question: 'You have multiple district initiatives running simultaneously. How do you manage your attention?',
    options: [
      {
        id: 'a',
        text: 'I prioritize ruthlessly — I identify the top 2-3 that matter most and give them my full energy.',
        scores: { Focus: 3, Strategic: 2, Achiever: 1 },
      },
      {
        id: 'b',
        text: 'I thrive on multitasking — I can keep all plates spinning effectively.',
        scores: { Arranger: 3, Activator: 2, Achiever: 1 },
      },
      {
        id: 'c',
        text: 'I delegate well so each initiative has a capable point person.',
        scores: { Developer: 3, Command: 2, Arranger: 1 },
      },
      {
        id: 'd',
        text: 'I set up regular check-ins and tracking systems to stay on top of everything.',
        scores: { Discipline: 3, Responsibility: 2, Analytical: 1 },
      },
    ],
  },
  {
    id: 26,
    theme: 'Focus',
    question: 'An exciting but unrelated opportunity comes up during a critical project phase. What do you do?',
    options: [
      {
        id: 'a',
        text: 'I park it — right now, the current project needs my undivided attention.',
        scores: { Focus: 3, Discipline: 2, Responsibility: 1 },
      },
      {
        id: 'b',
        text: 'I explore it — great opportunities don\'t wait, and I can manage both.',
        scores: { Activator: 3, Ideation: 2, Achiever: 1 },
      },
      {
        id: 'c',
        text: 'I delegate the new opportunity to someone capable while I stay on track.',
        scores: { Arranger: 3, Developer: 2, Strategic: 1 },
      },
      {
        id: 'd',
        text: 'I evaluate if it\'s strategically more valuable than the current project.',
        scores: { Strategic: 3, Analytical: 2, Maximizer: 1 },
      },
    ],
  },

  // ── FUTURISTIC (Q27, Q28) ─────────────────────────────────────
  {
    id: 27,
    theme: 'Futuristic',
    question: 'When you think about your district\'s future, what excites you most?',
    options: [
      {
        id: 'a',
        text: 'The vision of what Rotaract could become in 5 years if we make the right moves today.',
        scores: { Futuristic: 3, Strategic: 2, Achiever: 1 },
      },
      {
        id: 'b',
        text: 'Building stronger clubs that sustain themselves beyond any single leader\'s tenure.',
        scores: { Developer: 3, Responsibility: 2, Futuristic: 1 },
      },
      {
        id: 'c',
        text: 'Creating a legacy of impactful community projects that people remember.',
        scores: { Achiever: 3, Connectedness: 2, Maximizer: 1 },
      },
      {
        id: 'd',
        text: 'Establishing systems and traditions that become the standard for future teams.',
        scores: { Discipline: 3, Consistency: 2, Futuristic: 1 },
      },
    ],
  },
  {
    id: 28,
    theme: 'Futuristic',
    question: 'How do you make decisions about long-term district projects?',
    options: [
      {
        id: 'a',
        text: 'I think about the end goal first and work backwards to plan the steps.',
        scores: { Futuristic: 3, Strategic: 2, Focus: 1 },
      },
      {
        id: 'b',
        text: 'I base decisions on what worked in the past and build on proven approaches.',
        scores: { Analytical: 3, Consistency: 2, Deliberative: 1 },
      },
      {
        id: 'c',
        text: 'I consult with the broader team to get diverse perspectives.',
        scores: { Includer: 3, Empathy: 2, Connectedness: 1 },
      },
      {
        id: 'd',
        text: 'I focus on what will create the most impact and eliminate everything else.',
        scores: { Maximizer: 3, Focus: 2, Strategic: 1 },
      },
    ],
  },

  // ── IDEATION (Q29, Q30) ────────────────────────────────────────
  {
    id: 29,
    theme: 'Ideation',
    question: 'The district needs a fresh approach to increase club engagement. How do you contribute?',
    options: [
      {
        id: 'a',
        text: 'I brainstorm 10 ideas quickly — even wild ones — because the best ideas often start unconventional.',
        scores: { Ideation: 3, Activator: 2, Futuristic: 1 },
      },
      {
        id: 'b',
        text: 'I research what other districts and organizations are doing successfully.',
        scores: { Analytical: 3, Strategic: 2, Deliberative: 1 },
      },
      {
        id: 'c',
        text: 'I ask club members directly what they want — the answer lies with them.',
        scores: { Empathy: 3, Includer: 2, Communication: 1 },
      },
      {
        id: 'd',
        text: 'I take one proven concept and refine it to perfection.',
        scores: { Maximizer: 3, Focus: 2, Discipline: 1 },
      },
    ],
  },
  {
    id: 30,
    theme: 'Ideation',
    question: 'In team brainstorming sessions, what role do you naturally take?',
    options: [
      {
        id: 'a',
        text: 'The idea generator — I connect dots others don\'t see and propose creative solutions.',
        scores: { Ideation: 3, Communication: 2, Strategic: 1 },
      },
      {
        id: 'b',
        text: 'The evaluator — I help the team separate great ideas from impractical ones.',
        scores: { Analytical: 3, Deliberative: 2, Consistency: 1 },
      },
      {
        id: 'c',
        text: 'The facilitator — I make sure everyone\'s voice is heard.',
        scores: { Includer: 3, Empathy: 2, Communication: 1 },
      },
      {
        id: 'd',
        text: 'The executor — I\'m already thinking about how to implement what\'s being discussed.',
        scores: { Activator: 3, Achiever: 2, Arranger: 1 },
      },
    ],
  },

  // ── INCLUDER (Q31) & MAXIMIZER (Q32) ──────────────────────────
  {
    id: 31,
    theme: 'Includer',
    question: 'New members join the district team but feel like outsiders among experienced members. What do you do?',
    options: [
      {
        id: 'a',
        text: 'I personally welcome them, introduce them to everyone, and make sure they\'re included in all discussions.',
        scores: { Includer: 3, Empathy: 2, Communication: 1 },
      },
      {
        id: 'b',
        text: 'I assign them a buddy from the experienced team to help them settle in.',
        scores: { Arranger: 3, Developer: 2, Connectedness: 1 },
      },
      {
        id: 'c',
        text: 'I give them a visible responsibility early on so they feel valued.',
        scores: { Developer: 3, Command: 2, Activator: 1 },
      },
      {
        id: 'd',
        text: 'I trust them to find their footing — capable people adapt quickly.',
        scores: { Achiever: 3, Focus: 2, Strategic: 1 },
      },
    ],
  },
  {
    id: 32,
    theme: 'Maximizer',
    question: 'A district project is good but not great. The deadline is tomorrow. What do you do?',
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
        text: 'I identify the one or two things that will make the biggest quality difference and fix only those.',
        scores: { Strategic: 3, Focus: 2, Analytical: 1 },
      },
      {
        id: 'd',
        text: 'I rally the team for a final push — together we can elevate it tonight.',
        scores: { Command: 3, Includer: 2, Connectedness: 1 },
      },
    ],
  },
];

module.exports = ASSESSMENT_QUESTIONS;
