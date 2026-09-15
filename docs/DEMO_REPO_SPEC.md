# 🎭 Pramaan AI — Demo Repository Spec & Hackathon Stage Script

> **Purpose:** For the live hackathon demo, we need a CONTROLLED sample repository that perfectly showcases every Pramaan AI feature — Big Bang dumps, ghost contributors, verified builders, and dramatic viva failures. This file specifies that demo repo down to every commit.

---

## 1. Why a Demo Repo Is Critical

In a live hackathon demo, you CANNOT rely on random public repos because:
- The repo might have only 1 contributor (no comparison possible).
- No anomalies might exist (nothing dramatic to show).
- Analysis might take too long (judges lose patience after 15 seconds).

**Solution:** We create a pre-built demo repository with carefully scripted git history that triggers EVERY red flag and showcases the full Pramaan AI pipeline in under 10 seconds.

---

## 2. Demo Repository Identity

- **Repo Name:** `smart-campus-app`
- **Description:** "A university campus management app built by a team of 3 students for their final year capstone project."
- **Language:** Python (FastAPI backend) + JavaScript/React (frontend)
- **Timeline:** Simulated 14-day development window
- **Total Commits:** ~45 commits
- **Contributors:** 3 students (each representing a different archetype)

---

## 3. The Three Contributor Archetypes

### 👤 Contributor 1: "Rohit Sharma" — THE REAL BUILDER
- **Email:** `rohit.sharma@university.edu`
- **Commits:** 38 commits over 14 days
- **Pattern:** Steady, incremental, atomic commits
- **Code Quality:**
  - Writes core backend logic: auth system, database models, API routes, caching
  - High Tier 3 (algorithmic) code ratio
  - Healthy churn: writes → tests → debugs → refactors → deletes dead code
  - Commit messages: descriptive and specific
- **Expected Pramaan Score:** 90-96
- **Expected Verdict:** ✅ VERIFIED BUILDER

#### Sample Commits (Chronological):
```
Day 1:  "init: FastAPI project structure with SQLAlchemy models"         +120 -0
Day 1:  "feat: add Student and Course database models with relations"    +85 -0
Day 2:  "feat: implement JWT auth with refresh token rotation"           +145 -0
Day 2:  "fix: handle race condition in concurrent token refresh"         +32 -18
Day 3:  "feat: add course enrollment API with capacity validation"       +98 -0
Day 3:  "refactor: extract auth middleware into reusable decorator"      +45 -62
Day 4:  "feat: implement attendance tracking with QR code generation"    +156 -0
Day 5:  "fix: QR code expiration not checked on scan endpoint"           +18 -4
Day 5:  "test: add unit tests for auth and enrollment services"          +210 -0
Day 6:  "feat: add Redis caching for course listing with TTL"            +72 -8
Day 7:  "fix: cache invalidation missing on course update"               +14 -3
Day 8:  "feat: implement notification service with email queue"          +134 -0
Day 9:  "refactor: move business logic from routes to service layer"     +89 -156
Day 10: "feat: add professor dashboard API with analytics aggregation"   +167 -0
Day 11: "fix: N+1 query in attendance report generation"                 +28 -12
Day 12: "perf: add database indexing for enrollment lookups"             +15 -0
Day 13: "feat: add rate limiting middleware for public endpoints"         +56 -0
Day 14: "docs: add API documentation and deployment guide"               +45 -0
... (more similar commits filling 38 total)
```

---

### 👤 Contributor 2: "Aryan Kumar" — THE BIG BANG DUMPER
- **Email:** `aryan.kumar.dev@gmail.com`
- **Commits:** 2 commits total
- **Pattern:** Ghost for 13 days, then dumps entire frontend at 3:42 AM on Day 14
- **Code Quality:**
  - Commit 1 (Day 1): README.md with project title only (+8 lines)
  - Commit 2 (Day 14, 03:42 AM): Dumps entire React frontend (+4,821 lines, -0 lines)
  - The dumped code is structurally copied from a popular open-source campus management template
  - Zero deletions, zero debugging, zero iterative work
  - Commit message: "added frontend"
- **Expected Pramaan Score:** 18-28
- **Expected Verdict:** 🔴 SUSPECT FREELOADER

