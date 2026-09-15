# 📊 Pramaan AI — Sample API Responses & Mock Data

> **Purpose:** This file contains EXACT sample API responses for every endpoint. Frontend developers can build the entire UI using this mock data WITHOUT a running backend. Also serves as the definitive data contract between backend and frontend teams.

---

## 1. POST `/api/v1/analyze/repo` — Start Analysis

### Request:
```json
{
  "repo_url": "https://github.com/demo/smart-campus-app",
  "branch": "main"
}
```

### Response (202 Accepted):
```json
{
  "analysis_id": "8fae491c-7721-4f11-b51c-8e4210d3f23a",
  "status": "processing",
  "message": "Repository cloned. Forensic analysis pipeline initialized.",
  "created_at": "2026-09-15T10:42:00Z"
}
```

---

## 2. GET `/api/v1/analyze/{id}/status` — Poll Progress

### Response (Processing — 45%):
```json
{
  "analysis_id": "8fae491c-7721-4f11-b51c-8e4210d3f23a",
  "status": "processing",
  "progress_percent": 45,
  "current_step": "Mining 45 commits — extracting diffs and churn metrics",
  "elapsed_seconds": 4.2,
  "phases": [
    { "name": "Cloning Repository", "status": "completed", "duration_ms": 2100 },
    { "name": "Mining Commits", "status": "active", "duration_ms": null },
    { "name": "Identity Resolution", "status": "pending", "duration_ms": null },
    { "name": "AST Tier Classification", "status": "pending", "duration_ms": null },
    { "name": "Anomaly Detection", "status": "pending", "duration_ms": null },
    { "name": "Viva Question Generation", "status": "pending", "duration_ms": null }
  ],
  "live_metrics": {
    "total_commits": 45,
    "total_lines": 12840,
    "contributors_found": 3,
    "files_analyzed": 42
  },
  "early_red_flags": []
}
```

### Response (Processing — 78%, Red Flag Detected):
```json
{
  "analysis_id": "8fae491c-7721-4f11-b51c-8e4210d3f23a",
  "status": "processing",
  "progress_percent": 78,
  "current_step": "Calculating AST tier complexity for 67 source files",
  "elapsed_seconds": 7.8,
  "phases": [
    { "name": "Cloning Repository", "status": "completed", "duration_ms": 2100 },
    { "name": "Mining Commits", "status": "completed", "duration_ms": 3200 },
    { "name": "Identity Resolution", "status": "completed", "duration_ms": 400 },
    { "name": "AST Tier Classification", "status": "active", "duration_ms": null },
    { "name": "Anomaly Detection", "status": "pending", "duration_ms": null },
    { "name": "Viva Question Generation", "status": "pending", "duration_ms": null }
  ],
  "live_metrics": {
    "total_commits": 45,
    "total_lines": 18420,
    "contributors_found": 3,
    "files_analyzed": 67
  },
  "early_red_flags": [
    {
      "id": "flag-001",
      "type": "FLAG_BIG_BANG",
      "severity": "CRITICAL",
      "contributor_name": "Aryan Kumar",
      "description": "1 commit | +4,821 lines | 0 deletions | Timestamp: Oct 14, 03:42 AM",
      "details": "Single massive code injection 6 hours before deadline with zero iterative debugging history."
    }
  ]
}
```

### Response (Completed — 100%):
```json
{
  "analysis_id": "8fae491c-7721-4f11-b51c-8e4210d3f23a",
  "status": "completed",
  "progress_percent": 100,
  "current_step": "Analysis complete",
  "elapsed_seconds": 11.2,
  "phases": [
    { "name": "Cloning Repository", "status": "completed", "duration_ms": 2100 },
    { "name": "Mining Commits", "status": "completed", "duration_ms": 3200 },
    { "name": "Identity Resolution", "status": "completed", "duration_ms": 400 },
    { "name": "AST Tier Classification", "status": "completed", "duration_ms": 2800 },
    { "name": "Anomaly Detection", "status": "completed", "duration_ms": 1200 },
    { "name": "Viva Question Generation", "status": "completed", "duration_ms": 1500 }
  ]
}
```

---

## 3. GET `/api/v1/analyze/{id}/report` — Full Forensic Report

