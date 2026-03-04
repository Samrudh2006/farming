# Product Requirements Document (PRD)
## India's Skill Intelligence Network — MVP

**Version:** 1.0  
**Date:** March 2026  
**Author:** Founding Team  
**Status:** Draft

---

## 1. Executive Summary

ISIN replaces resumes with AI-verified Skill Passports. Candidates prove their skills through unique AI-generated real-world tasks. Recruiters search verified skill scores instead of scanning keywords on PDFs.

**MVP Scope:** Backend developer hiring only. Python only. India only.

---

## 2. Problem Statement

### For Candidates (Job Seekers)
- 70%+ of Tier-2/3 college graduates in India can't prove their skills beyond a degree certificate
- Resumes are unverifiable — everyone claims "proficient in Python"
- No standardized, portable, skill-verified credential exists
- Existing assessment platforms (HackerRank, etc.) use MCQs or well-known problems that are easily gamed

### For Recruiters (Hiring Companies)
- Screening 500+ resumes per role is a massive time/cost sink
- Resume keyword matching produces 80%+ false positives
- Technical interviews are inconsistent and expensive (engineer time)
- No way to search for candidates by verified, comparable skill scores
- Campus hiring is a lottery — GPA ≠ capability

### Market Gap
No platform in India offers:
- AI-generated **unique** tasks per candidate (anti-copy)
- Multi-signal evaluation (code quality + logic + structure)
- A searchable, recruiter-facing skill score database
- A portable skill credential that improves over time

---

## 3. Target Users

### Primary: Candidate (MVP)
- **Who:** Final year / recent graduate from Tier-2/3 engineering colleges in India
- **Age:** 20-24
- **Goal:** Get a backend developer job
- **Pain:** No way to stand out; resume looks identical to 10,000 others
- **Behavior:** Active on LinkedIn, uses coding platforms, willing to invest 2-4 hours to prove skills

### Secondary: Recruiter (MVP)
- **Who:** HR/Talent acquisition at Indian IT services or startups
- **Role:** Hiring junior backend developers
- **Pain:** 500 resumes, 10 good candidates, no way to filter without expensive interviews
- **Need:** Pre-verified skill scores to shortlist directly

---

## 4. MVP Scope — What We Build

### 4.1 Candidate Flow

```
Sign Up → Choose "Backend Dev (Python)" → 
  Get 3 Unique AI-Generated Tasks →
    Task 1: API Design (build a REST endpoint)
    Task 2: Data Processing (parse/transform data)
    Task 3: Debugging (fix broken code)
  → Submit Solutions →
  → AI Evaluates (Code Quality + Correctness + Structure) →
  → Skill Passport Generated →
  → Shareable Link Created
```

### 4.2 Recruiter Flow

```
Sign Up → Browse Verified Candidates →
  Filter by: Skill Score, Location, Experience Level →
  View Skill Passport →
  Shortlist / Contact Candidate
```

### 4.3 Core Features (BUILD)

| # | Feature | Priority | Description |
|---|---------|----------|-------------|
| F1 | User Auth | P0 | Email + Google OAuth signup/login |
| F2 | Task Generation | P0 | LLM generates 3 unique tasks per user |
| F3 | Code Submission | P0 | Browser-based code editor with submission |
| F4 | AI Evaluation | P0 | Automated scoring of code submissions |
| F5 | Skill Passport | P0 | Profile page with verified scores |
| F6 | Shareable Link | P0 | Public URL for skill passport |
| F7 | Recruiter Search | P1 | Search/filter candidates by skill scores |
| F8 | Basic Anti-Cheat | P1 | Copy-paste detection, tab-switch tracking |
| F9 | Admin Dashboard | P2 | Monitor submissions, flag issues |

### 4.4 What We DO NOT Build (MVP)

| Feature | Why Not |
|---------|---------|
| AI Interview Simulator | Too complex, secondary value prop |
| Voice/Video Evaluation | Requires heavy infra, not core |
| Communication Scoring | Subjective, hard to validate |
| Behavioral Analysis | Research-heavy, not day-1 need |
| Skill Streak / Gamification | Nice-to-have, not must-have |
| Adaptive Difficulty | Overly complex for MVP |
| Multiple Role Support | Focus on one role first |
| Mobile App | Web-first, responsive is enough |
| GD Simulation | Not needed for backend dev hiring |
| Real-time Skill Graph | Static scores are enough for MVP |

---

## 5. Functional Requirements

### 5.1 Authentication
- Email/password registration with email verification
- Google OAuth login
- JWT token-based session management
- Role-based access: Candidate, Recruiter, Admin

### 5.2 Task Generation Engine
- Input: Role (Python Backend Dev) + User ID
- Output: 3 unique tasks with problem statement, constraints, expected I/O
- LLM: GPT-4o-mini or Claude Haiku (cost-optimized)
- Tasks are seeded with user-specific parameters (unique variable names, data sets, thresholds)
- Task types for MVP:
  - **API Task:** Build a REST endpoint given specifications
  - **Data Task:** Process/transform a dataset
  - **Debug Task:** Find and fix bugs in provided code
- Tasks stored in DB; never reused across users
- Time limit: 45 minutes per task

### 5.3 Code Submission & Execution
- Monaco-based browser code editor (Python only)
- Candidate writes code in browser
- Code submitted to backend
- Backend runs code in sandboxed Docker container
- Captures: stdout, stderr, execution time, memory usage
- Test cases run against submission (hidden test cases)
- Max execution time: 10 seconds per test case

