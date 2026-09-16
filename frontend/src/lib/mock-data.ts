/**
 * Pramaan AI — Standard Mock Data Contracts & Fallbacks
 * Directly ported from docs/SAMPLE_API_DATA.md
 */

export interface Phase {
  name: string;
  status: "pending" | "active" | "completed";
  duration_ms: number | null;
}

export interface LiveMetrics {
  total_commits: number;
  total_lines: number;
  contributors_found: number;
  files_analyzed: number;
}

export interface EarlyRedFlag {
  id: string;
  type: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  contributor_name: string;
  description: string;
  details: string;
}

export interface AnalysisStatusResponse {
  analysis_id: string;
  status: "processing" | "completed" | "failed";
  progress_percent: number;
  current_step: string;
  elapsed_seconds: number;
  phases: Phase[];
  live_metrics?: LiveMetrics;
  early_red_flags?: EarlyRedFlag[];
}

export interface TierBreakdownItem {
  lines: number;
  percentage: number;
}

export interface Contributor {
  id: string;
  primary_name: string;
  emails: string[];
  avatar_color: string;
  total_commits: number;
  lines_added: number;
  lines_deleted: number;
  net_lines: number;
  churn_ratio: number;
  tier_breakdown: {
    tier_0: TierBreakdownItem;
    tier_1: TierBreakdownItem;
    tier_2: TierBreakdownItem;
    tier_3: TierBreakdownItem;
  };
  commit_cadence: {
    first_commit: string;
    last_commit: string;
    active_days: number;
    avg_commits_per_day: number;
    most_active_hour: number;
    burstiness_score: number;
  };
  commit_message_quality_avg: number;
  anomaly_flags: {
    type: string;
    severity: string;
    description: string;
  }[];
  sub_scores: {
    git_forensics: number;
    ast_complexity: number;
    viva_defense: number | null;
  };
  pramaan_score: number | null;
  verdict: "VERIFIED_BUILDER" | "PROBABLE_AUTHOR" | "SUSPECT_FREELOADER" | "GHOST_CONTRIBUTOR" | "UNPREPARED";
  radar_axes: {
    algorithmic_depth: number;
    iterative_churn: number;
    commit_consistency: number;
    code_breadth: number;
    ast_complexity: number;
  };
}

export interface TimelineCommit {
  commit_hash: string;
  author: string;
  contributor_id: string;
  timestamp: string;
  message: string;
  lines_added: number;
  lines_deleted: number;
  files_changed: number;
  is_anomalous: boolean;
  anomaly_type?: string;
  day_index: number;
}

export interface Anomaly {
  id: string;
  type: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  contributor_id: string;
  contributor_name: string;
  commit_hash: string | null;
  evidence_summary: string;
  timestamp: string | null;
}

export interface FullReportResponse {
  analysis_id: string;
  repo_url: string;
  branch: string;
  total_commits: number;
  total_lines_audited: number;
  total_files: number;
  analysis_duration_seconds: number;
  integrity_grade: string;
  overall_pramaan_score: number;
  contributors: Contributor[];
  timeline: TimelineCommit[];
  anomalies: Anomaly[];
  executive_summary: string;
}

export interface VivaQuestion {
  id: string;
  commit_hash: string;
  file_path: string;
  line_range: string;
  code_snippet: string;
  referenced_lines: number[];
  category: "FAILURE_EDGE_CASE" | "IMPLEMENTATION_TRADEOFF" | "SCALABILITY" | "REFACTORING_INTENT" | "SECURITY";
  difficulty: "Easy" | "Medium" | "Hard";
  question_text: string;
  expected_key_concepts: string[];
  trap_signals: string[];
}

export interface VivaQuestionsResponse {
  contributor_id: string;
  contributor_name: string;
  questions: VivaQuestion[];
}

export interface VivaEvaluationResponse {
  question_id: string;
  score: number;
  technical_accuracy: number;
  tactical_authenticity: number;
  edge_case_preparedness: number;
  verdict: "VERIFIED_BUILDER" | "PROBABLE_AUTHOR" | "SUSPECT_AI_FLUFF" | "PROBABLE_FREELOADER";
  key_concepts_covered: string[];
  missed_concepts: string[];
  builder_signals_detected: string[];
  fluff_signals_detected: string[];
  feedback: string;
  evaluator_note: string;
}

// ════════════════════ MOCK DATA OBJECTS ════════════════════

