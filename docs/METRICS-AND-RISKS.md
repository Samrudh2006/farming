# Metrics, Risks & Success Criteria
## India's Skill Intelligence Network — MVP

---

## Part 1: Measurable Success Metrics

### North Star Metric
**Passports Generated** — Number of candidates who complete all 3 tasks and receive a Skill Passport.

This single metric captures:
- User acquisition (they signed up)
- Product engagement (they completed all tasks)
- Product value (they got something useful)

### Primary Metrics (Track Weekly)

| Metric | Definition | 3-Month Target | Why It Matters |
|--------|-----------|----------------|----------------|
| **Passports Generated** | Candidates with all 3 tasks scored | **200+** | Core product delivered |
| **Task Completion Rate** | % who finish all 3 tasks after starting | **>60%** | Product stickiness |
| **Passport Share Rate** | % who share their passport link | **>30%** | Virality / perceived value |
| **Recruiter Signups** | Unique recruiter accounts | **10+** | Demand side traction |
| **Recruiter Search Sessions** | Times a recruiter searches candidates | **50+** | Demand side engagement |
| **AI Scoring Accuracy** | % agreement between AI and human scores (on sample) | **>80%** | Product reliability |

### Secondary Metrics (Track Monthly)

| Metric | Definition | 3-Month Target |
|--------|-----------|----------------|
| Candidate Signups | Total registered candidates | 500+ |
| Time to Complete Task | Average minutes per task | 20-40 min |
| Code Submission Rate | % of assigned tasks that get submitted | >75% |
| Passport View Count | Total views across all passports | 500+ |
| Recruiter→Shortlist Rate | % of recruiter searches → shortlist action | >10% |
| Trust Score Distribution | % high / medium / low trust | 80/15/5 |
| Candidate NPS | Net Promoter Score survey | >40 |
| Page Load Time | P95 load time | <2 sec |
| Evaluation Latency | P95 time from submit to score | <30 sec |

### Metrics That Don't Matter Yet (Ignore for MVP)
- Revenue (not monetizing yet)
- Daily Active Users (not a daily product)
- Retention / WAU (too early)
- App Store ratings (no app)
- Social media followers (vanity)

---

## Part 2: KPI Dashboard (What to Build)

For MVP, don't build a dashboard. Use SQL queries.

```sql
-- Weekly metrics query (run every Monday)

-- 1. Passports generated this week
SELECT COUNT(*) FROM skill_passports 
WHERE generated_at > NOW() - INTERVAL '7 days';

-- 2. Task completion rate
SELECT 
  COUNT(*) FILTER (WHERE all_done) * 100.0 / COUNT(*) AS completion_rate
FROM (
  SELECT user_id, 
    COUNT(*) FILTER (WHERE status = 'submitted') = 3 AS all_done
  FROM tasks GROUP BY user_id
) t;

-- 3. Average scores
SELECT 
  AVG(overall_score) AS avg_score,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY overall_score) AS median_score
FROM skill_passports;

-- 4. Recruiter engagement
SELECT COUNT(DISTINCT recruiter_id) AS active_recruiters,
       COUNT(*) AS total_searches
FROM recruiter_actions 
WHERE action_type = 'view_passport'
AND created_at > NOW() - INTERVAL '7 days';

-- 5. Trust distribution
SELECT trust_level, COUNT(*), 
       ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 1) AS pct
FROM skill_passports GROUP BY trust_level;
```

Export to Google Sheets weekly until you have enough users to justify a real dashboard.

---

## Part 3: Technical Risks

### CRITICAL RISKS (Can Kill the Product)

#### Risk 1: LLM Generates Unsolvable / Bad Tasks
- **Probability:** HIGH (will happen in first 50 tasks)
- **Impact:** CRITICAL (candidates rage-quit, trust destroyed)
- **Detection:** Task completion rate drops below 40%
- **Mitigation:**
  1. **Week 1-2:** Founders solve every task type manually before releasing to users
  2. Create a bank of 10 human-verified "template" tasks as fallback
  3. Add task difficulty validator: if LLM generates task, also ask LLM "rate this task's difficulty 1-10" and reject >7
  4. First 100 candidates get manual task review within 12 hours
  5. Add "Report Problem" button on task page
- **Cost to Fix:** Low (prompt engineering + fallback bank)

#### Risk 2: AI Scoring Disagrees With Human Judgment
- **Probability:** MEDIUM-HIGH
- **Impact:** CRITICAL (platform loses credibility)
- **Detection:** Candidates complain; manual audit shows >20% disagreement
- **Mitigation:**
  1. **Pre-launch:** Score 50 submissions manually, compare with AI, tune prompts
  2. Weight correctness heavily (40%) — test cases are objective
  3. Show score breakdown so candidates can see what's behind the number
  4. Add "Request Review" button (manual review by founding team)
  5. Track AI vs human disagreement rate continuously
- **Cost to Fix:** Medium (ongoing calibration effort)

