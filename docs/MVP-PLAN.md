# 3-Month Brutal MVP Plan
## India's Skill Intelligence Network

**Constraint:** 3 months runway, 2-4 people, low budget  
**Philosophy:** Ship something real users touch in 6 weeks. Iterate for 6 more.

---

## The Brutal Truth

You have 90 days. That means:
- **12 weeks of actual work** (minus context-switching, debugging, life)
- **~8 weeks of productive output** realistically
- You need paying/active users by Week 10 or you're dead

---

## What EXACTLY We Build

### Week 1-2: Foundation (The Boring Stuff)
**Goal:** Deployable skeleton with auth

| Task | Owner | Output |
|------|-------|--------|
| Set up monorepo (Next.js + FastAPI) | Dev 1 | Running local dev environment |
| User auth (email + Google OAuth) | Dev 1 | Login/signup working |
| PostgreSQL schema + migrations | Dev 2 | Core tables created |
| Basic UI shell (landing, dashboard, auth pages) | Dev 2 | Navigable frontend |
| Deploy to Railway/Render | Dev 1 | Live staging URL |
| Domain + SSL setup | Anyone | isin.dev or similar |

### Week 3-4: Task Engine (The Core IP)
**Goal:** AI generates unique coding tasks, candidate can solve them

| Task | Owner | Output |
|------|-------|--------|
| LLM prompt engineering for task generation | Dev 1 | 3 task types generating reliably |
| Task parameterization (unique per user) | Dev 1 | No two users get same task |
| Monaco code editor integration | Dev 2 | Browser code editor working |
| Code sandbox (Docker-based execution) | Dev 1 | Safe code execution |
| Test case runner | Dev 1 | Automated correctness checking |
| Task UI (problem statement → editor → submit) | Dev 2 | Full candidate task flow |
| **Manual QA: Generate 50 tasks, solve them yourself** | Both | Validated task quality |

### Week 5-6: AI Evaluation + Skill Passport
**Goal:** Submissions scored, passport generated

| Task | Owner | Output |
|------|-------|--------|
| AI scoring pipeline (correctness + quality + approach) | Dev 1 | Automated scores for submissions |
| Score aggregation logic | Dev 1 | Overall skill score calculated |
| Skill Passport page (public profile) | Dev 2 | Beautiful shareable page |
| Shareable link generation | Dev 2 | `isin.dev/passport/{id}` works |
| Basic anti-cheat (copy-paste, tab-switch) | Dev 1 | Trust score assigned |
| **Human calibration: Score 30 submissions manually, compare with AI** | Both | AI accuracy validated |

### Week 7-8: Recruiter Side + Polish
**Goal:** Recruiters can search candidates

| Task | Owner | Output |
|------|-------|--------|
| Recruiter signup flow | Dev 2 | Separate recruiter accounts |
| Candidate search/filter page | Dev 2 | Search by score, location |
| Candidate list + passport preview | Dev 2 | Recruiter can browse |
| Email notifications (passport ready, recruiter viewed) | Dev 1 | Basic email flow |
| Landing page (marketing) | Dev 2 | Conversion-ready homepage |
| Bug fixes + performance | Dev 1 | Stable system |

### Week 9-10: Beta Launch + Acquire Users
**Goal:** 100 candidates on platform, 5 recruiters

| Task | Owner | Output |
|------|-------|--------|
| Reach out to 10 college coding clubs | Founder | Distribution partnerships |
| Post on LinkedIn, Twitter, Reddit (r/india, r/developersIndia) | Founder | Organic traffic |
| Direct message 50 HR professionals | Founder | Recruiter pipeline |
| Monitor submissions, fix scoring bugs | Dev 1 | Improved accuracy |
| Collect feedback from first 20 candidates | Both | User insight |

### Week 11-12: Iterate + Prepare for Fundraise
**Goal:** 200 candidates, 10 recruiters, metrics for pitch deck

| Task | Owner | Output |
|------|-------|--------|
| Fix top 5 user-reported issues | Dev 1 | Better UX |
| Add LinkedIn badge/embed | Dev 2 | Viral loop |
| Analytics dashboard (internal) | Dev 1 | Track all metrics |
| Compile metrics for pitch deck | Founder | Data-backed story |
| Create pitch deck | Founder | Ready for fundraise |

---

## What We IGNORE (Completely)

