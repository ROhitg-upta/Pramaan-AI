-- ==============================================================================
-- Pramaan AI Migration 001: Initial Authoritative Assessment & Auth Schema
-- Authoritative Owner: Python Alembic / SQL Migration Pipeline
-- Target: Neon Serverless PostgreSQL / Cloud PostgreSQL
-- ==============================================================================

-- 1. Users table with immutable numeric GitHub ID
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    github_numeric_id BIGINT UNIQUE NULL,
    github_login VARCHAR(128) NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'STUDENT', -- 'STUDENT', 'EVALUATOR', 'ADMIN'
    is_institution_verified BOOLEAN NOT NULL DEFAULT FALSE,
    organization_name VARCHAR(255) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Sessions table (server-side session storage)
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token_hash VARCHAR(128) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Institution Evaluators whitelist
CREATE TABLE IF NOT EXISTS institution_evaluators (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    institution_name VARCHAR(255) NOT NULL,
    approved_by VARCHAR(64) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Immutable Analysis Runs (Unique per scan, pinned to resolved commit SHA)
CREATE TABLE IF NOT EXISTS analysis_runs (
    id VARCHAR(64) PRIMARY KEY, -- run_<sha7>_<timestamp>_<nanoid>
    repo_url TEXT NOT NULL,
    owner VARCHAR(128) NOT NULL,
    repo_name VARCHAR(128) NOT NULL,
    branch VARCHAR(128) NOT NULL,
    resolved_commit_sha VARCHAR(64) NOT NULL,
    total_commits INT NOT NULL DEFAULT 0,
    total_lines INT NOT NULL DEFAULT 0,
    total_files INT NOT NULL DEFAULT 0,
    scope_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Mined Contributors
CREATE TABLE IF NOT EXISTS run_contributors (
    id VARCHAR(128) PRIMARY KEY,
    analysis_run_id VARCHAR(64) NOT NULL REFERENCES analysis_runs(id) ON DELETE CASCADE,
    contributor_login VARCHAR(128) NOT NULL,
    primary_name VARCHAR(255) NOT NULL,
    emails JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_commits INT NOT NULL DEFAULT 0,
    lines_added INT NOT NULL DEFAULT 0,
    lines_deleted INT NOT NULL DEFAULT 0,
    churn_ratio REAL NOT NULL DEFAULT 0.0,
    tier_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
    commit_cadence JSONB NOT NULL DEFAULT '{}'::jsonb,
    git_forensics_score INT NOT NULL DEFAULT 0,
    complexity_score INT NOT NULL DEFAULT 0,
    review_signals JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Official Assessments (Authoritative viva ledger)
CREATE TABLE IF NOT EXISTS assessments (
    id VARCHAR(64) PRIMARY KEY, -- asm_<nanoid>
    analysis_run_id VARCHAR(64) NOT NULL REFERENCES analysis_runs(id) ON DELETE CASCADE,
    contributor_id VARCHAR(128) NOT NULL REFERENCES run_contributors(id) ON DELETE CASCADE,
    candidate_user_id VARCHAR(64) NULL REFERENCES users(id),
    candidate_github_numeric_id BIGINT NULL,
    account_linkage VARCHAR(64) NOT NULL DEFAULT 'UNLINKED', -- 'GITHUB_ACCOUNT_LINKED', 'UNLINKED'
    assigned_evaluator_id VARCHAR(64) NULL REFERENCES users(id),
    status VARCHAR(32) NOT NULL DEFAULT 'SCHEDULED', -- 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'FLAGGED'
    is_practice BOOLEAN NOT NULL DEFAULT FALSE,
    git_forensics_score INT NOT NULL,
    complexity_score INT NOT NULL,
    viva_defense_score INT NULL,
    final_pramaan_score INT NULL,
    rubric_version VARCHAR(32) NOT NULL DEFAULT 'v1.0-grounded',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE NULL,
    certificate_id VARCHAR(64) NULL UNIQUE,
    certificate_sha256 VARCHAR(64) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Assessment Exchanges (Server-stored questions & submitted answers)
CREATE TABLE IF NOT EXISTS assessment_exchanges (
    id VARCHAR(64) PRIMARY KEY,
    assessment_id VARCHAR(64) NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    question_index INT NOT NULL,
    idempotency_key VARCHAR(128) NULL,
    commit_sha VARCHAR(64) NOT NULL,
    file_path TEXT NOT NULL,
    line_start INT NOT NULL,
    line_end INT NOT NULL,
    code_snippet TEXT NOT NULL,
    question_text TEXT NOT NULL,
    expected_concepts JSONB NOT NULL DEFAULT '[]'::jsonb,
    student_answer TEXT NULL,
    answered_at TIMESTAMP WITH TIME ZONE NULL,
    latency_seconds REAL NULL,
    paste_detected BOOLEAN NOT NULL DEFAULT FALSE,
    ai_score INT NULL,
    evaluator_score INT NULL,
    feedback TEXT NULL,
    builder_signals JSONB NOT NULL DEFAULT '[]'::jsonb,
    fluff_signals JSONB NOT NULL DEFAULT '[]'::jsonb,
    review_signals JSONB NOT NULL DEFAULT '[]'::jsonb,
    CONSTRAINT uq_assessment_exchange_idx UNIQUE (assessment_id, question_index)
);

CREATE INDEX IF NOT EXISTS idx_users_github_numeric ON users(github_numeric_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(session_token_hash);
CREATE INDEX IF NOT EXISTS idx_analysis_runs_sha ON analysis_runs(resolved_commit_sha);
CREATE INDEX IF NOT EXISTS idx_assessments_candidate ON assessments(candidate_user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_evaluator ON assessments(assigned_evaluator_id);
