# Tech Stack
## India's Skill Intelligence Network — MVP

**Decision Criteria:** Free/cheap, battle-tested, fast to ship, easy to hire for in India.

---

## Stack Overview

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER              TECHNOLOGY           WHY                 │
├─────────────────────────────────────────────────────────────┤
│  Frontend           Next.js 14           SSR, React, free   │
│  Styling            Tailwind CSS         Fast UI dev         │
│  UI Components      shadcn/ui            Beautiful, free     │
│  Code Editor        Monaco Editor        Same as VS Code     │
│  Charts             Recharts             Simple, React-based │
│                                                              │
│  Backend            FastAPI (Python)     Async, fast, typed  │
│  ORM                SQLAlchemy 2.0       Mature, reliable    │
│  Migrations         Alembic              Standard for SA     │
│  Auth               JWT + Google OAuth   Simple, stateless   │
│  Validation         Pydantic V2          Built into FastAPI  │
│                                                              │
│  Database           PostgreSQL 15        ACID, free tiers    │
│  Cache (Optional)   Redis / Upstash      Rate limiting       │
│                                                              │
│  AI/LLM             OpenAI GPT-4o-mini   Cheapest good LLM  │
│  LLM Client         openai Python SDK    Official SDK        │
│  Code Execution     Docker + judge0      Sandboxed execution │
│                                                              │
│  Hosting            Railway              Simple, cheap       │
│  Frontend Hosting   Vercel (free)        Perfect for Next.js │
│  Domain             Namecheap/Cloudflare ₹500-1000/year      │
│  SSL                Cloudflare (free)    Auto SSL            │
│                                                              │
│  Email              Resend               3000 free/month     │
│  Monitoring         Sentry (free tier)   Error tracking      │
│  Analytics          PostHog (free tier)  Product analytics   │
│  CI/CD              GitHub Actions       Free for public     │
│  Version Control    GitHub               Free                │
└─────────────────────────────────────────────────────────────┘
```

---

## Detailed Decisions

### Frontend: Next.js 14 (App Router)

**Why Next.js:**
- Server-side rendering for SEO (landing page, public passports)
- API routes can serve as BFF (Backend for Frontend) if needed
- Huge ecosystem, easy to hire React devs in India
- Vercel free tier for hosting
- File-based routing = fast development

**Why NOT:**
- Remix: Smaller ecosystem in India
- Vue/Nuxt: Fewer developers available in India
- SvelteKit: Too niche for hiring
- Plain React SPA: No SSR, bad for SEO

**Key Libraries:**
```json
{
  "next": "14.x",
  "react": "18.x",
  "tailwindcss": "3.x",
  "@monaco-editor/react": "4.x",
  "recharts": "2.x",
  "next-auth": "5.x",
  "axios": "1.x",
  "zustand": "4.x",
  "react-hook-form": "7.x",
  "zod": "3.x"
}
```

### Backend: FastAPI (Python 3.11+)

**Why FastAPI:**
- Native async support (important for LLM API calls)
- Auto-generated OpenAPI docs (free API documentation)
- Pydantic validation built-in
- Python = same language as AI/ML work
- Type hints = fewer bugs
- Fastest Python framework

**Why NOT:**
- Django: Too heavy, ORM is opinionated
- Flask: No async, no auto-docs
- Express.js: Would split stack (Python for AI + Node for backend)
- Go/Rust: Overkill for MVP, harder to hire in India

**Key Libraries:**
```
fastapi==0.109+
uvicorn==0.27+
sqlalchemy==2.0+
alembic==1.13+
pydantic==2.5+
python-jose==3.3+     # JWT
passlib==1.7+         # Password hashing
python-multipart      # Form data
openai==1.12+         # LLM client
docker==7.0+          # Sandbox management
httpx==0.27+          # Async HTTP client
scikit-learn==1.4+    # TF-IDF for similarity
```

### Database: PostgreSQL 15

**Why PostgreSQL:**
- ACID transactions (critical for score calculations)
- JSONB columns for flexible data (test cases, event data)
- Full-text search (no need for Elasticsearch at MVP scale)
- Excellent free tiers: Supabase (500MB), Railway (1GB), Neon (512MB)
- Every backend dev knows SQL
- Extensions: pg_trgm (fuzzy search), uuid-ossp (UUIDs)

**Why NOT:**
- MongoDB: No advantage for structured data, weaker consistency
- MySQL: Fewer free tier options, weaker JSON support
- DynamoDB: Vendor lock-in, complex query patterns
- Neo4j: No skill relationships in MVP, expensive

**Hosting Options:**
1. **Supabase** (free): 500MB storage, 2 projects, built-in auth (bonus)
2. **Railway** ($5/mo): 1GB storage, same platform as backend
3. **Neon** (free): 512MB, serverless PostgreSQL

**Recommendation:** Start with Supabase free tier. Switch to Railway if you need more control.

### AI/LLM: OpenAI GPT-4o-mini

**Why GPT-4o-mini:**
- Cheapest capable model: $0.15/1M input, $0.60/1M output tokens
- Structured JSON output mode (reliable for task generation)
- Fast response times (< 3 seconds)
- No GPU needed (API call)
- Good enough for code evaluation (validated by benchmarks)

**Cost Per Candidate:**
```
Task Generation (3 tasks):
  Input:  ~800 tokens × 3 = 2,400 tokens → $0.00036
  Output: ~1,500 tokens × 3 = 4,500 tokens → $0.0027
  
