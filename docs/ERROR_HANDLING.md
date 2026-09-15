# 🛡️ Pramaan AI — Error Handling, Edge Cases & Graceful Degradation

> **Purpose:** This file documents EVERY error state the system can encounter, the exact error response format, and how the frontend should gracefully handle each failure. No undefined behavior, no white screens, no silent failures.

---

## 1. Global Error Response Contract

Every backend error returns this consistent JSON structure:

```json
{
  "error": true,
  "error_code": "REPO_CLONE_FAILED",
  "error_message": "Failed to clone repository. The repository may be private or the URL is invalid.",
  "http_status": 400,
  "retry_possible": true,
  "user_action": "Please verify the repository URL is correct and the repo is public."
}
```

---

## 2. Repository Ingestion Errors

### 2.1 Invalid Repository URL
```
Trigger:    URL does not match GitHub/GitLab URL pattern
Error Code: INVALID_REPO_URL
HTTP:       400 Bad Request
Message:    "The provided URL is not a valid GitHub or GitLab repository URL."
Frontend:   Show inline error below input field with red border. Do not navigate.
```

### 2.2 Private / Non-Existent Repository
```
Trigger:    git clone fails with authentication error or 404
Error Code: REPO_NOT_ACCESSIBLE
HTTP:       404 Not Found
Message:    "Repository not found or is private. Pramaan AI can only analyze public repositories."
Frontend:   Show error toast + suggestion to check URL. Keep input populated.
```

### 2.3 Empty Repository (No Commits)
```
Trigger:    Repository has 0 commits
Error Code: REPO_EMPTY
HTTP:       422 Unprocessable Entity
Message:    "This repository has no commits to analyze."
Frontend:   Show a friendly empty state card: "This repo has no history yet."
```

### 2.4 Single Contributor Repository
```
Trigger:    After alias resolution, only 1 unique contributor exists
Error Code: (NOT an error — proceed normally)
Handling:   Analysis still runs. Frontend shows a banner:
            "ℹ️ Solo Project Detected: Only 1 contributor found. Comparison features disabled."
            Contributor cards show single card without vs-comparison layout.
```

### 2.5 Repository Too Large
```
Trigger:    Commit count exceeds REPO_MAX_COMMITS (default 1000)
Error Code: REPO_TOO_LARGE
HTTP:       413 Payload Too Large
Message:    "Repository has {count} commits, exceeding the {max} commit limit."
Frontend:   Offer option: "Analyze latest 500 commits?" with a retry button.
```

### 2.6 Clone Timeout
```
Trigger:    git clone exceeds REPO_CLONE_TIMEOUT_SECONDS
Error Code: REPO_CLONE_TIMEOUT
HTTP:       408 Request Timeout
Message:    "Repository clone timed out after {timeout}s. The repo may be too large."
Frontend:   Show timeout message with retry button. Suggest using a specific branch.
```

---

## 3. Analysis Pipeline Errors

### 3.1 AST Parsing Failure (Unsupported Language)
```
Trigger:    File uses a language not supported by tree-sitter/AST parser
Handling:   NOT a fatal error. Skip the file, classify as Tier 1 (0.2x weight).
Log:        "WARN: Skipping AST analysis for {file_path} — unsupported language: {lang}"
Frontend:   No visible error. File appears in heatmap as "Unclassified" with neutral color.
```

### 3.2 Diff Parsing Failure
```
Trigger:    Binary file, corrupted diff, or merge commit with complex resolution
Handling:   Skip the commit's diff, count only file-level metadata (files changed count).
Log:        "WARN: Could not parse diff for commit {hash} — binary or corrupted"
```

### 3.3 Analysis Worker Timeout
```
Trigger:    Full pipeline exceeds ANALYSIS_WORKER_TIMEOUT (default 120s)
Error Code: ANALYSIS_TIMEOUT
HTTP:       408
Message:    "Analysis pipeline timed out. Repository complexity exceeded processing limits."
Frontend:   Show partial results if available (commits mined but AST incomplete).
            Button: "View Partial Results" + "Retry with Reduced Depth"
```

---

## 4. Gemini API Errors

### 4.1 API Key Invalid / Missing
```
Trigger:    401/403 from Gemini API
Error Code: GEMINI_AUTH_FAILED
HTTP:       503 Service Unavailable
Message:    "AI engine authentication failed. The Gemini API key may be invalid."
Frontend:   Viva features disabled. Show banner: "⚠️ AI Viva Engine is offline. Forensic analysis is still available."
Degradation: Git forensics and scoring work WITHOUT Gemini. Viva questions cannot be generated.
```

### 4.2 Rate Limit Exceeded
```
Trigger:    429 from Gemini API
Error Code: GEMINI_RATE_LIMITED
HTTP:       429 Too Many Requests
Message:    "AI engine rate limit reached. Please wait {retry_after}s."
Frontend:   Show countdown timer. Auto-retry after cooldown.
```