export const mockStatusProcessing: AnalysisStatusResponse = {
  analysis_id: "8fae491c-7721-4f11-b51c-8e4210d3f23a",
  status: "processing",
  progress_percent: 45,
  current_step: "Mining 45 commits — extracting diffs and churn metrics",
  elapsed_seconds: 4.2,
  phases: [
    { name: "Cloning Repository", status: "completed", duration_ms: 2100 },
    { name: "Mining Commits", status: "active", duration_ms: null },
    { name: "Identity Resolution", status: "pending", duration_ms: null },
    { name: "AST Tier Classification", status: "pending", duration_ms: null },
    { name: "Anomaly Detection", status: "pending", duration_ms: null },
    { name: "Viva Question Generation", status: "pending", duration_ms: null },
  ],
  live_metrics: {
    total_commits: 45,
    total_lines: 12840,
    contributors_found: 3,
    files_analyzed: 42,
  },
  early_red_flags: [],
};

export const mockStatusProcessingWithFlag: AnalysisStatusResponse = {
  analysis_id: "8fae491c-7721-4f11-b51c-8e4210d3f23a",
  status: "processing",
  progress_percent: 78,
  current_step: "Calculating AST tier complexity for 67 source files",
  elapsed_seconds: 7.8,
  phases: [
    { name: "Cloning Repository", status: "completed", duration_ms: 2100 },
    { name: "Mining Commits", status: "completed", duration_ms: 3200 },
    { name: "Identity Resolution", status: "completed", duration_ms: 400 },
    { name: "AST Tier Classification", status: "active", duration_ms: null },
    { name: "Anomaly Detection", status: "pending", duration_ms: null },
    { name: "Viva Question Generation", status: "pending", duration_ms: null },
  ],
  live_metrics: {
    total_commits: 45,
    total_lines: 18420,
    contributors_found: 3,
    files_analyzed: 67,
  },
  early_red_flags: [
    {
      id: "flag-001",
      type: "FLAG_BIG_BANG",
      severity: "CRITICAL",
      contributor_name: "Aryan Kumar",
      description: "1 commit | +4,821 lines | 0 deletions | Timestamp: Oct 14, 03:42 AM",
      details: "Single massive code injection 6 hours before deadline with zero iterative debugging history.",
    },
  ],
};

export const mockStatusCompleted: AnalysisStatusResponse = {
  analysis_id: "8fae491c-7721-4f11-b51c-8e4210d3f23a",
  status: "completed",
  progress_percent: 100,
  current_step: "Analysis complete",
  elapsed_seconds: 11.2,
  phases: [
    { name: "Cloning Repository", status: "completed", duration_ms: 2100 },
    { name: "Mining Commits", status: "completed", duration_ms: 3200 },
    { name: "Identity Resolution", status: "completed", duration_ms: 400 },
    { name: "AST Tier Classification", status: "completed", duration_ms: 2800 },
    { name: "Anomaly Detection", status: "completed", duration_ms: 1200 },
    { name: "Viva Question Generation", status: "completed", duration_ms: 1500 },
  ],
};

