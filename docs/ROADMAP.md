# Phased Roadmap
## India's Skill Intelligence Network

---

## Overview Timeline

```
Validation    Phase 1          Phase 2            Phase 3            Post-MVP
(Pre-build)   Prototype        Closed Beta        Recruiter Launch   Growth
───────────┬──────────────┬─────────────────┬──────────────────┬────────────────
Week -2     Week 1-4       Week 5-8           Week 9-12          Month 4-6+
2 weeks     4 weeks        4 weeks            4 weeks            Ongoing
───────────┴──────────────┴─────────────────┴──────────────────┴────────────────
```

---

## Phase 0: Validation (2 Weeks Before Build)

**Timeline:** 2 weeks  
**People:** All founders  
**Cost:** < ₹500

### Objectives
- [ ] Validate candidate demand (30+ interested)
- [ ] Validate recruiter demand (5+ "I'd use this")
- [ ] Validate task generation quality (50 tasks self-tested)
- [ ] Validate AI scoring accuracy (>80% agreement with human)
- [ ] Validate code sandbox security

### Deliverables
- GO/NO-GO decision with data
- Refined PRD based on feedback
- First 20-30 candidate contacts (beta list)
- First 5-10 recruiter contacts

### Exit Criteria
All GREEN signals from validation matrix → proceed to Phase 1.

**See [VALIDATION-PLAN.md](VALIDATION-PLAN.md) for full details.**

---

## Phase 1: Prototype (Weeks 1-4)

**Timeline:** 4 weeks  
**People:** 2 developers + 1 founder (BD)  
**Monthly Burn:** ~₹2,000 (infra only)

### Goal
Working product where a candidate can complete tasks and get a Skill Passport.  
Recruiter side is NOT built yet.

### Week 1: Foundation
| Task | Owner | Done When |
|------|-------|-----------|
| Set up monorepo (Next.js + FastAPI) | Dev 1 | Local dev environment runs |
| PostgreSQL schema v1 (users, tasks, submissions) | Dev 1 | Migrations run, tables created |
| User auth: email signup + Google OAuth | Dev 2 | Login/signup works end-to-end |
| Basic UI shell: landing, auth, dashboard pages | Dev 2 | Navigation works |
| Deploy frontend (Vercel) + backend (Railway) | Dev 1 | Staging URLs live |

### Week 2: Task Engine
| Task | Owner | Done When |
|------|-------|-----------|
| LLM prompt engineering (3 task types) | Dev 1 | Tasks generate reliably via API |
| Task parameterization (unique per user) | Dev 1 | No two users get identical tasks |
| Task assignment API (POST /tasks/generate) | Dev 1 | API returns 3 tasks per user |
| Monaco code editor integration | Dev 2 | Code editor loads in browser |
| Task UI: problem statement panel + editor + submit button | Dev 2 | Full task page works |

### Week 3: Evaluation Pipeline
| Task | Owner | Done When |
|------|-------|-----------|
| Code sandbox setup (Judge0 on Railway) | Dev 1 | User code runs safely |
| Test case runner (hidden tests) | Dev 1 | Correctness scoring automated |
| LLM evaluation (code quality + approach) | Dev 1 | AI scores generated per submission |
| Score aggregation logic | Dev 1 | Final score calculated correctly |
| Submission UI: submit → loading → results | Dev 2 | Candidate sees scores after submit |

### Week 4: Skill Passport + Polish
| Task | Owner | Done When |
|------|-------|-----------|
| Basic anti-cheat (paste + tab tracking) | Dev 1 | Behavior events collected, trust score calculated |
| Skill Passport page (public profile) | Dev 2 | Beautiful page with scores breakdown |
| Shareable link generation | Dev 2 | `/passport/{slug}` works publicly |
| Candidate dashboard (task status + passport) | Dev 2 | Clear progress view |
| Bug fixes + edge cases | Both | System stable for 10 concurrent users |

### Phase 1 Deliverables
- [ ] End-to-end flow: Signup → Generate Tasks → Solve → Submit → Scores → Passport
- [ ] Public shareable passport links
- [ ] Basic anti-cheat trust scoring
- [ ] Deployed on staging environment
- [ ] Tested with 5 internal users (founders + friends)

