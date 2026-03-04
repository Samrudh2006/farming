# Anti-Cheat Detection System
## India's Skill Intelligence Network — MVP

---

## Why Anti-Cheat Matters

If candidates can cheat and get high Skill Passport scores, the entire platform loses credibility. 
Recruiters will stop trusting scores. The moat collapses.

**But for MVP: Don't over-engineer it.** A trust score with manual review is enough.

---

## Threat Model

### How Candidates Will Try to Cheat

| Threat | Probability | Severity | Detection Difficulty |
|--------|------------|----------|---------------------|
| Copy-paste from ChatGPT/Google | VERY HIGH | HIGH | EASY |
| Ask a friend to solve it | HIGH | HIGH | HARD |
| Open another tab to research | HIGH | LOW | EASY |
| Use a second device | MEDIUM | HIGH | VERY HARD |
| Submit someone else's code | MEDIUM | HIGH | MEDIUM |
| Use IDE extensions (Copilot) | MEDIUM | MEDIUM | HARD |
| Screen share with helper | LOW | HIGH | VERY HARD |

### MVP Reality Check
You CANNOT prevent all cheating. You CAN:
1. Detect obvious cheating (copy-paste, tab switching)
2. Make cheating harder (unique tasks, time limits)
3. Flag suspicious behavior for manual review
4. Reduce the value of cheating (multi-signal evaluation)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ANTI-CHEAT SYSTEM                         │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              CLIENT-SIDE COLLECTOR                    │    │
│  │              (JavaScript in Code Editor)              │    │
│  │                                                       │    │
│  │  Runs in browser while candidate is coding            │    │
│  │                                                       │    │
│  │  Collects:                                            │    │
│  │  ├── Clipboard paste events (content hash + length)   │    │
│  │  ├── Tab visibility changes (blur/focus + durations)  │    │
│  │  ├── Keystroke timing (inter-key intervals)           │    │
│  │  ├── Code snapshots every 60 seconds                  │    │
│  │  └── Mouse activity (active/idle periods)             │    │
│  │                                                       │    │
│  │  Sends batch to: POST /events/behavior                │    │
│  │  (every 30 seconds or on submit)                      │    │
│  └─────────────────────────┬───────────────────────────┘    │
│                            │                                  │
│                            ▼                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              SERVER-SIDE ANALYZER                     │    │
│  │              (Python — anticheat.py)                   │    │
│  │                                                       │    │
│  │  Signal Processors:                                   │    │
│  │  ├── PasteAnalyzer                                    │    │
│  │  ├── TabSwitchAnalyzer                                │    │
│  │  ├── TypingPatternAnalyzer                            │    │
│  │  ├── CodeSimilarityAnalyzer                           │    │
│  │  └── TimelineAnalyzer                                 │    │
│  │                                                       │    │
│  │  Output: TrustScore (HIGH / MEDIUM / LOW)             │    │
│  └─────────────────────────┬───────────────────────────┘    │
│                            │                                  │
│                            ▼                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              TRUST SCORE STORAGE                      │    │
│  │              (PostgreSQL — trust_scores table)         │    │
│  │                                                       │    │
│  │  Stored per submission:                               │    │
│  │  - Individual signal flags                            │    │
│  │  - Aggregate trust level                              │    │
│  │  - Admin review status                                │    │
│  └─────────────────────────┬───────────────────────────┘    │
│                            │                                  │
│                            ▼                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              VISIBILITY LAYER                         │    │
│  │                                                       │    │
│  │  Candidate:  Sees trust level badge on passport       │    │
│  │  Recruiter:  Sees trust level as filter/badge         │    │
│  │  Admin:      Sees full detail, can override           │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## Signal Definitions

### Signal 1: Paste Detection

**What:** Detect when candidate pastes code from external sources.

```javascript
// Client-side collector (in Monaco Editor wrapper)
const pasteEvents = [];

editor.onDidPaste((e) => {
  const pastedText = editor.getModel().getValueInRange(e.range);
  pasteEvents.push({
    event_type: 'paste',
    event_data: {
      char_count: pastedText.length,
      line_count: pastedText.split('\n').length,
      content_hash: sha256(pastedText),  // Don't send actual content
      timestamp_ms: Date.now() - sessionStartTime
    }
  });
});
```

**Server-side scoring:**
```python
def analyze_paste(events: list, total_code_chars: int) -> dict:
    paste_events = [e for e in events if e.event_type == 'paste']
    total_pasted = sum(e.event_data.get('char_count', 0) for e in paste_events)
    
    paste_ratio = total_pasted / max(total_code_chars, 1)
    
    # Thresholds
    large_pastes = [e for e in paste_events if e.event_data.get('char_count', 0) > 100]
    
    flagged = (
        paste_ratio > 0.5 or         # >50% of code was pasted
        len(large_pastes) > 2 or      # >2 large paste events
        any(e.event_data.get('char_count', 0) > 500 for e in paste_events)  # Single paste > 500 chars
    )
    
    return {
        'paste_ratio': round(paste_ratio, 2),
        'paste_count': len(paste_events),
        'large_paste_count': len(large_pastes),
        'flagged': flagged
    }
```