#### Red Flags That Will Trigger:
```
🚩 FLAG_BIG_BANG:     1 commit, +4,821 lines, 0 deletions
🚩 FLAG_ZERO_CHURN:   No modifications or deletions ever made
🚩 FLAG_PANIC_BURST:  100% of code committed 6 hours before deadline
🚩 FLAG_MSG_QUALITY:  Commit message "added frontend" scores 15/100
```

#### Viva Trap (What Will Happen in Demo):
- Pramaan AI will ask: *"Aryan, in your commit at line 234 of App.jsx, you used a custom useAuthContext hook. If the auth token expires mid-session while a WebSocket is open, how does your implementation handle re-authentication?"*
- **Expected Student Failure:** Aryan won't know because the code was copy-pasted. He'll give a generic answer about "token refresh" without mentioning the specific WebSocket handling or the custom hook implementation.

---

### 👤 Contributor 3: "Priya Patel" — THE GHOST EDITOR
- **Email:** `priya.p@university.edu`
- **Commits:** 5 commits
- **Pattern:** Only edits documentation, comments, and CSS styling. Zero functional code.
- **Code Quality:**
  - All commits are Tier 0 or Tier 1 (docs, README formatting, CSS color changes)
  - Never touches a `.py`, `.js`, or `.ts` file containing logic
  - Commit messages are generic: "updated readme", "fixed styling", "minor changes"
- **Expected Pramaan Score:** 30-40
- **Expected Verdict:** 🟡 GHOST CONTRIBUTOR

#### Sample Commits:
```
Day 3:  "updated readme with project description"          +25 -2   (README.md only)
Day 6:  "fixed styling on landing page"                     +12 -8   (styles.css only)
Day 9:  "added team member names to about page"            +6 -0    (about.html only)
Day 11: "minor changes"                                     +3 -1    (README.md only)
Day 13: "updated color scheme"                              +18 -14  (styles.css only)
```

---

## 4. Demo Repo Creation Script

```bash
#!/bin/bash
# create_demo_repo.sh — Creates the controlled demo repository

mkdir smart-campus-app && cd smart-campus-app
git init

# ═══ DAY 1 — Rohit starts the project ═══
git config user.name "Rohit Sharma"
git config user.email "rohit.sharma@university.edu"

# Commit 1: Project init
mkdir -p backend/app/{api,core,services,models}
cat > backend/app/main.py << 'EOF'
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.router import api_router

app = FastAPI(title=settings.APP_NAME, version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
app.include_router(api_router, prefix="/api/v1")

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "smart-campus-api"}
EOF
# ... (more files for init commit)
GIT_AUTHOR_DATE="2026-10-01T10:30:00" GIT_COMMITTER_DATE="2026-10-01T10:30:00" \
  git add -A && git commit -m "init: FastAPI project structure with SQLAlchemy models"

# Commit 2: Auth system
cat > backend/app/services/auth_service.py << 'EOF'
import jwt
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from app.core.config import settings

class AuthService:
    def __init__(self):
        self.secret_key = settings.JWT_SECRET
        self.algorithm = "HS256"
        self.access_token_ttl = timedelta(minutes=15)
        self.refresh_token_ttl = timedelta(days=7)

    async def create_access_token(self, user_id: str) -> str:
        payload = {
            "sub": user_id,
            "exp": datetime.utcnow() + self.access_token_ttl,
            "type": "access"
        }
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)

    async def rotate_refresh_token(self, user_id: str, old_token: str) -> dict:
        """Atomic refresh token rotation with race condition prevention."""
        lock = await self._acquire_user_lock(user_id)
        if not lock:
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                                detail="Concurrent refresh detected. Try again.")
        try:
            await self._invalidate_token(old_token)
            new_access = await self.create_access_token(user_id)
            new_refresh = await self._generate_refresh_token(user_id)
            return {"access_token": new_access, "refresh_token": new_refresh}
        finally:
            await self._release_user_lock(user_id)

    async def _acquire_user_lock(self, user_id: str) -> bool:
        # Redis-based distributed lock with 5s TTL
        # Prevents race condition when multiple tabs refresh simultaneously
        pass  # Implementation uses Redis SETNX

    async def _invalidate_token(self, token: str):
        # Add to revocation set in Redis with TTL matching token expiry
        pass

    async def _generate_refresh_token(self, user_id: str) -> str:
        payload = {
            "sub": user_id,
            "exp": datetime.utcnow() + self.refresh_token_ttl,
            "type": "refresh",
            "jti": str(uuid4())  # Unique token ID for revocation tracking
        }
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
EOF
GIT_AUTHOR_DATE="2026-10-02T14:15:00" GIT_COMMITTER_DATE="2026-10-02T14:15:00" \
  git add -A && git commit -m "feat: implement JWT auth with refresh token rotation"

# ═══ DAY 1 — Aryan's only meaningful(?) commit ═══
git config user.name "Aryan Kumar"
git config user.email "aryan.kumar.dev@gmail.com"

echo "# Smart Campus App\nA campus management system" > README.md
GIT_AUTHOR_DATE="2026-10-01T22:00:00" GIT_COMMITTER_DATE="2026-10-01T22:00:00" \
  git add -A && git commit -m "first commit"

# ... (Continue with more Rohit commits through Day 13)

# ═══ DAY 14, 3:42 AM — Aryan's Big Bang Dump ═══
git config user.name "Aryan Kumar"
git config user.email "aryan.kumar.dev@gmail.com"

# Copy-paste an entire React frontend template (4,821 lines)
# This would be the actual frontend files
mkdir -p frontend/src/{components,pages,hooks,utils,styles}
# ... (Generate ~4,821 lines of React code from template)

GIT_AUTHOR_DATE="2026-10-14T03:42:00" GIT_COMMITTER_DATE="2026-10-14T03:42:00" \
  git add -A && git commit -m "added frontend"

# ═══ Priya's scattered documentation commits ═══
git config user.name "Priya Patel"
git config user.email "priya.p@university.edu"

# (Commits on Days 3, 6, 9, 11, 13 — only README and CSS changes)

echo "Demo repo created successfully!"
```

