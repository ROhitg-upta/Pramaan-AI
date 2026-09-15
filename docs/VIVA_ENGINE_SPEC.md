# 🎙️ Pramaan AI — Autonomous Viva Defense Engine Spec

> **Role:** The Automated Code Examiner & Oral Defense Auditor  
> **Model:** Google Gemini 2.5 / 1.5 Flash  
> **Rule #1:** Zero generic questions. Every single question must be mathematically anchored to an exact commit hash, file path, and lines authored by the specific candidate.

---

## 1. Grounding Architecture (Preventing Hallucinations)

```
[Candidate Git Diffs]
        │
        ▼
[AST Slicer: Isolate Tier 2 & Tier 3 Functions]
        │
        ▼
[Context Packager: File Path + Commit Msg + Line Numbers + Code Snippet]
        │
        ▼
[Gemini 2.5 Flash Structured Prompt]
        │
        ▼
[Strict JSON Output: Validated against Pydantic Schema]
```

---

## 2. Question Generation Engine

### 2.1 System Prompt for Question Generation
```text
You are the Autonomous Code Examiner for Pramaan AI.
Your purpose is to conduct a high-rigor technical viva defense for student software projects.
You have been provided with an EXACT code diff authored by the student, along with the commit hash, commit message, and file path.

RULES:
1. NEVER ask generic theoretical questions (e.g. "What is a database index?", "Explain MVC").
2. Ask targeted, line-specific questions based on the candidate's actual implementation choices, trade-offs, and failure edge cases.
3. Reference the specific function, variable, or architectural pattern visible in the provided code snippet.
4. Output MUST be valid JSON adhering strictly to the schema provided.

QUESTION CATEGORIES (Generate a mix):
- Category A (Failure & Concurrency): What happens if an edge condition occurs at line X?
- Category B (Implementation Trade-offs): Why was library/data structure X chosen here instead of Y?
- Category C (Refactoring & Bug Fix): In this commit, why did you change the logic from the previous state?
```

### 2.2 Structured Output Schema (Pydantic / Gemini)
```json
{
  "question_id": "VIVA_Q_001",
  "commit_hash": "7b8d14f",
  "file_path": "backend/services/payment_orchestrator.py",
  "line_range": "84-102",
  "category": "Failure & Concurrency",
  "difficulty": "Hard",
  "question_text": "In commit #7b8d14f, you introduced idempotency key validation in 'process_webhook'. If a duplicate webhook payload arrives with a different transaction amount under the same idempotency key, how does your implementation at line 91 handle it?",
  "expected_key_concepts": [
    "idempotency key mismatch",
    "409 conflict or rejection",
    "hash validation",
    "atomic status check"
  ],
  "trap_signals": [
    "Saying it simply accepts the new amount",
    "Saying it updates the database blindly"
  ]
}
```

---

## 3. Candidate Response Evaluation Engine

### 3.1 Evaluation Rubrics (The Authenticity Index)

| Metric | Weight | Description |
| :--- | :---: | :--- |
| **Technical Accuracy** | 40% | Does the candidate's explanation match what the code actually does? |
| **Tactical Context (Anti-AI Fluff)** | 35% | Does the candidate talk like someone who wrestled with this code, or are they reciting a ChatGPT summary? |
| **Edge-Case Preparedness** | 25% | Does the candidate acknowledge failure states and trade-offs? |

### 3.2 System Prompt for Answer Grading
```text
You are the Chief Academic Auditor for Pramaan AI.
Evaluate the candidate's response to the code question.
You have access to:
1. The original code snippet.
2. The question asked.
3. The expected key concepts and trap signals.
4. The candidate's raw response.

YOUR TASKS:
1. Determine if the candidate genuinely authored and understands this code.
2. Distinguish between 'Hands-on Builder' language vs 'ChatGPT Copied Fluff'. Hands-on builders talk about practical quirks, errors, and variable states; fluff answers sound like a generic textbook.
3. Output strict JSON with numeric scoring and analytical feedback.
```

### 3.3 Evaluation Response Schema
```json
{
  "score": 88.0,
  "technical_accuracy": 90.0,
  "tactical_authenticity": 85.0,
  "verdict": "VERIFIED_BUILDER",
  "verdict_options": ["VERIFIED_BUILDER", "SUSPECT_AI_FLUFF", "PROBABLE_FREELOADER", "UNPREPARED"],
  "key_concepts_covered": ["idempotency key mismatch", "atomic check"],
  "missed_concepts": ["409 conflict status"],
  "anti_fraud_analysis": "Candidate specifically referenced the Redis lock and payload hashing mechanism, indicating genuine familiarity with the implemented code.",
  "evaluator_verdict_summary": "Passed with distinction. Candidate demonstrates solid grasp of webhook edge cases."
}
```

---

## 4. Audio Viva & Latency Countermeasures

1. **Web Audio Capture:**
   - In the frontend, the candidate speaks into their microphone.
   - Real-time Web Audio API frequency analysis renders the reactive visualizer.
   - Audio is converted via browser Speech-to-Text (or Whisper API on the backend) into text with timestamp latency.
2. **The "ChatGPT Tab-Switch" Heuristic:**
   - The UI records **Time-to-First-Word (TTFW)**.
   - If a candidate takes $> 45$ seconds to start answering a straightforward question about their own code, or pastes a formatted multi-paragraph markdown response in under 2 seconds, an `AI_ASSISTED_ANSWER_ALERT` is triggered.
