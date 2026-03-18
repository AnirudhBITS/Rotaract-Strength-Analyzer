# Rotaract Strength Analyzer - Project Notes

## Overview
A custom web application to recruit District Officials for the upcoming Rotary year. The app collects Expression of Interest (EOI) from Rotaractors willing to be part of the District team. It assesses their strengths using a CliftonStrengths-inspired framework and recommends suitable district postings.

---

## Tech Stack
- **Frontend:** React (Vite) — polished, interactive multi-step form
- **Backend:** Express.js (Node.js)
- **Database:** MySQL
- **Deployment:** Shared hosting

---

## Form Flow (~15 minutes total)
1. **Biodata** (~2 min) — personal and professional information
2. **Strength Assessment** (~10 min) — 32 scenario-based questions
3. **Role Preferences** (~2 min) — choose 3 preferred postings + system-suggested postings

---

## Biodata Fields
- Name
- Email
- Phone Number
- Secondary Phone Number
- Club Name
- My Rotary ID
- Age
- Date of Birth
- Profession
- Blood Group
- Willing to Donate (Yes/No)
- Address
- Past Positions
- Hobbies
- Professional Photo (upload)
- Casual Photo (upload)

---

## District Positions (~90+ positions)

### 1. Executive Leadership
- District Rotaract Representative (DRR)
- Chairperson - Rotaract Zone Institute
- Associate District Rotaract Representative & Chairperson - Annual District Rotaract Conference
- Associate District Rotaract Representative (multiple)

### 2. Administration
- District Rotaract Secretary
- Associate District Rotaract Secretary (multiple)
- Associate District Rotaract Secretary & Chairperson - Installation
- DRR Support Functions - Women Empowerment & Membership Development
- District Admin
- District Treasurer
- Associate District Treasurer

### 3. Event Management (Chairpersons)
- Chairperson - District Rotaract Assembly
- Chairperson - RYLA
- Chairperson - GRM & Home Club President
- Chairperson - PETS & SETS, Women Empowerment & Membership Development
- Chairperson - DOTS & Deputy PRO
- Chairperson - District Orientation Team

### 4. Group Management
- Group Coordinator (GC)
- Group Rotaract Representative (GRR) — 7 positions

### 5. Operations/Protocol (Sergeant-At-Arms)
- Chief Sergeant-At-Arms
- Deputy Sergeant-At-Arms (2)
- Associate Sergeant-At-Arms (7)

### 6. Service Avenues
- **Club Service:** Director, Deputy, Associates (5)
- **Community Service:** Director, Deputy, Associates (4)
- **Professional Service:** Director, Deputy, Associates (5)
- **International Service:** Director, Deputy, Associates (5)
- District Fellowship Director
- District Sports Director
- Chairperson - Blood Donation + Team (2)

### 7. Specialized
- Deputy - Membership Development + Team (2)
- Chairperson - Inter District Youth Exchange + Associates (2)

### 8. Communications & Media
- Chairperson - Editorial Board + Team
- Chairperson - Directory
- Video Editor
- PRO - Chief + Associates (6)
- Media - Head + Associates (6)
- Videography - Head
- Social Media - Head + Associates (2)
- Public Image Chairperson

---

## Position Expectations

### 1. Executive Leadership
A perfect leadership material. Must be able to envision all other categories (2-8) and know where mistakes could happen, sorting them beforehand. A 360° Rotaractor — strong motivator, communicator, visionary.

### 2. Administration
- **Secretary & Associates:** Excellent at paperwork, keen on documentation, minutes of meetings, always follows up. Should not expect recognition first hand — do anything for the team without expecting anything in return.
- **Treasurer:** Very good with numbers, transparent character to ensure money transparency.
- **Admin:** Role-based fit.

### 3. Event Management (Chairpersons)
Minified version of Executive Leaders. Must know their event inside-out — what to do, what not to do. Plan well ahead, pitch sponsorship, delegate effectively, and get events done without flaws. Should also develop youngsters through their events.

