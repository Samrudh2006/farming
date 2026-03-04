# ISIN Asset Library — Complete Index

> All SVG assets for India's Skill Intelligence Network platform.

---

## Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Indigo | `#4F46E5` | Primary brand, CTAs, headings |
| Purple | `#7C3AED` | Secondary accent, gradients |
| Pink | `#EC4899` | Tertiary accent, highlights |
| Dark BG | `#1E1B4B` / `#0F0A2A` | Dark mode backgrounds |
| Light nodes | `#818CF8` `#A78BFA` `#C084FC` | Supporting network nodes |

---

## 📁 Logos (`assets/logos/`)

| File | Size | Description | Usage |
|------|------|-------------|-------|
| `logo-full.svg` | 360×100 | Full logo with icon + text + tagline | Header, landing page |
| `logo-icon.svg` | 80×80 | Circular icon only | Mobile header, loading |
| `logo-dark.svg` | 360×100 | Light-on-dark variant | Dark mode header |
| `logo-wordmark.svg` | 280×60 | "ISIN Passport" text only | Footer, documents |

---

## 📁 Icons (`assets/icons/`)

| File | Size | Description | Usage |
|------|------|-------------|-------|
| `favicon.svg` | 32×32 | Browser tab favicon | `<link rel="icon">` |
| `favicon-16.svg` | 16×16 | Small favicon | Bookmark bar |
| `app-icon-192.svg` | 192×192 | PWA icon (medium) | `manifest.json` |
| `app-icon-512.svg` | 512×512 | PWA icon (large) | Splash screen |
| `task-api.svg` | 48×48 | API task type icon | Task cards |
| `task-data.svg` | 48×48 | Data processing task icon | Task cards |
| `task-debug.svg` | 48×48 | Bug/debug task icon | Task cards |
| `task-algo.svg` | 48×48 | Algorithm task icon | Task cards |
| `task-code.svg` | 48×48 | General coding icon | Task cards |

---

## 📁 Backgrounds (`assets/backgrounds/`)

| File | Size | Description | Usage |
|------|------|-------------|-------|
| `hero-dark.svg` | 1440×900 | Dark landing page bg with grid + glow | Landing hero (dark) |
| `hero-light.svg` | 1440×900 | Light landing page bg with dots | Landing hero (light) |
| `auth-bg.svg` | 1440×600 | Dark auth page background | Login/signup pages |
| `passport-header-bg.svg` | 1440×400 | Passport page header bg | Passport detail view |
| `cta-gradient.svg` | 1440×200 | CTA section gradient | Call-to-action strips |

---

## 📁 Badges (`assets/badges/`)

### Trust Level Badges

| File | Description | When Shown |
|------|-------------|------------|
| `trust-high.svg` | Green verified badge | Trust score ≥ 80 |
| `trust-medium.svg` | Amber review badge | Trust score 50-79 |
| `trust-low.svg` | Red flagged badge | Trust score < 50 |

### Skill Level Badges

| File | Score Range | Color |
|------|------------|-------|
| `skill-expert.svg` | 90+ | Purple→Pink gradient |
| `skill-advanced.svg` | 75+ | Indigo |
| `skill-intermediate.svg` | 60+ | Sky blue |
| `skill-developing.svg` | 40+ | Amber |
| `skill-beginner.svg` | 0+ | Slate grey |

### Special Badges

| File | Description | Usage |
|------|-------------|-------|
| `passport-badge-embed.svg` | Embeddable ISIN verified badge | LinkedIn profiles, portfolios |

---

## 📁 UI Components (`assets/ui/`)

| File | Size | Description | Usage |
|------|------|-------------|-------|
| `score-radar.svg` | 200×200 | 6-axis skill radar chart | Passport skill breakdown |
| `score-circle.svg` | 120×120 | Circular progress score | Dashboard, passport |
| `progress-bar.svg` | 200×24 | Linear progress bar | Score display, loading |
| `empty-state.svg` | 300×200 | Empty state placeholder | No data screens |
| `loading-spinner.svg` | 48×48 | Animated gradient spinner | Loading states |
| `avatar-placeholder.svg` | 48×48 | Default user avatar | Profile, recruiter view |
| `passport-card.svg` | 300×60 | Compact passport card preview | Lists, search results |

---

## 📁 Social / Sharing (`assets/social/`)

| File | Size | Description | Usage |
|------|------|-------------|-------|
| `og-image.svg` | 1200×630 | Open Graph / meta image | Social sharing |
| `linkedin-badge.svg` | 400×120 | LinkedIn embeddable badge | Profile sharing |
| `twitter-card.svg` | 600×314 | Twitter summary card | Tweet previews |

---

## 📁 Illustrations (`assets/illustrations/`)

| File | Size | Description | Usage |
|------|------|-------------|-------|
| `architecture-diagram.svg` | 1000×700 | Full system architecture diagram | Docs, presentations |
| `hero-illustration.svg` | 600×400 | Landing page hero illustration | Landing page |
| `onboarding-steps.svg` | 500×240 | 3-step onboarding flow | How it works section |
| `empty-tasks.svg` | 400×300 | No tasks empty state | Task list empty |
| `error-page.svg` | 400×300 | Error/connection failed | 500 error page |
| `success-state.svg` | 400×300 | Task completion celebration | Post-submission |
| `not-found-404.svg` | 400×300 | 404 page illustration | Not found page |

---

## Usage in Next.js

```tsx
// Import as component (recommended)
import LogoFull from '@/assets/logos/logo-full.svg';

// Or use in img tag
<img src="/assets/logos/logo-full.svg" alt="ISIN Logo" />

// Background in CSS
.hero {
  background-image: url('/assets/backgrounds/hero-dark.svg');
  background-size: cover;
}
```

## Converting to PNG

```bash
# Install svgexport
npm install -g svgexport

# Convert OG image to PNG
svgexport assets/social/og-image.svg public/og-image.png 1200:630

# Convert favicon to ICO
npx svg-to-ico assets/icons/favicon.svg public/favicon.ico
```

---

## Total: 40 SVG Assets

| Category | Count |
|----------|-------|
| Logos | 4 |
| Icons / Favicons | 9 |
| Backgrounds | 5 |
| Badges | 9 |
| UI Components | 7 |
| Social / Sharing | 3 |
| Illustrations | 7 |
| **Total** | **44** |