### Response (200 OK):
```json
{
  "analysis_id": "8fae491c-7721-4f11-b51c-8e4210d3f23a",
  "repo_url": "https://github.com/demo/smart-campus-app",
  "branch": "main",
  "total_commits": 45,
  "total_lines_audited": 18420,
  "total_files": 67,
  "analysis_duration_seconds": 11.2,
  "integrity_grade": "C+",
  "overall_pramaan_score": 51.0,

  "contributors": [
    {
      "id": "contrib-001",
      "primary_name": "Rohit Sharma",
      "emails": ["rohit.sharma@university.edu"],
      "avatar_color": "#10B981",
      "total_commits": 38,
      "lines_added": 13547,
      "lines_deleted": 4280,
      "net_lines": 9267,
      "churn_ratio": 38.2,
      "tier_breakdown": {
        "tier_0": { "lines": 320, "percentage": 2.4 },
        "tier_1": { "lines": 1890, "percentage": 13.9 },
        "tier_2": { "lines": 4120, "percentage": 30.4 },
        "tier_3": { "lines": 7217, "percentage": 53.3 }
      },
      "commit_cadence": {
        "first_commit": "2026-10-01T10:30:00Z",
        "last_commit": "2026-10-14T16:20:00Z",
        "active_days": 12,
        "avg_commits_per_day": 3.2,
        "most_active_hour": 14,
        "burstiness_score": 0.15
      },
      "commit_message_quality_avg": 78,
      "anomaly_flags": [],
      "sub_scores": {
        "git_forensics": 92,
        "ast_complexity": 88,
        "viva_defense": null
      },
      "pramaan_score": 94,
      "verdict": "VERIFIED_BUILDER",
      "radar_axes": {
        "algorithmic_depth": 88,
        "iterative_churn": 82,
        "commit_consistency": 95,
        "code_breadth": 78,
        "ast_complexity": 91
      }
    },
    {
      "id": "contrib-002",
      "primary_name": "Aryan Kumar",
      "emails": ["aryan.kumar.dev@gmail.com"],
      "avatar_color": "#EF4444",
      "total_commits": 2,
      "lines_added": 4829,
      "lines_deleted": 0,
      "net_lines": 4829,
      "churn_ratio": 0.0,
      "tier_breakdown": {
        "tier_0": { "lines": 1200, "percentage": 24.8 },
        "tier_1": { "lines": 2890, "percentage": 59.8 },
        "tier_2": { "lines": 650, "percentage": 13.5 },
        "tier_3": { "lines": 89, "percentage": 1.9 }
      },
      "commit_cadence": {
        "first_commit": "2026-10-01T22:00:00Z",
        "last_commit": "2026-10-14T03:42:00Z",
        "active_days": 2,
        "avg_commits_per_day": 1.0,
        "most_active_hour": 3,
        "burstiness_score": 0.98
      },
      "commit_message_quality_avg": 18,
      "anomaly_flags": [
        {
          "type": "FLAG_BIG_BANG",
          "severity": "CRITICAL",
          "description": "1 commit of +4,821 lines with 0 deletions at 03:42 AM"
        },
        {
          "type": "FLAG_ZERO_CHURN",
          "severity": "HIGH",
          "description": "0% churn ratio — no modifications or deletions indicating no debugging"
        },
        {
          "type": "FLAG_PANIC_BURST",
          "severity": "HIGH",
          "description": "100% of contributions made within 8 hours of submission deadline"
        }
      ],
      "sub_scores": {
        "git_forensics": 12,
        "ast_complexity": 18,
        "viva_defense": null
      },
      "pramaan_score": null,
      "verdict": "SUSPECT_FREELOADER",
      "radar_axes": {
        "algorithmic_depth": 8,
        "iterative_churn": 0,
        "commit_consistency": 5,
        "code_breadth": 15,
        "ast_complexity": 12
      }
    },
    {
      "id": "contrib-003",
      "primary_name": "Priya Patel",
      "emails": ["priya.p@university.edu"],
      "avatar_color": "#F59E0B",
      "total_commits": 5,
      "lines_added": 64,
      "lines_deleted": 25,
      "net_lines": 39,
      "churn_ratio": 28.0,
      "tier_breakdown": {
        "tier_0": { "lines": 6, "percentage": 9.4 },
        "tier_1": { "lines": 55, "percentage": 85.9 },
        "tier_2": { "lines": 3, "percentage": 4.7 },
        "tier_3": { "lines": 0, "percentage": 0.0 }
      },
      "commit_cadence": {
        "first_commit": "2026-10-03T11:00:00Z",
        "last_commit": "2026-10-13T15:30:00Z",
        "active_days": 5,
        "avg_commits_per_day": 1.0,
        "most_active_hour": 13,
        "burstiness_score": 0.22
      },
      "commit_message_quality_avg": 25,
      "anomaly_flags": [
        {
          "type": "FLAG_GHOST_CONTRIBUTOR",
          "severity": "MEDIUM",
          "description": "0% Tier-3 code. 86% of contributions are documentation/styling only."
        }
      ],
      "sub_scores": {
        "git_forensics": 45,
        "ast_complexity": 5,
        "viva_defense": null
      },
      "pramaan_score": null,
      "verdict": "GHOST_CONTRIBUTOR",
      "radar_axes": {
        "algorithmic_depth": 0,
        "iterative_churn": 35,
        "commit_consistency": 55,
        "code_breadth": 8,
        "ast_complexity": 3
      }
    }
  ],

  "timeline": [
    {
      "commit_hash": "a1b2c3d",
      "author": "Rohit Sharma",
      "contributor_id": "contrib-001",
      "timestamp": "2026-10-01T10:30:00Z",
      "message": "init: FastAPI project structure with SQLAlchemy models",
      "lines_added": 120,
      "lines_deleted": 0,
      "files_changed": 8,
      "is_anomalous": false,
      "day_index": 1
    },
    {
      "commit_hash": "e4f5g6h",
      "author": "Aryan Kumar",
      "contributor_id": "contrib-002",
      "timestamp": "2026-10-01T22:00:00Z",
      "message": "first commit",
      "lines_added": 8,
      "lines_deleted": 0,
      "files_changed": 1,
      "is_anomalous": false,
      "day_index": 1
    },
    {
      "commit_hash": "4a82e1f",
      "author": "Aryan Kumar",
      "contributor_id": "contrib-002",
      "timestamp": "2026-10-14T03:42:00Z",
      "message": "added frontend",
      "lines_added": 4821,
      "lines_deleted": 0,
      "files_changed": 47,
      "is_anomalous": true,
      "anomaly_type": "FLAG_BIG_BANG",
      "day_index": 14
    }
  ],

  "anomalies": [
    {
      "id": "anomaly-001",
      "type": "FLAG_BIG_BANG",
      "severity": "CRITICAL",
      "contributor_id": "contrib-002",
      "contributor_name": "Aryan Kumar",
      "commit_hash": "4a82e1f",
      "evidence_summary": "Single commit of +4,821 lines at 03:42 AM with commit message 'added frontend'. Zero deletions indicate no iterative development. 100% of contribution occurred within 8 hours of deadline.",
      "timestamp": "2026-10-14T03:42:00Z"
    },
    {
      "id": "anomaly-002",
      "type": "FLAG_GHOST_CONTRIBUTOR",
      "severity": "MEDIUM",
      "contributor_id": "contrib-003",
      "contributor_name": "Priya Patel",
      "commit_hash": null,
      "evidence_summary": "0% Tier-3 algorithmic code authored. All 5 commits limited to README.md and CSS styling files. No functional code contributions across 14-day project window.",
      "timestamp": null
    }
  ],

  "executive_summary": "Rohit Sharma is the sole functional architect of this project, authoring 100% of Tier-3 backend logic across 38 atomic commits over 14 days with a healthy 38% churn ratio. Aryan Kumar's single 4,821-line frontend dump at 03:42 AM shows zero iterative debugging and structural patterns consistent with template copy-paste. Priya Patel contributed exclusively to documentation and CSS styling with zero functional code."
}
```

