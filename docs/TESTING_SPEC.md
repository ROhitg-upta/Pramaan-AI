# 🧪 Pramaan AI — Testing Strategy & Validation Plan

> **Purpose:** Defines every test case, validation checkpoint, and quality gate for Pramaan AI. Ensures the forensic engine produces accurate, reproducible results and the UI behaves correctly across all states.

---

## 1. Testing Architecture Overview

```
Tests/
├── Backend Unit Tests        → Individual functions (AST classifier, anomaly rules, alias resolver)
├── Backend Integration Tests → Full pipeline (clone → mine → classify → flag → questions)
├── API Contract Tests        → Every endpoint returns correct schema
├── Frontend Component Tests  → Individual widget rendering & interaction
├── End-to-End Tests          → Full flow: URL input → scanning → evidence → viva → verdict
└── Demo Validation           → Pre-computed results match for the demo repo
```

---

## 2. Backend Unit Tests

### 2.1 Alias Resolution Tests (`test_alias_resolver.py`)

| Test Case | Input | Expected Output |
| :--- | :--- | :--- |
| Same person, different emails | `["alex@uni.edu", "alex.dev@gmail.com"]` | Merged into 1 profile |
| Completely different people | `["alice@a.com", "bob@b.com"]` | 2 separate profiles |
| Same email, different display names | `["Alex <alex@uni.edu>", "Alexander <alex@uni.edu>"]` | Merged into 1 profile |
| Unicode names | `["Aarón López <aaron@x.com>"]` | Correctly parsed without crash |
| Empty author field | `["<>"]` | Assigned to "Unknown Contributor" |

### 2.2 AST Tier Classification Tests (`test_ast_classifier.py`)

| Test Case | File | Expected Tier |
| :--- | :--- | :--- |
| Package lock file | `package-lock.json` | Tier 0 (0.0x) |
| SVG image | `logo.svg` | Tier 0 (0.0x) |
| Tailwind config | `tailwind.config.js` | Tier 1 (0.2x) |
| HTML template | `index.html` | Tier 1 (0.2x) |
| React component with state | `UserProfile.tsx` | Tier 2 (1.0x) |
| Express REST controller | `users.controller.ts` | Tier 2 (1.0x) |
| JWT auth with refresh rotation | `auth.service.ts` | Tier 3 (3.0x) |
| Custom sorting algorithm | `merge_sort.py` | Tier 3 (3.0x) |
| Database migration | `001_create_users.sql` | Tier 0 (0.0x) |
| `.env.example` | `.env.example` | Tier 0 (0.0x) |

### 2.3 Anomaly Detection Tests (`test_anomaly_detector.py`)

| Test Case | Scenario | Expected Flags |
| :--- | :--- | :--- |
| Big Bang Dump | 1 commit, 5000 lines, 0 deletions | `FLAG_BIG_BANG` |
| Normal builder | 40 commits, 200 lines avg, 30% churn | No flags |
| Ghost contributor | 5 commits, all README/CSS, 0 Tier 3 | `FLAG_GHOST_CONTRIBUTOR` |
| Panic burst | 90% of lines committed in last 8 hours | `FLAG_PANIC_BURST` |
| Zero churn | 3000 lines added, 0 deleted, 0 modified | `FLAG_ZERO_CHURN` |
| Mixed legitimate | 20 commits, 1 large initial commit (project scaffold) | No flags (initial scaffolds are normal) |

### 2.4 Pramaan Score Calculation Tests (`test_scoring.py`)

| Git Forensics | AST Complexity | Viva Defense | Expected Score |
| :--- | :--- | :--- | :--- |
| 92 | 88 | 98 | `0.35×92 + 0.25×88 + 0.40×98 = 93.4` |
| 12 | 18 | 38 | `0.35×12 + 0.25×18 + 0.40×38 = 23.9` |
| 80 | 60 | null (not taken) | `0.35×80 + 0.25×60 = 43.0` (Viva pending) |
| 100 | 100 | 100 | `100.0` (perfect score) |
| 0 | 0 | 0 | `0.0` |

---

## 3. Backend Integration Tests

### 3.1 Full Pipeline Test Against Demo Repo
```python
# test_full_pipeline.py

def test_demo_repo_analysis():
    """Run full analysis against the demo repo and validate results."""
    result = run_analysis("https://github.com/demo/smart-campus-app", branch="main")
    
    assert result["status"] == "completed"
    assert result["total_commits"] == 45
    assert len(result["contributors"]) == 3
    
    # Validate Rohit (the builder)
    rohit = find_contributor(result, "Rohit Sharma")
    assert rohit["total_commits"] >= 35
    assert rohit["churn_ratio"] > 25.0
    assert rohit["tier_breakdown"]["tier_3"]["percentage"] > 40.0
    assert len(rohit["anomaly_flags"]) == 0
    assert rohit["verdict"] == "VERIFIED_BUILDER"
    
    # Validate Aryan (the dumper)
    aryan = find_contributor(result, "Aryan Kumar")
    assert aryan["total_commits"] <= 3
    assert aryan["churn_ratio"] == 0.0
    assert "FLAG_BIG_BANG" in [f["type"] for f in aryan["anomaly_flags"]]
    assert aryan["verdict"] == "SUSPECT_FREELOADER"
    
    # Validate Priya (the ghost)
    priya = find_contributor(result, "Priya Patel")
    assert priya["tier_breakdown"]["tier_3"]["percentage"] == 0.0
    assert "FLAG_GHOST_CONTRIBUTOR" in [f["type"] for f in priya["anomaly_flags"]]
```

