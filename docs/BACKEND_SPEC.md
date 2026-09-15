# ⚙️ Pramaan AI — Backend Architecture & Forensic Engine Spec

> **Framework:** FastAPI (Python 3.11+)  
> **Core Libraries:** `pydriller`, `GitPython`, `tree-sitter`, `google-genai`, `sqlalchemy`, `pydantic-v2`  
> **Philosophy:** Deterministic forensic calculations, strict data modeling, zero mock endpoints.

---

## 1. Directory Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   ├── analyze.py        # Ingestion, cloning & forensic trigger
│   │   │   ├── viva.py           # Viva question generation & answer grading
│   │   │   ├── report.py         # Scorecard, receipt generation & export
│   │   │   └── router.py         # Main APIRouter mounting
│   ├── core/
│   │   ├── config.py             # App settings, Gemini API keys, repo cache dirs
│   │   └── database.py           # SQLAlchemy SQLite / Postgres engine & sessions
│   ├── engine/
│   │   ├── git_miner.py          # PyDriller commit traversal & metric extraction
│   │   ├── alias_resolver.py     # Multi-email author identity deduplication
│   │   ├── ast_classifier.py     # Code tier weighting (Tier 0 - 3) & complexity
│   │   ├── anomaly_detector.py   # Red-flag heuristic rules (Big Bang, Ghost)
│   │   └── viva_examiner.py      # Gemini LLM integration for questions & evaluation
│   ├── models/
│   │   ├── db_models.py          # SQLAlchemy ORM models
│   │   └── schemas.py            # Pydantic v2 validation & response contracts
│   └── main.py                   # FastAPI entrypoint, CORS & middleware
├── requirements.txt
└── tests/
```

---

## 2. Forensic Mining Algorithms & Heuristics

### 2.1 Git Extraction Pipeline (`engine/git_miner.py`)
Using `pydriller.Repository`:
```python
# Traverses commits in chronological order
for commit in Repository(repo_path).traverse_commits():
    # 1. Author and timestamp capture
    # 2. Files modified count & diff parsing
    # 3. Lines added vs deleted per author
    # 4. AST complexity calculation per modified file
```

### 2.2 Multi-Email Identity Resolution (`engine/alias_resolver.py`)
Students often commit using differing configurations:
- `alex@univ.edu`
- `alexander.dev@gmail.com`
- `alex-github`

**Resolution Algorithm:**
1. Group commits by normalized name (lowercased, punctuation removed).
2. Check email prefixes using Levenshtein similarity (threshold $> 0.85$).
3. Merge records under the primary contributor profile:
   $$\text{Profile}_{\text{final}} = \bigcup (\text{Commits}_{\text{alias}_1}, \text{Commits}_{\text{alias}_2})$$

### 2.3 AST & Code Tier Classification (`engine/ast_classifier.py`)
Each modified file in a commit is mapped to a weight tier:

```python
TIER_RULES = {
    0: {  # Ignored (0.0x)
        "extensions": [".lock", ".json", ".svg", ".min.js", ".min.css", ".map", ".png", ".jpg", ".md"],
        "paths": ["node_modules/", "vendor/", "dist/", "build/", ".git/", "migrations/"]
    },
    1: {  # Boilerplate (0.2x)
        "extensions": [".html", ".css", ".scss"],
        "patterns": ["config", "setup", "dotenv", "types.ts", "interface"]
    },
    2: {  # Application / UI Logic (1.0x)
        "patterns": ["components/", "routes/", "views/", "controllers/", "pages/"]
    },
    3: {  # Core Algorithmic / Deep Logic (3.0x)
        "patterns": ["services/", "algorithms/", "crypto/", "auth/", "utils/", "engine/"],
        "ast_checks": ["while", "for", "recursion", "async_locks", "math", "custom_data_structures"]
    }
}
```

### 2.4 Anomaly Detection Rules (`engine/anomaly_detector.py`)

1. **Big Bang Dump (`FLAG_BIG_BANG`):**
   $$\text{Condition:} \quad (\text{Commits}_{\text{author}} \le 2) \land (\text{LinesAdded}_{\text{author}} > 0.35 \times \text{TotalLinesAdded})$$
   *Severity:* High (Crimson Alert)

2. **The Lockstep Ghost (`FLAG_GHOST_CONTRIBUTOR`):**
   $$\text{Condition:} \quad (\text{Tier3Lines}_{\text{author}} == 0) \land (\text{DocumentationLinesRatio} > 0.80)$$
   *Severity:* Medium (Amber Alert)

3. **Zero Deletion / Monolithic Inject (`FLAG_ZERO_CHURN`):**
   $$\text{Condition:} \quad (\text{LinesAdded} > 1500) \land (\text{LinesDeleted} < 5)$$
   *Indication:* Lack of iterative debugging; high probability of copy-pasted bundle or AI dump.

4. **Off-Hours Panic Influx (`FLAG_PANIC_BURST`):**
   $$\text{Condition:} \quad > 70\% \text{ of all contributions made within 8 hours of submission deadline.}$$

---

## 3. Database Schema (`models/db_models.py`)

```python
class AnalysisRun(Base):
    __tablename__ = "analysis_runs"
    id = Column(String, primary_key=True, default=uuid4_str)
    repo_url = Column(String, nullable=False)
    branch = Column(String, default="main")
    status = Column(String, default="queued") # queued, processing, completed, failed
    overall_pramaan_score = Column(Float, nullable=True)
    total_commits = Column(Integer, default=0)
    total_lines = Column(Integer, default=0)
    integrity_verdict = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    contributors = relationship("Contributor", back_populates="run")