### 4.3 Malformed JSON Response
```
Trigger:    Gemini returns text that cannot be parsed as valid JSON
Handling:   Retry ONCE with temperature=0.0. If still fails:
Error Code: GEMINI_PARSE_ERROR
Message:    "AI engine returned an unparseable response."
Frontend:   Show fallback generic questions OR skip to scoring without viva.
```

### 4.4 Gemini Content Safety Block
```
Trigger:    Gemini refuses to process due to content safety filters
Error Code: GEMINI_SAFETY_BLOCK
Handling:   This can happen if code contains offensive variable names or comments.
            Sanitize the code snippet (remove comments) and retry once.
Frontend:   If persistent, show: "This code segment could not be processed by the AI engine."
```

---

## 5. Viva Defense Errors

### 5.1 No Tier 2/3 Code Found for Contributor
```
Trigger:    Contributor has only Tier 0/1 code (no meaningful logic to question)
Handling:   NOT an error, but a finding.
Response:   Return 0 questions with note: "No significant code authored by this contributor."
Frontend:   Show message: "No questionable code found. This contributor only modified boilerplate/docs."
            This itself is strong evidence of ghost contribution.
```

### 5.2 Audio Transcription Failure
```
Trigger:    Browser Speech-to-Text fails or microphone not available
Handling:   Graceful fallback to text-only input.
Frontend:   Hide audio button. Show: "Microphone not available. Please type your answer."
```

### 5.3 Empty or Too-Short Answer
```
Trigger:    Student submits answer with < 10 characters
Handling:   Do NOT send to Gemini. Auto-score as 0.
Frontend:   Show inline validation: "Please provide a more detailed explanation (minimum 20 characters)."
```

---

## 6. Frontend Error UI Patterns

### 6.1 Error Toast (Non-Blocking)
For recoverable errors that don't prevent the user from continuing:
```
┌──────────────────────────────────────────────┐
│ ⚠️  Rate limit reached. Retrying in 12s...  │
│                                    [Dismiss] │
└──────────────────────────────────────────────┘
Position: Top-right, slides in from right
Duration: Auto-dismiss after 8s (unless actionable)
Colors: --neon-amber background for warnings, --neon-crimson for errors
```

### 6.2 Error State Card (Blocking)
For errors that prevent the current page from functioning:
```
┌────────────────────────────────────────────────────────┐
│                                                        │
│           ⚠️  Repository Not Found                    │
│                                                        │
│  The URL you entered doesn't point to a valid          │
│  public GitHub repository.                             │
│                                                        │
│  ┌────────────────────────────────────────────┐       │
│  │  https://github.com/invalid/repo-name     │       │
│  └────────────────────────────────────────────┘       │
│                                                        │
│  [ ← Go Back ]              [ Try Another URL ]       │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### 6.3 Degraded Mode Banner (Partial Functionality)
When Gemini is down but forensics still work:
```
┌──────────────────────────────────────────────────────────┐
│ ⚡ DEGRADED MODE: AI Viva Engine is offline.             │
│    Git Forensics & Contributor Analysis are available.   │
│    Viva questions will not be generated.                 │
└──────────────────────────────────────────────────────────┘
Position: Fixed top banner, full width
Color: --neon-amber border-bottom, --bg-card background
```

---

## 7. Network & Connectivity Errors

### 7.1 Backend Unreachable
```
Frontend:   When API fetch fails with network error:
            Show full-page error: "Cannot connect to Pramaan AI backend. Is the server running?"
            Auto-retry ping every 5 seconds. Show connection status indicator.
```

### 7.2 WebSocket Disconnection (If Using Real-Time Updates)
```
Frontend:   Show reconnecting spinner in the status bar.
            Fallback to HTTP polling at 2-second intervals.
            Once reconnected, show brief "Reconnected ✓" success toast.
```

---

## 8. Data Validation Rules

### 8.1 Input Sanitization
- **Repo URL:** Must match regex: `^https?:\/\/(github\.com|gitlab\.com)\/[\w.-]+\/[\w.-]+(\.git)?$`
- **Branch Name:** Must match: `^[\w.\-\/]+$` (letters, numbers, dots, hyphens, slashes)
- **Student Answer:** Strip HTML tags. Max 5000 characters. Min 10 characters for submission.
- **Question Count:** Integer between 1 and 5.

### 8.2 Response Validation (Backend → Frontend)
Every API response is validated against Pydantic models before sending. If validation fails:
```
Error Code: INTERNAL_VALIDATION_ERROR
HTTP:       500
Message:    "Internal data validation error. Please report this issue."
Log:        Full traceback + the malformed data for debugging
```