### 3.2 Edge Case Integration Tests

| Test | Repo Condition | Expected Behavior |
| :--- | :--- | :--- |
| Solo developer | 1 contributor, 50 commits | Analysis completes. No comparison. Single card layout. |
| All equal contributors | 3 contributors, ~equal commits | All get similar scores. No anomalies flagged. |
| Squash-merged PRs | All commits squash-merged | Analyze per-commit. Flag if single-author squashes are large. |
| Fork with upstream commits | Repo forked from template | Identify and separate upstream vs original commits. |
| Non-English commit messages | Hindi/Chinese/emoji messages | Parser handles gracefully. Quality score based on specificity. |

---

## 4. API Contract Tests

Every endpoint is tested for:
1. **Correct HTTP status code** for success and each error condition.
2. **Response body matches Pydantic schema** exactly.
3. **Required fields are never null** unless explicitly allowed.
4. **Error responses follow the global error contract** format.

```python
# test_api_contracts.py

def test_analyze_repo_success():
    response = client.post("/api/v1/analyze/repo", json={
        "repo_url": "https://github.com/demo/smart-campus-app",
        "branch": "main"
    })
    assert response.status_code == 202
    data = response.json()
    assert "analysis_id" in data
    assert data["status"] == "processing"

def test_analyze_repo_invalid_url():
    response = client.post("/api/v1/analyze/repo", json={
        "repo_url": "not-a-valid-url",
        "branch": "main"
    })
    assert response.status_code == 400
    data = response.json()
    assert data["error_code"] == "INVALID_REPO_URL"

def test_analyze_repo_private():
    response = client.post("/api/v1/analyze/repo", json={
        "repo_url": "https://github.com/private/repo",
        "branch": "main"
    })
    assert response.status_code == 404
    assert response.json()["error_code"] == "REPO_NOT_ACCESSIBLE"

def test_viva_evaluate_empty_answer():
    response = client.post("/api/v1/viva/evaluate", json={
        "question_id": "viva-q-001",
        "student_answer": ""
    })
    assert response.status_code == 422  # Validation error
```

---

## 5. Frontend Component Tests

### Key Components to Test:

| Component | Test Cases |
| :--- | :--- |
| `TypewriterText` | Renders characters one-by-one. Calls `onComplete` when done. Cursor blinks after completion. |
| `LiveMetricCounters` | Numbers animate from 0 to target. Final value matches input. |
| `RedFlagAlertCard` | Renders with correct severity color. Animates in from right. |
| `CrimeTimeline` | Renders correct number of nodes. Anomalous nodes have crimson color. Hover shows tooltip. |
| `DnaRadarChart` | Renders 5 axes. Clicking contributor isolates polygon. |
| `AuthenticityMeter` | Empty before submission. Fills to correct width after score. Color matches verdict. |
| `ThermalReceipt` | Renders all contributor scores. QR code present. Torn edges visible. |
| `ScoreRevealCircle` | Animates from 0 to score. Triggers confetti for scores > 85. |

---

## 6. End-to-End Test Scenario

### Happy Path (Full Demo Flow):
```
1. Open http://localhost:3000
2. Verify: Landing page loads with glitch logo animation
3. Paste demo repo URL: https://github.com/demo/smart-campus-app
4. Click "INITIATE INVESTIGATION"
5. Verify: Redirected to /investigate/{id}
6. Verify: Progress bar advances. Phases update. Metrics count up.
7. Verify: Red flag alert appears for Aryan Kumar during scanning.
8. Verify: Auto-redirected to /evidence/{id} after completion.
9. Verify: 3 contributor cards visible. Rohit = green, Aryan = red, Priya = amber.
10. Click "Crime Timeline" tab. Verify: Timeline renders with anomalous node for Aryan.
11. Click "DNA Radar" tab. Verify: Radar shows Rohit's polygon dominating all axes.
12. Click "Red Flags" tab. Verify: 2 anomaly case files displayed.
13. Click "START VIVA" on Aryan's card.
14. Verify: Redirected to /viva/{id}/contrib-002.
15. Verify: Question streams character by character. Code lines highlight.
16. Type a generic answer. Click submit.
17. Verify: Authenticity meter fills to ~24% (crimson). Verdict: PROBABLE_FREELOADER.
18. After all questions, verify: Redirected to /verdict/{id}.
19. Verify: Darkness pause → title → scores animate → confetti for Rohit.
20. Verify: Thermal receipt renders with torn edges and QR code.
21. Click "Download PDF". Verify: PDF file downloads.
```

---

## 7. Performance Benchmarks

| Operation | Target | Max Acceptable |
| :--- | :--- | :--- |
| Clone repo (50 commits) | < 3s | 10s |
| Full forensic mining (50 commits) | < 5s | 15s |
| AST classification (100 files) | < 3s | 8s |
| Anomaly detection | < 500ms | 2s |
| Gemini question generation (3 questions) | < 4s | 10s |
| Gemini answer evaluation | < 3s | 8s |
| **Total pipeline (end-to-end)** | **< 15s** | **45s** |
| Frontend initial page load | < 1.5s | 3s |
| Page transition animation | 500ms | 800ms |

---

## 8. Running Tests

```bash
# Backend unit + integration tests
cd backend
pytest tests/ -v --tb=short

# Backend with coverage report
pytest tests/ --cov=app --cov-report=html

# Frontend component tests
cd frontend
npm run test

# End-to-end tests (requires both servers running)
npm run test:e2e
```