### Phase 1 Success Metrics
| Metric | Target |
|--------|--------|
| Internal testers complete full flow | 5/5 |
| No critical bugs blocking flow | 0 blockers |
| Task generation success rate | >95% |
| Evaluation completes within 30 sec | >90% of subs |

---

## Phase 2: Closed Beta (Weeks 5-8)

**Timeline:** 4 weeks  
**People:** 2 developers + 1 founder (BD)  
**Monthly Burn:** ~₹5,000 (increased API usage)

### Goal
50-100 real candidates use the platform. Recruiter side gets basic functionality.  
Collect feedback, fix bugs, calibrate AI scoring.

### Week 5: Beta Launch Prep
| Task | Owner | Done When |
|------|-------|-----------|
| Invite first 30 candidates from validation list | Founder | 30 accounts created |
| Monitor first 10 submissions closely | Dev 1 | Issues caught and fixed fast |
| Email notifications (task assigned, scores ready) | Dev 1 | Basic emails working |
| "Share on LinkedIn" button on passport | Dev 2 | One-click sharing |
| Landing page v2 (marketing-ready) | Dev 2 | Good first impression |

### Week 6: Recruiter MVP
| Task | Owner | Done When |
|------|-------|-----------|
| Recruiter signup flow | Dev 2 | Separate role for recruiter accounts |
| Basic candidate search page | Dev 2 | Filter by score, location, year |
| Candidate list view (cards with scores) | Dev 2 | Browsable results |
| Click-through to public passport | Dev 2 | Full loop: search → view passport |
| Shortlist feature (save candidates) | Dev 2 | Recruiters can bookmark |

### Week 7: Iteration
| Task | Owner | Done When |
|------|-------|-----------|
| Fix top 5 issues from beta feedback | Both | Key problems resolved |
| AI scoring calibration (compare with human on 30 subs) | Dev 1 | Accuracy >80% verified |
| Performance optimization (page load, eval speed) | Dev 1 | P95 < 2 sec load, < 30 sec eval |
| Add score feedback text to passport | Dev 2 | Candidates see why they got their score |
| Anti-cheat review of flagged submissions | Founder | Manual review process tested |

### Week 8: Growth Prep
| Task | Owner | Done When |
|------|-------|-----------|
| Reach out to 10 college coding clubs | Founder | 5+ partnerships confirmed |
| Onboard 5 recruiters manually (video calls) | Founder | 5 recruiter accounts active |
| Collect testimonials from happy beta users | Founder | 3+ written testimonials |
| Simple admin panel (view submissions, flags) | Dev 1 | Founders can monitor platform |
| Analytics tracking (PostHog events) | Dev 2 | Key events tracked |

### Phase 2 Deliverables
- [ ] 50-100 candidates have taken assessments
- [ ] 30+ Skill Passports generated
- [ ] Recruiter search working with real data
- [ ] 5+ recruiters have accounts and searched
- [ ] AI scoring calibrated and validated
- [ ] Beta feedback documented and top issues fixed
- [ ] College partnerships initiated

### Phase 2 Success Metrics
| Metric | Target |
|--------|--------|
| Candidates who complete all 3 tasks | 50+ |
| Passports generated | 30+ |
| Passport share rate | >25% |
| Recruiter accounts | 5+ |
| Recruiter search sessions | 20+ |
| AI scoring accuracy vs human | >80% |
| Task completion rate (start → all 3 done) | >55% |
| Candidate satisfaction (1-10 survey) | >7.0 |

---

## Phase 3: Recruiter Onboarding & Growth (Weeks 9-12)

**Timeline:** 4 weeks  
**People:** 2 developers + 1 founder (BD/Sales)  
**Monthly Burn:** ~₹8,000

### Goal
200+ candidates, 10+ recruiters. Validate monetization. Prepare for fundraise.

### Week 9: Scale Candidate Acquisition
| Task | Owner | Done When |
|------|-------|-----------|
| Launch on r/developersIndia, r/india | Founder | Posts get 50+ upvotes |
| LinkedIn content campaign (founder posts) | Founder | 5+ posts published |
| College coding club activations (5 colleges) | Founder | 100+ signups from colleges |
| Referral mechanism: "Share your passport, get early access to v2" | Dev 2 | Refer a friend flow works |

