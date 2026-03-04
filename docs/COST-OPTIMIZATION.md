# Cost Optimization Strategy
## India's Skill Intelligence Network — MVP

**Goal:** Keep total monthly cost under ₹3,000/month ($35 USD) for the first 3 months.

---

## Cost Breakdown by Component

### 1. LLM / AI Costs (Biggest Variable Cost)

#### Current: OpenAI GPT-4o-mini API
```
Pricing (as of March 2026):
  Input:  $0.15 per 1M tokens
  Output: $0.60 per 1M tokens

Per Candidate (3 tasks):
  Task Generation:
    Input:  ~800 tokens × 3 = 2,400 tokens  → $0.00036
    Output: ~1,500 tokens × 3 = 4,500 tokens → $0.0027

  Code Evaluation:
    Input:  ~2,000 tokens × 3 = 6,000 tokens → $0.0009
    Output: ~500 tokens × 3 = 1,500 tokens   → $0.0009

  Total per candidate: ~$0.005 (₹0.42)
```

| Scale | Candidates/Month | Monthly LLM Cost |
|-------|-----------------|-----------------|
| Phase 1 | 50 | ₹21 ($0.25) |
| Phase 2 | 200 | ₹84 ($1.00) |
| Phase 3 | 500 | ₹210 ($2.50) |
| Scale | 5,000 | ₹2,100 ($25) |
| Big Scale | 50,000 | ₹21,000 ($250) |

**LLM costs are negligible at MVP scale.**

#### Optimization Strategies

**Strategy 1: Template + Parameterize (Save 50% on generation)**
```
Instead of generating 100% new tasks each time:
1. Generate 20 "task templates" (one-time cost)
2. For each user, parameterize the template:
   - Change variable names, data values, thresholds
   - Change the "theme" (e-commerce → healthcare → education)
   - Modify edge cases
3. Use LLM only for parameterization, not full generation
4. Save the template; regenerate parameters

Cost: ~60% reduction in generation tokens
```

**Strategy 2: Batch Evaluation (Save 40% on evaluation)**
```
Instead of 3 separate LLM calls for 3 submissions:
1. Send all 3 code submissions in ONE prompt
2. Ask LLM to evaluate all 3 at once
3. Single API call instead of 3

Prompt: "Evaluate these 3 code submissions for the given tasks.
         For each, score: quality (0-100), approach (0-100).
         Return JSON array."

Cost: ~40% fewer API calls (shared context window)
```

**Strategy 3: Correctness-First Evaluation (Save 50% on evaluation)**
```
If a submission fails >50% of test cases:
1. Skip LLM evaluation entirely
2. Score quality = 0, approach = 0
3. Only run LLM evaluation on submissions that pass ≥50% tests

Result: ~30-40% of submissions are low-quality → skip LLM → save money
```

**Strategy 4: Spending Caps**
```python
# Set hard limits on OpenAI account
DAILY_LIMIT = 2.00   # $2/day
MONTHLY_LIMIT = 50.00 # $50/month

# In code: check before each LLM call
if get_daily_spend() > DAILY_LIMIT:
    return use_fallback_task_bank()
```

#### Future: Self-Hosted LLM (Month 6+, >5000 users/month)
```
When to switch:
  If monthly LLM API cost > $100/month, evaluate self-hosting

Options:
  - Llama 3.1 8B (fine-tuned on our task/evaluation data)
  - Run on GPU cloud: RunPod ($0.39/hr for A40)
  - Fine-tune on ~1000 task→score pairs from our data

Projected savings:
  API: $250/month for 50k candidates
  Self-hosted: ~$50-80/month (shared GPU, batched inference)
  Savings: 60-70%

Don't do this before you have the data + scale to justify it.
```

---

### 2. Hosting Costs

#### Strategy: Maximize Free Tiers

| Service | Free Tier | What We Use It For | Monthly Cost |
|---------|-----------|-------------------|-------------|
| **Vercel** | 100GB bandwidth, unlimited deploys | Next.js frontend | ₹0 |
| **Railway** | $5 credit/month (hobby) | FastAPI backend | ₹0-420 |
| **Supabase** | 500MB DB, 1GB file storage | PostgreSQL | ₹0 |
| **Upstash** | 10K commands/day | Redis (rate limiting) | ₹0 |
| **Resend** | 3,000 emails/month | Transactional email | ₹0 |
| **Sentry** | 5K errors/month | Error monitoring | ₹0 |
| **PostHog** | 1M events/month | Product analytics | ₹0 |
| **Cloudflare** | Unlimited | DNS, SSL, CDN | ₹0 |
| **GitHub** | Unlimited private repos | Source code | ₹0 |
| **GitHub Actions** | 2,000 min/month | CI/CD | ₹0 |

**Total free tier hosting: ₹0-420/month**