### 5.4 AI Evaluation Pipeline
**Stage 1: Functional Correctness (40% weight)**
- Run hidden test cases
- Score: passed_tests / total_tests

**Stage 2: Code Quality (30% weight)**
- LLM evaluates:
  - Naming conventions
  - Code structure/readability
  - Error handling
  - Edge case handling
- Score: 0-100

**Stage 3: Solution Approach (30% weight)**
- LLM evaluates:
  - Algorithm efficiency
  - Design decisions
  - Code organization
- Score: 0-100

**Final Score** = 0.4 * Correctness + 0.3 * Quality + 0.3 * Approach

### 5.5 Skill Passport
- Auto-generated profile page after completing all 3 tasks
- Displays:
  - Overall Skill Score (0-100)
  - Breakdown: API Design, Data Processing, Debugging
  - Sub-scores: Correctness, Code Quality, Approach
  - Task completion timestamps
  - Anti-cheat trust score (high/medium/low)
- Public shareable URL: `isin.dev/passport/{user-id}`
- Embeddable badge for LinkedIn

### 5.6 Recruiter Search
- Dashboard to browse candidates
- Filters:
  - Minimum skill score
  - Individual skill breakdown
  - Location (state/city)
  - Graduation year
  - Trust score (anti-cheat confidence)
- Sort by: Overall score, Recency
- Candidate list view with quick passport preview
- Click to view full passport

### 5.7 Anti-Cheat (Basic)
- Copy-paste detection in code editor
- Tab switch / window blur event tracking
- Code similarity check across submissions (TF-IDF or embedding similarity)
- Time-per-keystroke analysis (detect bulk paste)
- Trust score: High (no flags), Medium (1-2 flags), Low (3+ flags)
- Flagged submissions reviewed by admin

---

## 6. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Page Load Time | < 2 seconds |
| Task Generation Time | < 10 seconds |
| Code Evaluation Time | < 30 seconds |
| Concurrent Users | 100 (MVP) |
| Uptime | 99% |
| Data Retention | Indefinite |
| Security | OWASP Top 10 compliance |
| Browser Support | Chrome, Firefox, Edge (latest) |

---

## 7. User Stories

### Candidate
- As a candidate, I can sign up and select "Backend Developer (Python)" as my target role
- As a candidate, I receive 3 unique coding tasks that no one else gets
- As a candidate, I can write and test code in a browser editor
- As a candidate, I can submit my solutions and see my results within 1 minute
- As a candidate, I get a Skill Passport with verified scores
- As a candidate, I can share my Skill Passport link with recruiters

### Recruiter
- As a recruiter, I can sign up for a recruiter account
- As a recruiter, I can search candidates by minimum skill score
- As a recruiter, I can filter by location and graduation year
- As a recruiter, I can view a candidate's full Skill Passport
- As a recruiter, I can shortlist candidates for follow-up

### Admin
- As an admin, I can view all submissions
- As an admin, I can flag/unflag suspicious submissions
- As an admin, I can monitor system health and usage metrics

---

## 8. Out of Scope (Post-MVP)

- Multiple programming languages
- Multiple role types (frontend, data science, DevOps...)
- AI interview simulator
- Voice/video evaluation
- Real-time adaptive difficulty
- Gamification / streaks
- Mobile native app
- Multi-language support (Hindi, etc.)
- Payment / monetization
- API for third-party integrations

---

## 9. Success Criteria (3-Month MVP)

| Metric | Target |
|--------|--------|
| Candidates who complete all 3 tasks | 200+ |
| Skill Passports generated | 200+ |
| Passport share rate | 30%+ of completions |
| Recruiter signups | 10+ |
| Recruiter search sessions | 50+ |
| Candidate NPS | > 40 |
| Task completion rate (start → finish) | > 60% |
| Average AI evaluation accuracy (vs human review) | > 80% agreement |

---

## 10. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| LLM generates bad/unsolvable tasks | High | Human review first 100 tasks; prompt engineering; fallback task bank |
| AI scoring disagrees with human judgment | High | Calibrate with 50+ human-scored samples; run both in parallel |
| Candidates don't trust AI scoring | Medium | Show score breakdown; allow feedback; human review option |
| Recruiters don't see enough candidates | High | Focus on candidate acquisition first; delay recruiter features |
| Code execution sandbox escape | High | Docker + gVisor; resource limits; network isolation |
| LLM costs blow budget | Medium | Use GPT-4o-mini; cache task templates; batch evaluations |

---

## 11. Monetization (Post-MVP, Not Built Now)

**Planned Model:** Recruiter pays per verified candidate contact (₹200-500 per unlock)  
**Why later:** Need candidate supply first. No monetization in MVP.

**Future options:**
- Premium Skill Passport (video intro, portfolio link)
- Enterprise API (bulk candidate search)
- College partnerships (campus placement integration)

---

## Appendix: Competitive Landscape

| Platform | What They Do | Our Differentiation |
|----------|-------------|---------------------|
| HackerRank | Standardized coding tests | We generate unique tasks; they reuse problems |
| HackerEarth | Assessment platform | We create portable credentials; they're per-company |
| LinkedIn | Resume-based profiles | We verify skills with tasks; they rely on self-reports |
| Triplebyte | Skill-based matching | We focus on India market; they shut down |
| Unstop | Competition platform | We build persistent skill identity; they're event-based |

**Our Moat:** Proprietary dataset of task→submission→score→hiring outcome. Every assessment makes the system smarter. This data cannot be replicated without running the platform.
