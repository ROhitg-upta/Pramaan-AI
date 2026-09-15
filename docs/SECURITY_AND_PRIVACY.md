# 🔒 Pramaan AI — Security, Privacy & Ethical Guidelines

> **Purpose:** Judges evaluate maturity. A project that handles data responsibly and considers ethical implications demonstrates that the team thinks beyond code — they think like product leaders. This document preemptively addresses every privacy and ethics question a judge or professor might raise.

---

## 1. Data Handling Philosophy

> **Core Principle:** Pramaan AI analyzes code behavior, NOT personal identity. We care about WHAT was coded and HOW — not WHO the person is beyond their git author metadata.

---

## 2. What Data We Collect, Process & Store

### 2.1 Data We PROCESS (Temporarily, During Analysis)

| Data Type | Source | Purpose | Retention |
| :--- | :--- | :--- | :--- |
| Repository source code | Git clone (public repos only) | AST parsing, diff extraction, complexity scoring | **Deleted immediately** after analysis completes. Code is NEVER stored permanently. |
| Commit metadata | Git log | Author names, emails, timestamps, messages, file paths | Stored as part of the analysis report (anonymizable). |
| Diff content | Git diff | Line-level changes for viva question generation | Stored only as code snippets within generated questions. Full diffs deleted. |

### 2.2 Data We STORE (Persistent)

| Data Type | Purpose | Retention | Anonymizable? |
| :--- | :--- | :--- | :--- |
| Analysis report (metrics, scores, flags) | Audit trail, re-viewing results | 90 days, then auto-purged | ✅ Yes — contributor names can be replaced with "Contributor A, B, C" |
| Viva questions generated | Re-examination, evidence reference | 90 days | ✅ Yes |
| Viva answer transcripts | Grading evidence, appeals | 90 days | ✅ Yes |
| Pramaan Receipts | Shareable proof artifacts | Until user deletes | ✅ Yes |

### 2.3 Data We NEVER Collect

| Data Type | Why Not |
| :--- | :--- |
| ❌ Passwords or auth tokens | We clone public repos via HTTPS. No auth needed. |
| ❌ Student ID numbers, roll numbers | Not relevant to code forensics. |
| ❌ Biometric data | Audio waveforms are processed client-side only. Audio is never uploaded to servers. |
| ❌ Browsing history or device fingerprints | No tracking of any kind. |
| ❌ Private repository code (without explicit OAuth consent) | Current scope: public repos only. Future private repo support will require explicit GitHub OAuth with granular scope. |

---

## 3. Security Architecture

### 3.1 Repository Sandboxing
- Cloned repositories are stored in an **isolated temporary directory** (`/tmp/repos/{uuid}/`).
- Each analysis gets a unique UUID-namespaced directory.
- Directory is **deleted within 60 seconds** of analysis completion, regardless of success or failure.
- A periodic cleanup cron runs every 5 minutes to purge any orphaned clone directories.

### 3.2 API Security
- All API endpoints are rate-limited:
  - Analysis trigger: **5 requests per minute** per IP.
  - Viva evaluation: **20 requests per minute** per session.
- Input sanitization: Repository URLs are validated against a strict regex whitelist (GitHub/GitLab domains only).
- No SQL injection risk: All database queries use SQLAlchemy ORM parameterized queries.
- CORS policy: Only whitelisted frontend origins can access the API.

### 3.3 Gemini API Data Handling
- Code snippets sent to Gemini for question generation are **minimal** — only the specific diff context (typically 10-30 lines), not the entire file.
- Gemini API requests do NOT include student personal information (names, emails). Only the code content and commit hash are sent.
- Google's Gemini API data policy: Data sent via the paid API is NOT used for model training (as per Google Cloud ToS 2025).

### 3.4 No Persistent User Accounts (MVP)
- Pramaan AI MVP operates **without user authentication**.
- Any person with the analysis URL can view results.
- Future versions will add:
  - Professor login (university email verification).
  - Student consent flow before viva.
  - Role-based access control (professor sees all, student sees only their own).

---

## 4. Ethical Framework

### 4.1 Fairness & Bias Mitigation

| Concern | How We Address It |
| :--- | :--- |
| **"What if a real builder has low commit count because they worked offline?"** | The Pramaan Score is composite: Git Forensics (35%) + AST Complexity (25%) + **Viva Defense (40%)**. A builder who worked offline can redeem their score through viva. Forensics flags anomalies; Viva verifies truth. |
| **"What if a student has a disability that affects their viva performance?"** | Viva supports both audio AND text input. Future: extended time accommodations, alternative question formats. Pramaan Score should be ONE input for evaluators, not the sole determinant. |
| **"What about non-English-speaking students?"** | Questions are generated in English (matching code language), but future versions will support Hindi and regional language viva responses. |
| **"Can a professor weaponize this against a student they dislike?"** | Pramaan AI produces data, not judgments. The system flags anomalies and generates viva scores — the final academic decision always rests with the human evaluator. |

### 4.2 Transparency & Explainability
- Every anomaly flag includes a **human-readable explanation** with exact evidence:
  - ✅ `"1 commit of +4,821 lines at 03:42 AM with 0 deletions"` — not just `"SUSPICIOUS"`.
- Every viva evaluation includes:
  - Which key concepts were covered vs missed.
  - Specific phrases that triggered builder/fluff signals.
  - This allows students to understand and contest their scores.

### 4.3 Right to Appeal
- The Pramaan Receipt includes a **"Contest This Score"** link.
- Students can submit additional context (e.g., "I worked on a separate branch that was squash-merged").
- Pramaan AI re-analyzes with the additional context and generates a revised report.

### 4.4 Not a Replacement for Human Judgment
> **Pramaan AI is an ASSISTANT, not a JUDGE.** It provides forensic evidence and AI-evaluated viva scores. The final grading decision must always be made by a qualified human evaluator who considers the full context of the student's work, circumstances, and academic standing.

---

## 5. Compliance & Standards Alignment

| Standard | Status | Notes |
| :--- | :--- | :--- |
| **GDPR (EU Data Protection)** | ✅ Aligned | No PII stored permanently. Right to deletion supported. Minimal data processing. |
| **India DPDP Act 2023** | ✅ Aligned | Only public repository data processed. No sensitive personal data collected. |
| **FERPA (US Education Records)** | ✅ Compatible | Pramaan AI does not access institutional student records. Works only on publicly available git data. |
| **GitHub ToS** | ✅ Compliant | Cloning public repos for analysis is permitted under GitHub's ToS for public repositories. |
| **Google Gemini API ToS** | ✅ Compliant | Paid API data not used for training. Code snippets sent are minimal and anonymized. |

---

## 6. Incident Response (If Something Goes Wrong)

| Scenario | Response |
| :--- | :--- |
| Data breach (analysis reports leaked) | Purge all stored reports. Notify affected users. Reports contain only git metadata, not source code. |
| Gemini API returns offensive content | Content filtered on backend before displaying. Fallback to generic question set. |
| False accusation (student wrongly flagged) | Student uses "Contest This Score" flow. Professor reviews evidence. Pramaan AI provides data, not verdicts. |
| Repository clone contains malware | Sandboxed execution. Clone directory is isolated. No code is ever executed — only parsed as text. |