| Feature | Why We Ignore It |
|---------|-----------------|
| AI Interview Simulator | 3 months of work by itself; not core value prop |
| Voice/Video Evaluation | Requires speech-to-text, NLP pipelines — way too expensive |
| Communication Scoring | Subjective, hard to validate, not what recruiters search for |
| Behavioral Signal Analysis | Research project, not startup feature |
| Skill Streaks/Gamification | Nice UX but zero impact on core value |
| Adaptive Difficulty Engine | Premature optimization; fixed difficulty is fine |
| Multiple Languages | Python only. Period. |
| Multiple Roles | Backend dev only. Period. |
| Mobile App | Responsive web handles mobile |
| Real-time Skill Graph | Static score works. Graph is marketing fluff right now |
| GD Simulation | Completely irrelevant for backend dev hiring |
| Payment/Billing | No monetization in MVP |
| Multi-tenant Recruiter Orgs | Single recruiter accounts only |

---

## What We FAKE Manually

| Feature | How We Fake It |
|---------|---------------|
| "AI Match Engine" | Founder manually emails matching candidates to recruiters |
| "Quality Assurance" | Founding team reviews flagged submissions manually |
| "Customer Support" | WhatsApp group for beta users |
| "Task Quality Control" | Founders solve every generated task type before releasing |
| "Recruiter Onboarding" | Personal video call + screen share, not self-serve |
| "Fraud Detection" | Manual review of low trust-score submissions |
| "Analytics Dashboard" | SQL queries on production DB + Google Sheets |
| "Email Templates" | Plain text emails from founder's Gmail |

---

## Resource Allocation

### Team of 3 (Ideal MVP Team)
| Person | Role | Focus |
|--------|------|-------|
| Founder | CEO + BD | User acquisition, recruiter sales, fundraise |
| Dev 1 | Backend + AI | Task engine, evaluation pipeline, infra |
| Dev 2 | Full-stack + Frontend | UI, user flows, recruiter dashboard |

### Team of 2 (Minimum Viable Team)
| Person | Role | Focus |
|--------|------|-------|
| Founder/Dev 1 | CEO + Backend + AI | Everything backend + business |
| Dev 2 | Full-stack | Everything frontend + some backend |

---

## Budget Breakdown (3 Months)

| Item | Monthly Cost | 3-Month Total |
|------|-------------|---------------|
| Railway/Render hosting | ₹2,000 | ₹6,000 |
| PostgreSQL (managed) | ₹0 (free tier) | ₹0 |
| OpenAI API (GPT-4o-mini) | ₹5,000 | ₹15,000 |
| Domain + SSL | ₹1,000 | ₹1,000 |
| Email (Resend/Postmark) | ₹0 (free tier) | ₹0 |
| Docker sandbox (self-hosted) | ₹0 (included in hosting) | ₹0 |
| Monitoring (Sentry free) | ₹0 | ₹0 |
| **Total Infra** | **~₹8,000/mo** | **~₹22,000** |

*Note: Team salaries/living expenses not included — assumed covered by savings/other income.*

---

## Decision: Monolith, Not Microservices

**For 3 months with 2-3 people, microservices = suicide.**

Build a monolith:
- Next.js frontend
- FastAPI backend (single service)
- PostgreSQL database
- Docker for code sandbox only
- Deploy as single container + DB

Split into services ONLY when you have 10x users and 2x team.

---

## Kill Criteria (When to Pivot)

If by Week 10 you don't have:
- 50+ candidates who completed all 3 tasks
- 3+ recruiters who searched the platform
- Positive signal from at least 1 recruiter ("I'd pay for this")

**Then pivot.** The core hypothesis (recruiters want AI-verified skills) is wrong.

---

## Day 1 Decisions (Make These NOW)

1. **Domain:** Buy `skillindia.dev` or `isin.dev` or `skillpassport.in`
2. **LLM:** Start with GPT-4o-mini (cheapest, fast, good enough)
3. **Hosting:** Railway (₹5/mo hobby plan to start)
4. **Auth:** NextAuth.js (Google + email)
5. **Database:** PostgreSQL on Supabase free tier or Railway
6. **Code Editor:** Monaco (same as VS Code, free)
7. **Code Sandbox:** Judge0 (open source) or custom Docker
8. **Email:** Resend free tier (3,000 emails/mo)
9. **Analytics:** PostHog free tier (self-hosted) or Mixpanel free
10. **Error Tracking:** Sentry free tier