---

## 4. POST `/api/v1/viva/{id}/questions` — Generate Viva Questions

### Request:
```json
{
  "contributor_id": "contrib-002",
  "question_count": 3
}
```

### Response (200 OK):
```json
{
  "contributor_id": "contrib-002",
  "contributor_name": "Aryan Kumar",
  "questions": [
    {
      "id": "viva-q-001",
      "commit_hash": "4a82e1f",
      "file_path": "frontend/src/hooks/useAuthContext.jsx",
      "line_range": "12-34",
      "code_snippet": "export function useAuthContext() {\n  const [user, setUser] = useState(null);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {\n      setUser(currentUser);\n      setLoading(false);\n    });\n    return () => unsubscribe();\n  }, []);\n\n  const login = async (email, password) => {\n    try {\n      const result = await signInWithEmailAndPassword(auth, email, password);\n      return result.user;\n    } catch (error) {\n      throw new Error(mapAuthError(error.code));\n    }\n  };\n\n  return { user, loading, login, logout };\n}",
      "referenced_lines": [18, 22, 23],
      "category": "FAILURE_EDGE_CASE",
      "difficulty": "Hard",
      "question_text": "Aryan, in your useAuthContext hook at line 18, you call onAuthStateChanged to track authentication state. If the Firebase auth token expires while the user has an active WebSocket connection on the dashboard, how does your hook propagate the re-authentication requirement to the WebSocket layer? I don't see any token refresh logic here.",
      "expected_key_concepts": ["token refresh propagation", "WebSocket reconnection", "auth state listener scope", "stale closure"],
      "trap_signals": ["Says it handles it automatically", "Cannot explain the auth state flow"]
    },
    {
      "id": "viva-q-002",
      "commit_hash": "4a82e1f",
      "file_path": "frontend/src/pages/Dashboard.jsx",
      "line_range": "45-68",
      "code_snippet": "// ... dashboard component code ...",
      "referenced_lines": [52, 58],
      "category": "IMPLEMENTATION_TRADEOFF",
      "difficulty": "Medium",
      "question_text": "On line 52 of Dashboard.jsx, you fetch all courses using a single useEffect with an empty dependency array. If a professor adds a new course while a student has the dashboard open, the student will never see the update until they manually refresh. Why didn't you implement real-time updates here, and what would you change?",
      "expected_key_concepts": ["stale data problem", "polling vs websockets", "React Query or SWR", "cache invalidation"],
      "trap_signals": ["Says useEffect handles real-time updates", "Doesn't acknowledge the stale data issue"]
    },
    {
      "id": "viva-q-003",
      "commit_hash": "4a82e1f",
      "file_path": "frontend/src/components/CourseCard.jsx",
      "line_range": "8-25",
      "code_snippet": "// ... course card component ...",
      "referenced_lines": [12, 15],
      "category": "SCALABILITY",
      "difficulty": "Medium",
      "question_text": "In CourseCard.jsx at line 12, you render a list of enrolled students directly inside each card using map(). If a course has 500 enrolled students, this will render 500 DOM nodes per card. With 20 courses visible, that's 10,000 DOM nodes. How would you optimize this?",
      "expected_key_concepts": ["virtualization", "react-window", "pagination", "lazy loading"],
      "trap_signals": ["Says React handles it automatically", "Cannot identify the performance issue"]
    }
  ]
}
```