### Week 10: Recruiter Sales Sprint
| Task | Owner | Done When |
|------|-------|-----------|
| Personal outreach to 50 HR professionals | Founder | 50 emails/DMs sent |
| Recruiter onboarding video (3 min demo) | Founder | Async onboarding possible |
| Recruiter feedback collection | Founder | Detailed notes from 5+ recruiters |
| Implement top recruiter feature request | Dev 2 | One key improvement shipped |
| Payment intent survey: "Would you pay ₹X?" | Founder | Clear signal from 5+ recruiters |

### Week 11: Polish & Defensibility
| Task | Owner | Done When |
|------|-------|-----------|
| LinkedIn embeddable badge for passports | Dev 2 | Candidates add badge to LinkedIn |
| Score comparison view (percentile ranking) | Dev 2 | "You scored higher than 72% of candidates" |
| Anti-cheat improvements based on real data | Dev 1 | Better detection of flagged patterns |
| Evaluation pipeline hardening | Dev 1 | Handle edge cases, failures gracefully |
| Data export for pitch deck metrics | Dev 1 | All KPIs queryable |

### Week 12: Fundraise Prep
| Task | Owner | Done When |
|------|-------|-----------|
| Compile all metrics into pitch deck | Founder | Deck ready |
| Record demo video (2 min product walkthrough) | Founder | Video ready |
| Write investor memo (1 pager) | Founder | Memo ready |
| Identify and apply to 10 accelerators/angels | Founder | Applications submitted |
| System hardening: error monitoring, backups | Dev 1 | Production-ready stability |

### Phase 3 Deliverables
- [ ] 200+ candidates assessed
- [ ] 100+ Skill Passports live
- [ ] 10+ recruiter accounts searching
- [ ] Monetization hypothesis validated (payment intent)
- [ ] Pitch deck with real metrics
- [ ] Platform stable and monitored
- [ ] College partnerships producing inflow

### Phase 3 Success Metrics
| Metric | Target |
|--------|--------|
| Total candidate signups | 500+ |
| Passports generated | 200+ |
| Passport share rate | >30% |
| Recruiter accounts | 15+ |
| Recruiter search sessions | 50+ |
| Recruiter shortlist actions | 20+ |
| Positive recruiter payment intent | 3+ "I'd pay" |
| Candidate NPS | >40 |
| Platform uptime | >99% |

---

## Post-MVP Roadmap (Month 4-6)

**Only if Phase 3 metrics are GREEN.**

| Quarter | Focus | Key Features |
|---------|-------|-------------|
| Month 4 | Monetize | Recruiter subscription plan, payment integration |
| Month 4 | Expand Skills | Add JavaScript/Node.js tasks |
| Month 5 | Expand Roles | Frontend developer Skill Passport |
| Month 5 | AI Interview | Basic technical interview simulator |
| Month 5 | Integrations | LinkedIn badge API, ATS export |
| Month 6 | Scale | Multiple programming languages |
| Month 6 | Intelligence | Skill gap analysis, learning recommendations |
| Month 6 | Enterprise | Company accounts with team management |

---

## Resource Planning

### Phase 1 (Prototype)
```
Dev 1 (Backend/AI):  40h/week × 4 weeks = 160 hours
Dev 2 (Full-stack):  40h/week × 4 weeks = 160 hours
Founder (BD):        20h/week × 4 weeks = 80 hours
Total: 400 hours
```

### Phase 2 (Closed Beta)
```
Dev 1: 40h × 4 = 160 hours
Dev 2: 40h × 4 = 160 hours
Founder: 30h × 4 = 120 hours (more outreach)
Total: 440 hours
```

### Phase 3 (Growth)
```
Dev 1: 35h × 4 = 140 hours (less new features, more hardening)
Dev 2: 35h × 4 = 140 hours
Founder: 40h × 4 = 160 hours (mostly sales + fundraise)
Total: 440 hours
```

---

## Decision Points

| When | Decision | Data Needed |
|------|----------|-------------|
| End of Validation | Build or Pivot | Candidate/recruiter interest, task quality |
| End of Phase 1 | Launch beta or iterate prototype | Internal test results |
| End of Phase 2 | Scale up or fix fundamentals | Beta metrics, candidate feedback |
| End of Phase 3 | Fundraise or bootstrap | Revenue signal, growth metrics |