export const mockFullReport: FullReportResponse = {
  analysis_id: "8fae491c-7721-4f11-b51c-8e4210d3f23a",
  repo_url: "https://github.com/demo/smart-campus-app",
  branch: "main",
  total_commits: 45,
  total_lines_audited: 18420,
  total_files: 67,
  analysis_duration_seconds: 11.2,
  integrity_grade: "C+",
  overall_pramaan_score: 51.0,

  contributors: [
    {
      id: "contrib-001",
      primary_name: "Rohit Sharma",
      emails: ["rohit.sharma@university.edu"],
      avatar_color: "#10B981",
      total_commits: 38,
      lines_added: 13547,
      lines_deleted: 4280,
      net_lines: 9267,
      churn_ratio: 38.2,
      tier_breakdown: {
        tier_0: { lines: 320, percentage: 2.4 },
        tier_1: { lines: 1890, percentage: 13.9 },
        tier_2: { lines: 4120, percentage: 30.4 },
        tier_3: { lines: 7217, percentage: 53.3 },
      },
      commit_cadence: {
        first_commit: "2026-10-01T10:30:00Z",
        last_commit: "2026-10-14T16:20:00Z",
        active_days: 12,
        avg_commits_per_day: 3.2,
        most_active_hour: 14,
        burstiness_score: 0.15,
      },
      commit_message_quality_avg: 78,
      anomaly_flags: [],
      sub_scores: {
        git_forensics: 92,
        ast_complexity: 88,
        viva_defense: 98,
      },
      pramaan_score: 94,
      verdict: "VERIFIED_BUILDER",
      radar_axes: {
        algorithmic_depth: 88,
        iterative_churn: 82,
        commit_consistency: 95,
        code_breadth: 78,
        ast_complexity: 91,
      },
    },
    {
      id: "contrib-002",
      primary_name: "Aryan Kumar",
      emails: ["aryan.kumar.dev@gmail.com"],
      avatar_color: "#EF4444",
      total_commits: 2,
      lines_added: 4829,
      lines_deleted: 0,
      net_lines: 4829,
      churn_ratio: 0.0,
      tier_breakdown: {
        tier_0: { lines: 1200, percentage: 24.8 },
        tier_1: { lines: 2890, percentage: 59.8 },
        tier_2: { lines: 650, percentage: 13.5 },
        tier_3: { lines: 89, percentage: 1.9 },
      },
      commit_cadence: {
        first_commit: "2026-10-01T22:00:00Z",
        last_commit: "2026-10-14T03:42:00Z",
        active_days: 2,
        avg_commits_per_day: 1.0,
        most_active_hour: 3,
        burstiness_score: 0.98,
      },
      commit_message_quality_avg: 18,
      anomaly_flags: [
        {
          type: "FLAG_BIG_BANG",
          severity: "CRITICAL",
          description: "1 commit of +4,821 lines with 0 deletions at 03:42 AM",
        },
        {
          type: "FLAG_ZERO_CHURN",
          severity: "HIGH",
          description: "0% churn ratio — no modifications or deletions indicating no debugging",
        },
        {
          type: "FLAG_PANIC_BURST",
          severity: "HIGH",
          description: "100% of contributions made within 8 hours of submission deadline",
        },
      ],
      sub_scores: {
        git_forensics: 12,
        ast_complexity: 18,
        viva_defense: 24,
      },
      pramaan_score: 24,
      verdict: "SUSPECT_FREELOADER",
      radar_axes: {
        algorithmic_depth: 8,
        iterative_churn: 0,
        commit_consistency: 5,
        code_breadth: 15,
        ast_complexity: 12,
      },
    },
    {
      id: "contrib-003",
      primary_name: "Priya Patel",
      emails: ["priya.p@university.edu"],
      avatar_color: "#F59E0B",
      total_commits: 5,
      lines_added: 64,
      lines_deleted: 25,
      net_lines: 39,
      churn_ratio: 28.0,
      tier_breakdown: {
        tier_0: { lines: 6, percentage: 9.4 },
        tier_1: { lines: 55, percentage: 85.9 },
        tier_2: { lines: 3, percentage: 4.7 },
        tier_3: { lines: 0, percentage: 0.0 },
      },
      commit_cadence: {
        first_commit: "2026-10-03T11:00:00Z",
        last_commit: "2026-10-13T15:30:00Z",
        active_days: 5,
        avg_commits_per_day: 1.0,
        most_active_hour: 13,
        burstiness_score: 0.22,
      },
      commit_message_quality_avg: 25,
      anomaly_flags: [
        {
          type: "FLAG_GHOST_CONTRIBUTOR",
          severity: "MEDIUM",
          description: "0% Tier-3 code. 86% of contributions are documentation/styling only.",
        },
      ],
      sub_scores: {
        git_forensics: 45,
        ast_complexity: 5,
        viva_defense: 40,
      },
      pramaan_score: 35,
      verdict: "GHOST_CONTRIBUTOR",
      radar_axes: {
        algorithmic_depth: 0,
        iterative_churn: 35,
        commit_consistency: 55,
        code_breadth: 8,
        ast_complexity: 3,
      },
    },
  ],

  timeline: [
    {
      commit_hash: "a1b2c3d",
      author: "Rohit Sharma",
      contributor_id: "contrib-001",
      timestamp: "2026-10-01T10:30:00Z",
      message: "init: FastAPI project structure with SQLAlchemy models",
      lines_added: 120,
      lines_deleted: 0,
      files_changed: 8,
      is_anomalous: false,
      day_index: 1,
    },
    {
      commit_hash: "e4f5g6h",
      author: "Aryan Kumar",
      contributor_id: "contrib-002",
      timestamp: "2026-10-01T22:00:00Z",
      message: "first commit",
      lines_added: 8,
      lines_deleted: 0,
      files_changed: 1,
      is_anomalous: false,
      day_index: 1,
    },
    {
      commit_hash: "b7c8d9e",
      author: "Rohit Sharma",
      contributor_id: "contrib-001",
      timestamp: "2026-10-02T14:15:00Z",
      message: "feat: implement JWT auth with refresh token rotation",
      lines_added: 145,
      lines_deleted: 0,
      files_changed: 4,
      is_anomalous: false,
      day_index: 2,
    },
    {
      commit_hash: "c9d0e1f",
      author: "Priya Patel",
      contributor_id: "contrib-003",
      timestamp: "2026-10-03T11:00:00Z",
      message: "updated readme with project description",
      lines_added: 25,
      lines_deleted: 2,
      files_changed: 1,
      is_anomalous: false,
      day_index: 3,
    },
    {
      commit_hash: "4a82e1f",
      author: "Aryan Kumar",
      contributor_id: "contrib-002",
      timestamp: "2026-10-14T03:42:00Z",
      message: "added frontend",
      lines_added: 4821,
      lines_deleted: 0,
      files_changed: 47,
      is_anomalous: true,
      anomaly_type: "FLAG_BIG_BANG",
      day_index: 14,
    },
  ],

  anomalies: [
    {
      id: "anomaly-001",
      type: "FLAG_BIG_BANG",
      severity: "CRITICAL",
      contributor_id: "contrib-002",
      contributor_name: "Aryan Kumar",
      commit_hash: "4a82e1f",
      evidence_summary:
        "Single commit of +4,821 lines at 03:42 AM with commit message 'added frontend'. Zero deletions indicate no iterative development. 100% of contribution occurred within 8 hours of deadline.",
      timestamp: "2026-10-14T03:42:00Z",
    },
    {
      id: "anomaly-002",
      type: "FLAG_GHOST_CONTRIBUTOR",
      severity: "MEDIUM",
      contributor_id: "contrib-003",
      contributor_name: "Priya Patel",
      commit_hash: null,
      evidence_summary:
        "0% Tier-3 algorithmic code authored. All 5 commits limited to README.md and CSS styling files. No functional code contributions across 14-day project window.",
      timestamp: null,
    },
  ],

  executive_summary:
    "Rohit Sharma is the sole functional architect of this project, authoring 100% of Tier-3 backend logic across 38 atomic commits over 14 days with a healthy 38% churn ratio. Aryan Kumar's single 4,821-line frontend dump at 03:42 AM shows zero iterative debugging and structural patterns consistent with template copy-paste. Priya Patel contributed exclusively to documentation and CSS styling with zero functional code.",
};