---

## 5. POST `/api/v1/viva/evaluate` — Grade Viva Answer

### Request:
```json
{
  "question_id": "viva-q-001",
  "student_answer": "The useAuthContext hook uses Firebase onAuthStateChanged which automatically handles token refresh in the background. It's a real-time listener that keeps the authentication state synchronized across the application."
}
```

### Response (200 OK) — Fluff Detected:
```json
{
  "question_id": "viva-q-001",
  "score": 24,
  "technical_accuracy": 30,
  "tactical_authenticity": 15,
  "edge_case_preparedness": 20,
  "verdict": "PROBABLE_FREELOADER",
  "key_concepts_covered": [],
  "missed_concepts": ["token refresh propagation", "WebSocket reconnection", "stale closure"],
  "builder_signals_detected": [],
  "fluff_signals_detected": [
    "Uses generic phrase 'automatically handles' without explaining mechanism",
    "Describes Firebase feature documentation rather than personal implementation experience",
    "Does not address the WebSocket propagation issue raised in the question"
  ],
  "feedback": "Your answer describes what Firebase's onAuthStateChanged does in general terms, but does not address the specific question about WebSocket re-authentication propagation. A developer who implemented this hook would know that onAuthStateChanged doesn't communicate with the WebSocket layer — that requires explicit handling.",
  "evaluator_note": "High probability the contributor copy-pasted this auth hook without understanding the cross-layer authentication flow."
}
```

---

## 6. Using Mock Data in Frontend Development

### Setup: Create `frontend/src/lib/mock-data.ts`
```typescript
// Import this file during development when backend is not running
// Toggle with: NEXT_PUBLIC_USE_MOCK=true in .env.local

import statusProcessing from './mocks/status-processing.json';
import statusComplete from './mocks/status-complete.json';
import fullReport from './mocks/full-report.json';
import vivaQuestions from './mocks/viva-questions.json';
import vivaEvalFluff from './mocks/viva-eval-fluff.json';
import vivaEvalBuilder from './mocks/viva-eval-builder.json';

export const mockData = {
  statusProcessing,
  statusComplete,
  fullReport,
  vivaQuestions,
  vivaEvalFluff,
  vivaEvalBuilder,
};
```

### API Wrapper with Mock Toggle:
```typescript
// frontend/src/lib/api.ts
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export async function getReport(analysisId: string) {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 800)); // Simulate network delay
    return mockData.fullReport;
  }
  return fetch(`${API_URL}/api/v1/analyze/${analysisId}/report`).then(r => r.json());
}
```
