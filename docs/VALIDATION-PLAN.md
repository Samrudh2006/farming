# Validation Plan
## India's Skill Intelligence Network — Before Full Build

**Principle:** Validate the riskiest assumptions BEFORE writing production code.  
**Time:** 2-3 weeks (before the 3-month MVP clock starts).

---

## The 5 Riskiest Assumptions

| # | Assumption | If Wrong | How to Validate |
|---|-----------|----------|-----------------|
| 1 | Candidates will spend 2+ hours completing tasks for a Skill Passport | Nobody completes tasks → dead product | Concierge test with 30 students |
| 2 | LLM can generate solvable, unique, good-quality coding tasks | Tasks are broken/trivial/unsolvable | Generate 50 tasks, solve them all yourself |
| 3 | AI scoring matches human judgment (>80%) | Scores are meaningless → no trust | Score 30 submissions both ways, compare |
| 4 | Recruiters care about AI-verified skill scores | No demand side → no business | Talk to 20 recruiters, ask them to buy |
| 5 | Candidates in Tier-2/3 colleges want this product (not just IIT students) | Wrong market → pivot target audience | Survey 100 students from target colleges |

---

## Validation Sprint: Week-by-Week

### Week 0.5: Customer Discovery (Days 1-3)

**Goal:** Validate demand from BOTH sides before writing code.

#### Candidate Validation
- **Action:** DM 50 final-year CS students on LinkedIn/Twitter from Tier-2/3 colleges
- **Script:** "I'm building a platform where you complete real coding tasks and get an AI-verified Skill Passport that recruiters can search. You spend 2 hours, and you get a verified credential that replaces your resume. Would you try this?"
- **Track:** Response rate, enthusiasm level, objections
- **Pass Criteria:** 30+ say "yes" or "tell me more"

#### Recruiter Validation
- **Action:** Call/email 20 HR professionals at Indian IT companies and startups
- **Script:** "If I gave you a database of candidates with AI-verified coding skill scores — where each score shows their actual ability in API design, data processing, and debugging — would you use it to shortlist candidates instead of screening resumes?"
- **Follow-up:** "Would you pay ₹200-500 per candidate contact to access this?"
- **Track:** Interest level, willingness to pay, objections
- **Pass Criteria:** 5+ say "I'd try it" and 2+ say "I'd pay"

### Week 1: Technical Validation (Days 4-7)

**Goal:** Prove the core technology works.

#### Test 1: Task Generation Quality
```
Action:
1. Write 5 prompt templates (for each task type)
2. Generate 50 tasks using GPT-4o-mini (10 per template variation)
3. Attempt to solve each one yourself
4. Rate each: solvable(y/n), difficulty(1-5), uniqueness(1-5), clarity(1-5)

Pass Criteria:
- >90% solvable
- Average clarity > 3.5/5
- No two tasks are obviously the same
- Difficulty range: 2-4 (junior appropriate)

Estimated Time: 2-3 days (30 min per task to validate)
Estimated Cost: $2-3 in OpenAI API
```

#### Test 2: AI Scoring Accuracy
```
Action:
1. Get 10 real Python coding solutions (from friends/students)
2. Have 2 humans score each on:
   - Code quality (0-100)
   - Approach quality (0-100)
3. Get GPT-4o-mini to score the same submissions
4. Calculate correlation between AI and human scores

Pass Criteria:
- >80% of AI scores within ±15 points of human average
- Rank ordering matches: if human says A > B, AI should too
- No "absurd" scores (e.g., terrible code getting 95)

Estimated Time: 1 day
Estimated Cost: $1 in OpenAI API
```

#### Test 3: Code Sandbox Security
```
Action:
1. Set up Judge0 locally with Docker
2. Try common attack vectors:
   - Infinite loop
   - Fork bomb
   - File system write (outside /tmp)
   - Network request
   - Import os; os.system("rm -rf /")
   - Memory allocation bomb (allocate 10GB)
3. Verify all are contained/killed properly

Pass Criteria:
- ALL attacks contained
- Execution stops within 15 seconds
- No resource leaks on host machine

Estimated Time: 1 day
Estimated Cost: $0
```

### Week 1.5: Concierge MVP (Days 8-10)

**Goal:** Fake the product manually to test the full user journey.