#### Risk 3: Code Sandbox Security Breach
- **Probability:** LOW-MEDIUM
- **Impact:** CRITICAL (server compromise)
- **Detection:** Unusual server behavior, resource spikes
- **Mitigation:**
  1. Use Judge0 (battle-tested by thousands of platforms)
  2. Docker container: no network, 256MB RAM, 10s timeout, read-only filesystem
  3. Never run user code on the main server process
  4. Separate sandbox service from main backend
  5. Monitor resource usage with alerts
- **Cost to Fix:** Low (already using containerization)

### HIGH RISKS (Can Slow Growth)

#### Risk 4: Candidates Don't Trust AI Scoring
- **Probability:** HIGH (natural skepticism)
- **Impact:** HIGH (low completion rate, bad word-of-mouth)
- **Mitigation:**
  1. Show detailed score breakdown (not just a number)
  2. Show which test cases passed/failed
  3. Show LLM's written feedback (not just scores)
  4. Display trust score with explanation
  5. Position as "AI-assisted evaluation" not "AI judge"
  6. Offer human review for top 10% candidates (manual, by founders)

#### Risk 5: Not Enough Candidates (Supply Side)
- **Probability:** MEDIUM
- **Impact:** HIGH (recruiters have no one to search)
- **Mitigation:**
  1. Focus 80% of effort on candidate acquisition first
  2. Partner with 5-10 college coding clubs
  3. Make passport genuinely useful (LinkedIn badge, shareable link)
  4. Create content: "How I got my Skill Passport" case studies
  5. Delay recruiter features until 200+ passports exist

#### Risk 6: Not Enough Recruiters (Demand Side)  
- **Probability:** MEDIUM
- **Impact:** HIGH (no business model validation)
- **Mitigation:**
  1. Don't focus on this until 200+ passports
  2. Founder personally emails/calls 50 HR professionals
  3. Offer free access forever for first 20 recruiter accounts
  4. Show live anonymized passport stats to demonstrate data quality
  5. Ask: "Would you pay ₹200 to see this candidate's contact info?"

#### Risk 7: LLM API Costs Exceed Budget
- **Probability:** LOW (at MVP scale)
- **Impact:** MEDIUM (could run out of money)
- **Mitigation:**
  1. GPT-4o-mini is already cheapest ($0.005/candidate)
  2. Set hard spending limit on OpenAI ($50/month)
  3. Cache and reuse task templates (generate variations, not brand new)
  4. Batch evaluation calls (3 tasks → 1 LLM call)
  5. Alert if daily spend > $2

### MEDIUM RISKS (Annoying but Survivable)

#### Risk 8: Monaco Editor Performance on Low-End Devices
- **Probability:** MEDIUM (India Tier-2/3 = low-end laptops)
- **Impact:** MEDIUM (poor UX, can't type code)
- **Mitigation:** Test on 4GB RAM Chrome; fallback to plain textarea if Monaco crashes

#### Risk 9: Plagiarism/Cheating Gets Through
- **Probability:** HIGH (guaranteed)
- **Impact:** MEDIUM (some bad scores in database)
- **Mitigation:** Trust score system + manual review of flagged submissions

#### Risk 10: Platform Goes Down During Peak Usage (College Events)
- **Probability:** MEDIUM
- **Impact:** MEDIUM (embarrassing, lost users)
- **Mitigation:** Rate limiting, queue-based evaluation, graceful degradation

---

## Part 4: Risk Monitoring Plan

| Risk | Signal to Watch | Alert Threshold | Action |
|------|----------------|-----------------|--------|
| Bad tasks | Task completion rate | < 40% | Pause generation, use fallback bank |
| Bad scoring | Manual audit disagreement | > 25% | Retune prompts, add guardrails |
| Sandbox breach | Server CPU/memory spikes | > 90% for 5 min | Kill sandbox, investigate |
| Low trust | Candidate NPS | < 20 | Survey users, add transparency features |
| Cost overrun | Daily OpenAI spend | > $2/day | Switch to cached templates |
| Downtime | Uptime monitor | Response > 5 sec | Restart service, investigate |

---

## Part 5: What "Success" Looks Like at 3 Months

### Best Case (Raise Seed Round)
- 500+ candidates, 200+ passports
- 20+ recruiter accounts
- 3+ recruiters say "I'd pay for this"
- AI scoring accuracy >85% vs human
- Clear viral loop (30%+ share rate)
- Founder has pitch deck with real data

### Good Case (Continue Building)
- 200+ candidates, 100+ passports
- 10+ recruiter accounts
- 1+ recruiter expresses payment intent
- AI scoring accuracy >75%
- Users report positive experience

### Bad Case (Pivot)
- <50 completed passports
- <3 recruiter signups
- Candidates report scoring is "unfair"
- No recruiter engagement with search feature
- Task quality consistently poor

### Dead Case (Shut Down)
- <20 signups total
- Candidates refuse to complete tasks
- Zero recruiter interest after 50+ outreach attempts
- Technical infrastructure keeps breaking