export const mockVivaQuestions: Record<string, VivaQuestion[]> = {
  "contrib-002": [
    {
      id: "viva-q-001",
      commit_hash: "4a82e1f",
      file_path: "frontend/src/hooks/useAuthContext.jsx",
      line_range: "12-34",
      code_snippet: `export function useAuthContext() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      throw new Error(mapAuthError(error.code));
    }
  };

  return { user, loading, login, logout };
}`,
      referenced_lines: [18, 22, 23],
      category: "FAILURE_EDGE_CASE",
      difficulty: "Hard",
      question_text:
        "Aryan, in your useAuthContext hook at line 18, you call onAuthStateChanged to track authentication state. If the Firebase auth token expires while the user has an active WebSocket connection on the dashboard, how does your hook propagate the re-authentication requirement to the WebSocket layer? I don't see any token refresh logic here.",
      expected_key_concepts: [
        "token refresh propagation",
        "WebSocket reconnection",
        "auth state listener scope",
        "stale closure",
      ],
      trap_signals: ["Says it handles it automatically", "Cannot explain the auth state flow"],
    },
    {
      id: "viva-q-002",
      commit_hash: "4a82e1f",
      file_path: "frontend/src/pages/Dashboard.jsx",
      line_range: "45-68",
      code_snippet: `// Dashboard view component
useEffect(() => {
  async function fetchCourses() {
    const res = await api.get('/courses');
    setCourses(res.data);
  }
  fetchCourses();
}, []);`,
      referenced_lines: [52, 58],
      category: "IMPLEMENTATION_TRADEOFF",
      difficulty: "Medium",
      question_text:
        "On line 52 of Dashboard.jsx, you fetch all courses using a single useEffect with an empty dependency array. If a professor adds a new course while a student has the dashboard open, the student will never see the update until they manually refresh. Why didn't you implement real-time updates here, and what would you change?",
      expected_key_concepts: ["stale data problem", "polling vs websockets", "React Query or SWR", "cache invalidation"],
      trap_signals: ["Says useEffect handles real-time updates", "Doesn't acknowledge the stale data issue"],
    },
    {
      id: "viva-q-003",
      commit_hash: "4a82e1f",
      file_path: "frontend/src/components/CourseCard.jsx",
      line_range: "8-25",
      code_snippet: `export function CourseCard({ course }) {
  return (
    <div className="card">
      <h3>{course.title}</h3>
      {course.students.map(s => (
        <span key={s.id}>{s.name}</span>
      ))}
    </div>
  );
}`,
      referenced_lines: [12, 15],
      category: "SCALABILITY",
      difficulty: "Medium",
      question_text:
        "In CourseCard.jsx at line 12, you render a list of enrolled students directly inside each card using map(). If a course has 500 enrolled students, this will render 500 DOM nodes per card. With 20 courses visible, that's 10,000 DOM nodes. How would you optimize this?",
      expected_key_concepts: ["virtualization", "react-window", "pagination", "lazy loading"],
      trap_signals: ["Says React handles it automatically", "Cannot identify the performance issue"],
    },
  ],
  "contrib-001": [
    {
      id: "viva-q-101",
      commit_hash: "b7c8d9e",
      file_path: "backend/app/services/auth_service.py",
      line_range: "172-185",
      code_snippet: `async def rotate_refresh_token(self, user_id: str, old_token: str) -> dict:
    lock = await self._acquire_user_lock(user_id)
    if not lock:
        raise HTTPException(status_code=429, detail="Concurrent refresh detected")
    try:
        await self._invalidate_token(old_token)
        new_access = await self.create_access_token(user_id)
        new_refresh = await self._generate_refresh_token(user_id)
        return {"access_token": new_access, "refresh_token": new_refresh}
    finally:
        await self._release_user_lock(user_id)`,
      referenced_lines: [173, 174, 184],
      category: "FAILURE_EDGE_CASE",
      difficulty: "Hard",
      question_text:
        "Rohit, in your rotate_refresh_token method in auth_service.py, you acquire a user lock before token revocation. If Redis experiences a network partition right after _invalidate_token succeeds but before new tokens are generated, how does your system recover without permanently locking the user out?",
      expected_key_concepts: ["redis lock TTL expiration", "idempotency replay", "revocation rollback", "heartbeat"],
      trap_signals: ["Says redis never fails", "Claims database handles redis locks"],
    },
  ],
};