#### The Concierge Test
```
Setup (no code needed):
1. Create a Google Form for candidate registration
2. Pre-generate 10 task sets (3 tasks each) using GPT-4o-mini
3. Use Google Docs for problem statements
4. Let candidates code in any IDE and paste code into a form
5. YOU (the founder) score submissions manually using the AI rubric
6. Create "Skill Passports" as beautiful Notion pages or PDFs
7. Share these passports with 2-3 friendly recruiters

Candidate Flow:
- Student fills Google Form (name, email, college)
- You email them 3 PDF tasks within 24 hours
- They have 3 days to complete and submit via form
- You score manually + with GPT-4o-mini (compare both)
- You email a "Skill Passport" PDF within 48 hours
- You send a follow-up survey: "Was this useful? Would you share it?"

Recruiter Flow:
- Send 3-5 sample passports to friendly recruiters
- Ask: "If you had 200 of these, would you use this to shortlist?"
- Ask: "What's missing? What would make you pay?"

Target:
- Run with 20-30 candidates
- Share results with 3-5 recruiters
```

**Pass Criteria for Concierge:**
- 15+ candidates complete all 3 tasks
- 10+ candidates say "this is useful, I'd share this"
- 2+ recruiters say "this is interesting, I want more"
- AI and human scores agree >80%

### Week 2: Analyze & Decide (Days 11-14)

#### Decision Matrix

| Signal | Green (Build) | Yellow (Adjust) | Red (Pivot) |
|--------|--------------|-----------------|-------------|
| Candidate interest | 30+ want to try | 15-29 interested | <15 interested |
| Task completion | >70% complete all 3 | 50-70% complete | <50% complete |
| Scoring accuracy | >80% agreement | 65-80% agreement | <65% agreement |
| Recruiter demand | 5+ "I'd use this" | 2-4 "maybe" | <2 interested |
| Payment intent | 2+ "I'd pay" | 1 "maybe" | None |

**If GREEN:** Start building. You have validation.  
**If YELLOW:** Adjust approach (different prompts, different pitch, different target).  
**If RED:** Pivot the concept before building anything.

---

## Quick-and-Dirty Validation Toolkit

| Need | Tool | Cost |
|------|------|------|
| Survey candidates | Google Forms | Free |
| Send task problems | Google Docs / PDF | Free |
| Collect code submissions | Google Forms long text | Free |
| AI scoring test | OpenAI Playground | $2-3 |
| Create sample Skill Passport | Canva / Notion | Free |
| Recruiter outreach | LinkedIn InMail / Email | Free |
| Track responses | Google Sheets | Free |
| Video call with recruiters | Google Meet | Free |
| Code sandbox test | Docker Desktop (local) | Free |

**Total validation cost: < ₹500 + 2 weeks of your time.**

---

## What You Learn From Validation

| Question | How You Answer It |
|----------|------------------|
| Do candidates want Skill Passports? | Concierge test response rate |
| Is the task difficulty right? | Self-solve + candidate completion rate |
| Can AI score accurately? | AI vs human comparison on 30 subs |
| Do recruiters want this? | 20 recruiter conversations |
| Will recruiters pay? | Direct "would you pay ₹X" question |
| Is the tech feasible? | Sandbox test + LLM output quality |
| What's the right time limit? | Observe how long candidates take |
| What objections will arise? | Collect all feedback systematically |

---

## Validation Interview Templates

### Candidate Interview (5 minutes, after completing concierge test)

1. On a scale of 1-10, how would you rate this experience?
2. Would you share this Skill Passport on LinkedIn? Why/why not?
3. What was the hardest part?
4. Did the tasks feel relevant to real work?
5. Was the time limit (45 min/task) enough?
6. Would you recommend this to a friend? Why/why not?
7. What's missing?

### Recruiter Interview (15 minutes)

1. How do you currently shortlist junior backend developers?
2. How many resumes do you typically screen per opening?
3. *[Show sample Skill Passport]* If I gave you 200 profiles like this, would you use them?
4. What information on this passport is most useful to you?
5. What's missing from this passport?
6. Would you pay ₹200-500 per candidate contact? Why/why not?
7. What would make you switch from your current process to this?
8. Would you trust an AI-generated skill score? What would increase your trust?

---

## Validation Deliverables

At the end of 2 weeks, you should have:

1. **Spreadsheet:** 30+ candidate survey responses with interest/completion data
2. **Spreadsheet:** 20+ recruiter conversation notes with interest/payment signals
3. **Document:** 50 AI-generated tasks with quality ratings
4. **Document:** AI vs Human scoring comparison (30 submissions)
5. **Screenshot/Video:** Code sandbox security test results
6. **Decision:** GO / ADJUST / PIVOT with supporting data
7. **Refined PRD:** Updated based on all feedback collected