### Signal 2: Tab Switch Detection

**What:** Detect when candidate leaves the editor tab.

```javascript
// Client-side collector
const tabEvents = [];
let lastBlurTime = null;

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    lastBlurTime = Date.now();
    tabEvents.push({
      event_type: 'window_blur',
      event_data: {},
      timestamp_ms: Date.now() - sessionStartTime
    });
  } else {
    const awayDuration = lastBlurTime ? Date.now() - lastBlurTime : 0;
    tabEvents.push({
      event_type: 'window_focus',
      event_data: { away_duration_ms: awayDuration },
      timestamp_ms: Date.now() - sessionStartTime
    });
  }
});
```

**Server-side scoring:**
```python
def analyze_tab_switches(events: list) -> dict:
    blur_events = [e for e in events if e.event_type == 'window_blur']
    focus_events = [e for e in events if e.event_type == 'window_focus']
    
    total_switches = len(blur_events)
    long_absences = [
        e for e in focus_events 
        if e.event_data.get('away_duration_ms', 0) > 30000  # >30 sec away
    ]
    
    flagged = (
        total_switches > 10 or          # Switched tabs >10 times
        len(long_absences) > 3 or        # Away >30 sec more than 3 times
        any(e.event_data.get('away_duration_ms', 0) > 120000 for e in focus_events)  # Away >2 min once
    )
    
    return {
        'total_switches': total_switches,
        'long_absences': len(long_absences),
        'flagged': flagged
    }
```

### Signal 3: Typing Pattern Analysis

**What:** Detect sudden code bursts after long inactivity (suggests copy from external source via second device or typing from reference).

```javascript
// Client-side: capture code snapshots every 60 seconds
const snapshots = [];
setInterval(() => {
  const code = editor.getValue();
  snapshots.push({
    event_type: 'code_snapshot',
    event_data: {
      char_count: code.length,
      line_count: code.split('\n').length,
      hash: sha256(code)
    },
    timestamp_ms: Date.now() - sessionStartTime
  });
}, 60000); // Every 60 seconds
```

**Server-side scoring:**
```python
def analyze_typing_pattern(events: list) -> dict:
    snapshots = sorted(
        [e for e in events if e.event_type == 'code_snapshot'],
        key=lambda e: e.timestamp_ms
    )
    
    if len(snapshots) < 3:
        return {'flagged': False, 'bursts': 0}
    
    bursts = 0
    for i in range(1, len(snapshots)):
        chars_diff = snapshots[i].event_data['char_count'] - snapshots[i-1].event_data['char_count']
        time_diff_sec = (snapshots[i].timestamp_ms - snapshots[i-1].timestamp_ms) / 1000
        
        # >200 characters appeared in <60 seconds after period of no change
        if chars_diff > 200 and time_diff_sec <= 60:
            # Check if previous interval also had little change
            if i >= 2:
                prev_chars = snapshots[i-1].event_data['char_count'] - snapshots[i-2].event_data['char_count']
                if prev_chars < 20:  # Was idle before the burst
                    bursts += 1
    
    return {
        'bursts': bursts,
        'flagged': bursts >= 2
    }
```

### Signal 4: Code Similarity Detection

**What:** Compare submitted code against all other submissions for the same task type to detect copied solutions.

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def analyze_similarity(
    submission_code: str, 
    other_submissions: list[str],
    threshold: float = 0.85
) -> dict:
    """
    Compare submission against all others using TF-IDF + cosine similarity.
    """
    if not other_submissions:
        return {'max_similarity': 0.0, 'flagged': False}
    
    # Normalize code (remove whitespace variations, comments)
    def normalize(code: str) -> str:
        lines = code.strip().split('\n')
        lines = [l.strip() for l in lines if l.strip() and not l.strip().startswith('#')]
        return ' '.join(lines)
    
    all_code = [normalize(submission_code)] + [normalize(c) for c in other_submissions]
    
    # TF-IDF vectorization
    vectorizer = TfidfVectorizer(
        analyzer='char_wb',  # Character n-grams (catches variable renaming)
        ngram_range=(3, 5),
        max_features=5000
    )
    
    try:
        tfidf_matrix = vectorizer.fit_transform(all_code)
        similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
        max_sim = float(np.max(similarities)) if len(similarities) > 0 else 0.0
    except:
        max_sim = 0.0
    
    return {
        'max_similarity': round(max_sim, 3),
        'similar_count': int(np.sum(similarities > 0.7)) if len(other_submissions) > 0 else 0,
        'flagged': max_sim > threshold
    }
```

### Signal 5: Timeline Analysis

**What:** Check if the overall task completion timeline makes sense.

```python
def analyze_timeline(
    task_started_at: datetime,
    submission_time: datetime,
    code_length: int,
    events: list
) -> dict:
    total_time_sec = (submission_time - task_started_at).total_seconds()
    
    # Suspiciously fast completion (< 5 min for > 200 lines of code)
    code_lines = code_length  # approximate
    too_fast = total_time_sec < 300 and code_lines > 50  # <5 min, >50 lines
    
    # Suspiciously slow with no activity (submitted but barely typed)
    active_events = [e for e in events if e.event_type in ('code_snapshot', 'paste')]
    low_activity = total_time_sec > 1800 and len(active_events) < 5  # >30 min, <5 snapshots
    
    return {
        'total_time_sec': total_time_sec,
        'too_fast': too_fast,
        'low_activity': low_activity,
        'flagged': too_fast or low_activity
    }