---

## 5. Pre-Computed Expected Results (For Demo Validation)

After running Pramaan AI against `smart-campus-app`, the expected output should closely match:

```json
{
  "analysis_id": "demo-001",
  "repo_url": "https://github.com/demo/smart-campus-app",
  "total_commits": 45,
  "total_lines": 18420,
  "integrity_grade": "C+",
  "contributors": [
    {
      "name": "Rohit Sharma",
      "commits": 38,
      "lines_added": 13547,
      "lines_deleted": 4280,
      "tier3_percentage": 72,
      "churn_ratio": 38.2,
      "anomaly_flags": [],
      "pramaan_score": 94,
      "verdict": "VERIFIED_BUILDER"
    },
    {
      "name": "Aryan Kumar",
      "commits": 2,
      "lines_added": 4829,
      "lines_deleted": 0,
      "tier3_percentage": 8,
      "churn_ratio": 0.0,
      "anomaly_flags": ["FLAG_BIG_BANG", "FLAG_ZERO_CHURN", "FLAG_PANIC_BURST"],
      "pramaan_score": 24,
      "verdict": "SUSPECT_FREELOADER"
    },
    {
      "name": "Priya Patel",
      "commits": 5,
      "lines_added": 64,
      "lines_deleted": 25,
      "tier3_percentage": 0,
      "churn_ratio": 28.0,
      "anomaly_flags": ["FLAG_GHOST_CONTRIBUTOR"],
      "pramaan_score": 35,
      "verdict": "GHOST_CONTRIBUTOR"
    }
  ],
  "executive_summary": "Rohit Sharma is the sole functional architect of this project, authoring 100% of Tier-3 backend logic across 38 atomic commits over 14 days. Aryan Kumar's single 4,829-line frontend dump at 03:42 AM shows structural patterns consistent with template copy-paste. Priya Patel contributed exclusively to documentation and styling with zero functional code."
}
```

---

## 6. Demo Day Rehearsal Checklist

- [ ] Demo repo cloned and accessible (local or GitHub)
- [ ] Backend server running and tested against demo repo
- [ ] Frontend loaded and connected to backend
- [ ] Pre-run analysis once to warm caches (so live demo is instant)
- [ ] Prepare "Aryan's wrong answer" for the Viva Hot Seat moment
- [ ] Test confetti animation on score reveal for Rohit (>85)
- [ ] Test red vignette animation for Aryan (<35)
- [ ] Thermal receipt generates with QR code
- [ ] Presentation mode (`Ctrl+Shift+P`) toggled on for larger fonts
- [ ] Backup: screenshots of each ACT in case of live failure