class Contributor(Base):
    __tablename__ = "contributors"
    id = Column(String, primary_key=True, default=uuid4_str)
    analysis_id = Column(String, ForeignKey("analysis_runs.id"))
    primary_name = Column(String, nullable=False)
    emails = Column(JSON) # ["a@b.com", "c@d.com"]
    total_commits = Column(Integer, default=0)
    lines_added = Column(Integer, default=0)
    lines_deleted = Column(Integer, default=0)
    tier3_weighted_lines = Column(Float, default=0.0)
    churn_ratio = Column(Float, default=0.0)
    pramaan_score = Column(Float, default=0.0)
    anomaly_flags = Column(JSON, default=list) # ["FLAG_BIG_BANG"]
    
    viva_questions = relationship("VivaQuestion", back_populates="contributor")

class VivaQuestion(Base):
    __tablename__ = "viva_questions"
    id = Column(String, primary_key=True, default=uuid4_str)
    contributor_id = Column(String, ForeignKey("contributors.id"))
    commit_hash = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    line_range = Column(String, nullable=False) # "45-62"
    code_snippet = Column(Text, nullable=False)
    question_text = Column(Text, nullable=False)
    expected_concepts = Column(JSON) # ["mutex", "race condition"]
    difficulty = Column(String, default="Medium")
    
    submission = relationship("VivaSubmission", uselist=False, back_populates="question")

class VivaSubmission(Base):
    __tablename__ = "viva_submissions"
    id = Column(String, primary_key=True, default=uuid4_str)
    question_id = Column(String, ForeignKey("viva_questions.id"))
    student_answer = Column(Text, nullable=False)
    score = Column(Float, default=0.0) # 0 to 100
    technical_accuracy = Column(Float, default=0.0)
    authenticity_verdict = Column(String) # "VERIFIED_BUILDER", "SUSPECT_AI", "UNPREPARED"
    feedback = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
```

---

## 4. REST API Endpoints Specification

### 4.1 Ingestion & Analysis Trigger
- **Endpoint:** `POST /api/v1/analyze/repo`
- **Request Body:**
  ```json
  {
    "repo_url": "https://github.com/team/capstone-project",
    "branch": "main"
  }
  ```
- **Response (202 Accepted):**
  ```json
  {
    "analysis_id": "8fae491c-7721-4f11-b51c-8e4210d3f23a",
    "status": "processing",
    "message": "Repository cloned. Forensic analysis pipeline initialized."
  }
  ```

### 4.2 Analysis Progress & Status
- **Endpoint:** `GET /api/v1/analyze/{analysis_id}/status`
- **Response (200 OK):**
  ```json
  {
    "analysis_id": "8fae491c-7721-4f11-b51c-8e4210d3f23a",
    "status": "processing",
    "progress_percent": 68,
    "current_step": "Calculating AST tier complexity for 84 commits"
  }
  ```

### 4.3 Complete Forensic Report
- **Endpoint:** `GET /api/v1/analyze/{analysis_id}/report`
- **Response (200 OK):** Contains repository totals, timeline scrub events, contributor matrix, and flagged anomalies.

### 4.4 Generate Targeted Viva Questions
- **Endpoint:** `POST /api/v1/viva/{analysis_id}/questions`
- **Request Body:**
  ```json
  {
    "contributor_id": "contributor_uuid",
    "question_count": 3
  }
  ```
- **Response (200 OK):** Returns array of question objects with code snippets and diff hashes.

### 4.5 Submit and Evaluate Viva Answer
- **Endpoint:** `POST /api/v1/viva/evaluate`
- **Request Body:**
  ```json
  {
    "question_id": "viva_uuid",
    "student_answer": "I used a Redis distributed lock with a 5-second TTL to make sure two simultaneous requests don't invalidate the refresh token twice."
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "score": 92.5,
    "authenticity_verdict": "VERIFIED_BUILDER",
    "technical_accuracy": 95.0,
    "strengths": ["Correctly identified distributed locking requirement", "Understands TTL expiration"],
    "weaknesses": ["Did not mention redlock algorithm failover"],
    "feedback": "Deep tactical understanding of committed code verified."
  }
  ```