```

---

## Trust Score Aggregation

```python
class TrustScoreCalculator:
    """
    Aggregates all anti-cheat signals into a single trust level.
    """
    
    def calculate(
        self,
        paste_result: dict,
        tab_result: dict,
        typing_result: dict,
        similarity_result: dict,
        timeline_result: dict
    ) -> dict:
        
        flags = []
        
        if paste_result['flagged']:
            flags.append('paste')
        if tab_result['flagged']:
            flags.append('tab_switch')
        if typing_result['flagged']:
            flags.append('typing_burst')
        if similarity_result['flagged']:
            flags.append('code_similarity')
        if timeline_result['flagged']:
            flags.append('timeline')
        
        total_flags = len(flags)
        
        # Trust level determination
        if total_flags == 0:
            trust_level = 'high'
        elif total_flags <= 2:
            trust_level = 'medium'
        else:
            trust_level = 'low'
        
        return {
            'trust_level': trust_level,
            'total_flags': total_flags,
            'flags': flags,
            'details': {
                'paste': paste_result,
                'tab_switch': tab_result,
                'typing_pattern': typing_result,
                'similarity': similarity_result,
                'timeline': timeline_result
            }
        }
```

---

## How Trust Score Affects the Platform

### For Candidates
```
HIGH trust:
  ✅ Skill Passport shows ✓ Verified badge
  ✅ Score displayed normally
  ✅ Appears in recruiter search

MEDIUM trust:
  ⚠️ Skill Passport shows ⚠ Review Pending badge
  ⚠️ Score displayed with note: "Some behavioral signals detected"
  ⚠️ Appears in recruiter search (with warning)
  📋 Queued for founder manual review

LOW trust:
  ❌ Skill Passport NOT shown publicly
  ❌ Score hidden: "Under Review"
  ❌ Does NOT appear in recruiter search
  📋 Immediately queued for manual review
  📧 Candidate receives email: "Your submission is under review"
```

### For Recruiters
```
Search filter: Trust Level
  ☑ High (default: ON)
  ☐ Medium (default: OFF — recruiter can enable)
  ☐ Low (never shown)

Candidate card shows:
  "Trust: ✓ Verified" (green)
  "Trust: ⚠ Under Review" (yellow)
```

### For Admin
```
Admin dashboard shows:
  - All submissions sorted by trust_level (LOW first)
  - Full behavioral event log per submission
  - Code side-by-side comparison for similar submissions
  - Override button: change trust level + add notes
```

---

## What We CAN'T Detect (And That's OK for MVP)

| Attack | Why We Can't Detect | Acceptable? |
|--------|-------------------|-------------|
| Second device (phone with ChatGPT) | No camera/screen monitoring | Yes — unique tasks limit direct copy |
| Friend in the room helping | No webcam proctoring | Yes — friend must understand unique task |
| Memorized similar solutions | Generic patterns in code | Yes — approach score catches generic code |
| VPN/proxy to share account | No IP fingerprinting | Yes — task is still user-specific |

**Key insight:** Because tasks are UNIQUE per user, cheating requires understanding the specific problem — you can't just copy a solution. This is the primary anti-cheat mechanism; behavioral signals are secondary.

---

## Post-MVP Anti-Cheat Enhancements (NOT for MVP)

| Enhancement | Complexity | When to Build |
|-------------|-----------|---------------|
| Keystroke dynamics ML model | HIGH | When 10K+ submissions provide training data |
| Embedding-based similarity (not TF-IDF) | MEDIUM | When TF-IDF proves insufficient |
| Browser proctoring (webcam + screen) | HIGH | When recruiters demand it |
| IP/device fingerprinting | MEDIUM | When account sharing detected |
| LLM-based code originality scoring | MEDIUM | When we can fine-tune on our data |
| Cross-platform data (same code on HackerRank?) | HIGH | Probably never — privacy concerns |

---

## Implementation Priority

### MVP (Build This)
1. ✅ Client-side paste event tracking
2. ✅ Client-side tab/window blur tracking
3. ✅ Code snapshots every 60 seconds
4. ✅ Server-side trust score calculation (5 signals)
5. ✅ Trust level display on passport
6. ✅ Admin manual review for LOW trust submissions

### Post-MVP (Build Later)
7. ⬜ Code similarity across all submissions (TF-IDF)
8. ⬜ Typing pattern ML model
9. ⬜ Embedding-based similarity search
10. ⬜ Automated re-assessment for flagged users

### Probably Never
11. ❌ Webcam proctoring (privacy concerns, bad UX)
12. ❌ Screen recording (privacy nightmare)
13. ❌ IP banning (VPN makes it useless)