export const mockVivaEvalFluff: VivaEvaluationResponse = {
  question_id: "viva-q-001",
  score: 24,
  technical_accuracy: 30,
  tactical_authenticity: 15,
  edge_case_preparedness: 20,
  verdict: "PROBABLE_FREELOADER",
  key_concepts_covered: [],
  missed_concepts: ["token refresh propagation", "WebSocket reconnection", "stale closure"],
  builder_signals_detected: [],
  fluff_signals_detected: [
    "Uses generic phrase 'automatically handles' without explaining mechanism",
    "Describes Firebase feature documentation rather than personal implementation experience",
    "Does not address the WebSocket propagation issue raised in the question",
  ],
  feedback:
    "Your answer describes what Firebase's onAuthStateChanged does in general terms, but does not address the specific question about WebSocket re-authentication propagation. A developer who implemented this hook would know that onAuthStateChanged doesn't communicate with the WebSocket layer — that requires explicit handling.",
  evaluator_note:
    "High probability the contributor copy-pasted this auth hook without understanding the cross-layer authentication flow.",
};

export const mockVivaEvalBuilder: VivaEvaluationResponse = {
  question_id: "viva-q-101",
  score: 95,
  technical_accuracy: 96,
  tactical_authenticity: 94,
  edge_case_preparedness: 95,
  verdict: "VERIFIED_BUILDER",
  key_concepts_covered: ["redis lock TTL expiration", "idempotency replay", "revocation rollback"],
  missed_concepts: [],
  builder_signals_detected: [
    "Specifically mentioned setting a 5-second TTL on the Redis SETNX key to prevent deadlock",
    "Addressed token family revocation tracking with audit log",
    "Referenced exact exception handling pattern used in codebase",
  ],
  fluff_signals_detected: [],
  feedback:
    "Outstanding defense. You demonstrated intimate familiarity with the concurrency constraints and distributed locking mechanics of your implementation.",
  evaluator_note: "Flawless technical mastery confirmed.",
};