Code Evaluation (3 submissions):
  Input:  ~2,000 tokens × 3 = 6,000 tokens → $0.0009
  Output: ~500 tokens × 3 = 1,500 tokens → $0.0009

Total per candidate: ~$0.005 (₹0.42)
1,000 candidates: ~$5 (₹420)
```

**Fallback Chain:**
1. GPT-4o-mini (primary)
2. Claude 3.5 Haiku (if OpenAI down)
3. Pre-generated task bank (emergency)

**Why NOT self-hosted models:**
- Llama/Mistral need GPU ($$$) or are too slow on CPU
- Fine-tuning requires data we don't have yet
- API cost at MVP scale is trivial ($5 for 1000 users)
- Self-host only when reaching 10K+ users/month

### Code Execution Sandbox

**Option A: Judge0 (Open Source) — Recommended**
- Self-hosted code execution engine
- Docker-based isolation
- Supports 60+ languages (we need Python only)
- Built-in timeout, memory limits, output capture
- Free and open source
- Deploy as a single Docker container alongside backend

**Option B: Custom Docker Sandbox**
- More control but more work
- Build a Python 3.11 Docker image
- Use Docker SDK to spawn containers per submission
- Set resource limits: `--memory=256m --cpus=0.5 --network=none`
- Kill after 10-second timeout

**Recommendation:** Start with Judge0. It handles all the edge cases (infinite loops, fork bombs, file system access).

### Hosting: Railway

**Why Railway:**
- Simple Dockerfile-based deployment
- Built-in PostgreSQL, Redis
- $5/mo hobby plan (enough for MVP)
- Easy scaling later
- Git-based deploy (push = deploy)

**Why NOT:**
- AWS/GCP: Overkill, complex, expensive for MVP
- Heroku: Expensive after free tier changes
- DigitalOcean: Requires more DevOps knowledge
- Fly.io: Good alternative, but Railway has better DX

**Deployment Setup:**
```
Railway Project
├── Service: backend (FastAPI) — $5/mo
├── Service: sandbox (Judge0) — $5/mo
├── Database: PostgreSQL — $0-5/mo
└── (Frontend on Vercel — free)
```

### Authentication: JWT + NextAuth.js

**Frontend Auth:**
- NextAuth.js v5 (handles Google OAuth flow)
- Stores JWT in HttpOnly cookie
- Sends JWT to FastAPI backend

**Backend Auth:**
- FastAPI receives JWT in Authorization header
- Validates JWT signature
- Extracts user_id and role from claims
- Middleware for role-based access control

**Why NOT:**
- Supabase Auth: Lock-in, but good fallback option
- Auth0: Free tier limits, overkill for MVP
- Firebase Auth: Lock-in to Google ecosystem
- Custom OAuth: Too much work

---

## Development Environment

```
Required Software:
├── Node.js 20 LTS (frontend)
├── Python 3.11+ (backend)
├── Docker Desktop (sandbox, local DB)
├── Git
├── VS Code with extensions:
│   ├── Python
│   ├── ESLint
│   ├── Prettier
│   ├── Tailwind CSS IntelliSense
│   └── REST Client (for API testing)
└── PostgreSQL client (DBeaver or pgAdmin)
```

**Local Dev Setup:**
```bash
# docker-compose.yml runs:
# - PostgreSQL 15
# - Judge0 sandbox
# - Redis (optional)

docker-compose up -d
cd frontend && npm run dev    # localhost:3000
cd backend && uvicorn main:app --reload  # localhost:8000
```

---

## Cost Summary (Monthly)

| Service | Plan | Cost (INR) |
|---------|------|-----------|
| Railway (backend) | Hobby | ₹420 |
| Railway (sandbox) | Hobby | ₹420 |
| Railway (PostgreSQL) | Included | ₹0 |
| Vercel (frontend) | Free | ₹0 |
| OpenAI API | Pay-per-use | ₹500-2000 |
| Resend (email) | Free tier | ₹0 |
| Sentry (errors) | Free tier | ₹0 |
| PostHog (analytics) | Free tier | ₹0 |
| Cloudflare (DNS/SSL) | Free | ₹0 |
| GitHub (repo) | Free | ₹0 |
| **Total** | | **₹1,340-2,840/mo** |

At scale (10K users), costs increase to ~₹15,000-25,000/mo — still manageable with revenue.