#### Scaling Path
```
Phase 1 (50 users):     Free tiers everywhere = ₹0-420/month
Phase 2 (200 users):    Railway pro ($20) + Supabase free = ₹1,680/month
Phase 3 (500 users):    Railway pro + Supabase pro = ₹3,360/month
Growth (5000 users):    AWS/GCP migration needed = ₹8,000-15,000/month
```

---

### 3. Code Sandbox Costs

#### Strategy: Self-Hosted Judge0

```
Judge0 = open source, free to self-host
Deploy as Docker container on same Railway instance

Resource per execution:
  - 256MB RAM
  - 0.5 CPU
  - 10 second max runtime
  - No network access

Concurrent executions needed:
  Phase 1: 1-2 simultaneous (single container handles this)
  Phase 2: 3-5 simultaneous (still single container)
  Phase 3: 5-10 simultaneous (may need dedicated container)

Cost:
  Phase 1-2: ₹0 (included in Railway backend service)
  Phase 3: ₹420/month (separate Railway service)
  Scale: ₹2,000-5,000/month (dedicated compute)
```

#### Alternative: Use Free APIs (Emergency Fallback)
```
- Piston API (free, rate-limited): For testing only
- Repl.it API: Not reliable enough for production
- AWS Lambda (free tier): 1M invocations free/month
  → Could work: each submission = 1 Lambda invocation
  → Free for up to 1M submissions/month
  → Consider as Phase 3 optimization
```

---

### 4. Domain & DNS

```
Domain registration: ₹500-1200/year
  Options:
  - skillindia.dev (~₹800/year)
  - isin.dev (~₹800/year)
  - skillpassport.in (~₹500/year)

DNS: Cloudflare (free)
SSL: Cloudflare (free, auto-renewed)
CDN: Cloudflare (free tier, 100+ global PoPs)

Annual cost: ₹500-1200 total
```

---

### 5. Third-Party Services

| Service | What | Free Limit | When to Pay |
|---------|------|-----------|-------------|
| OpenAI | LLM API | Pay-per-use | Always (but cheap) |
| Google OAuth | Authentication | Unlimited | Never |
| Cloudflare | CDN + DNS + SSL | Generous | >100K req/day |
| Resend | Email | 3K/month | >3K emails/month |
| PostHog | Analytics | 1M events/month | >1M events |
| Sentry | Errors | 5K events/month | >5K errors (fix bugs!) |

---

## Total Monthly Cost Projection

### Phase 1 (Weeks 1-4): ~₹1,000/month
| Item | Cost |
|------|------|
| Railway (backend) | ₹420 |
| OpenAI API | ₹100 |
| Domain (amortized) | ₹100 |
| Everything else | ₹0 (free tiers) |
| **Total** | **~₹620** |

### Phase 2 (Weeks 5-8): ~₹2,500/month
| Item | Cost |
|------|------|
| Railway (backend + sandbox) | ₹840 |
| Supabase (if free tier exceeded) | ₹0-1,700 |
| OpenAI API | ₹200 |
| Domain (amortized) | ₹100 |
| **Total** | **~₹1,140-2,840** |

### Phase 3 (Weeks 9-12): ~₹5,000/month
| Item | Cost |
|------|------|
| Railway (possible upgrade) | ₹1,680 |
| Supabase Pro | ₹1,700 |
| OpenAI API | ₹500 |
| Domain (amortized) | ₹100 |
| Resend (if over free tier) | ₹0-800 |
| **Total** | **~₹3,980-4,780** |

### 3-Month Total: ₹5,000-10,000 (~$60-120 USD)

---

## Cost Alerts & Guardrails

```python
# Set up alerts:

# 1. OpenAI: Set spending limit in dashboard
OPENAI_MONTHLY_LIMIT = 50  # USD

# 2. Railway: Set resource alerts
RAILWAY_MONTHLY_BUDGET = 20  # USD

# 3. Application-level rate limits
MAX_TASK_GENERATIONS_PER_DAY = 50
MAX_EVALUATIONS_PER_DAY = 100
MAX_CONCURRENT_SANDBOX_EXECUTIONS = 5

# 4. Daily spend monitoring (cron job)
def check_daily_costs():
    openai_spend = get_openai_usage_today()
    if openai_spend > 2.0:
        send_alert("OpenAI daily spend exceeded $2")
        enable_fallback_mode()  # Use pre-generated tasks
```

---

## When to Upgrade

| Signal | Action | Expected Cost Increase |
|--------|--------|----------------------|
| >500 concurrent users | Upgrade Railway plan | +₹2,000/month |
| >500MB database | Upgrade Supabase to Pro | +₹1,700/month |
| >3K emails/month | Upgrade Resend | +₹800/month |
| >50K LLM calls/month | Consider self-hosting Llama | +₹5,000-8,000/month |
| >10K sandbox runs/month | AWS Lambda for execution | +₹0-2,000/month |
| Need better uptime (99.9%) | Multi-region deployment | +₹10,000/month |

**Rule of thumb:** Don't optimize costs until a single line item exceeds ₹5,000/month. Your time is worth more than the savings.