### 4. Group Management (GC & GRR)
- GC takes care of GRRs.
- Each GRR has a set of Rotaract clubs under them.
- Job: Pass district information to clubs and bring club issues to GC and core team immediately.
- Must mentor every club selflessly, nurture club leaders as good Rotaractors, and guide them on planning projects.

### 5. Operations/Protocol (Sergeant-At-Arms)
The discipline powerhouse. Responsible for all disciplinary actions in the district. Must be powerful, strong, fearless, and straightforward.

### 6. Service Avenues
Creative minds fitting respective avenues:
- **Club Service:** Fun-loving, takes creative initiatives to involve club members.
- **Community Service:** Always plans for community development.
- **Professional Service:** Focuses on self-development programmes.
- **International Service:** Keen on making connections and projects across borders.

**Key principle:** Project ideas must be impactful, ethical, and not "toxic charity." Every initiative should make a meaningful impact rather than just focusing on quantity.

### 7. Specialized
- **Membership Development:** Communicates and encourages Rotaractors on importance of being a registered RI member. Promotes Rotaract as a "5 and 8 dollar MBA programme." Focuses on member addition.
- **Women Empowerment:** Focuses on empowerment programmes for women in and outside Rotaract.
- **Youth Exchange:** Connects with people across districts and plans youth exchange programmes.

### 8. Communications & Media
- **Editorial:** Good knowledge in writing.
- **PRO:** Strong message passer and communicator.
- **Social Media:** Keen observer of trending social media, creates posts and stories accordingly.
- **Video Designer:** Skilled in video designing.

---

## CliftonStrengths Framework (16 selected themes)

### Themes Grouped by Domain

**Executing (Getting things done):**
- Achiever — Drive to accomplish
- Discipline — Order, structure, routine
- Focus — Direction, prioritization
- Responsibility — Ownership, keeping commitments
- Consistency — Fairness, equal treatment
- Deliberative — Careful decision-making

**Influencing (Taking charge & speaking up):**
- Activator — Turning thoughts into action
- Command — Taking charge, presence
- Communication — Expressing ideas clearly
- Maximizer — Transforming good to great

**Relationship Building (Holding teams together):**
- Developer — Seeing potential in others
- Empathy — Understanding others' feelings
- Includer — Making everyone feel welcome
- Connectedness — Seeing the bigger picture, linking things

**Strategic Thinking (Analyzing & making decisions):**
- Analytical — Logical, data-driven
- Futuristic — Vision for what could be
- Ideation — Creative, generating ideas
- Strategic — Seeing patterns, finding the best path

---

## Strength-to-Role Mapping

| Category | Key Strengths |
|---|---|
| Executive Leadership | Strategic, Futuristic, Command, Communication, Achiever, Deliberative, Developer, Maximizer |
| Administration | Discipline, Responsibility, Analytical, Deliberative, Focus, Consistency |
| Event Management | Arranger → Activator, Strategic, Command, Developer, Communication, Focus |
| Group Management | Developer, Empathy, Communication, Includer, Responsibility, Connectedness |
| Operations/Protocol | Command, Discipline, Responsibility, Focus, Consistency |
| Service Avenues | Ideation, Empathy, Connectedness, Includer, Achiever, Futuristic |
| Specialized | Communication, Developer, Connectedness, Includer, Activator |
| Communications & Media | Communication, Ideation, Maximizer, Focus, Strategic |

---

## Assessment Design
- **32 scenario-based questions** (2 per strength theme)
- Each question presents a situation with multiple response options
- Each response maps to 2-3 strength themes for cross-scoring
- Scoring identifies the applicant's **Top 5 strengths**
- Top 5 strengths are matched against role mapping to suggest best-fit postings
- Applicant also selects 3 preferred postings independently

---

## Features
1. **Multi-step form** with smooth transitions and real-time validation
2. **Strength scoring engine** — calculates top 5 strengths from 32 questions
3. **Role recommendation engine** — suggests 3 best-fit district postings based on strengths
4. **Admin dashboard** — view all submissions, filter, search, and perform operations
5. **Data storage** — all responses stored in MySQL with structured schema
