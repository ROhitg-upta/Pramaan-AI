import json
import logging
import re
from typing import List, Dict, Any, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

# Fallback question generator when Gemini API is offline or key not provided
def generate_grounded_fallback_questions(
    contributor_name: str,
    commit_hash: str,
    file_path: str,
    code_snippet: str,
    question_count: int = 3
) -> List[Dict[str, Any]]:
    """
    Deterministic question generator grounded in code AST patterns for offline/demo reliability.
    """
    lines = [line.strip() for line in code_snippet.split("\n") if line.strip()]
    first_func = "the main function"
    for line in lines:
        if line.startswith("def ") or line.startswith("async def ") or "function" in line or "const " in line:
            parts = line.split("(")
            if parts:
                first_func = parts[0].replace("def ", "").replace("async ", "").replace("function ", "").strip()
                break

    fallback_questions = [
        {
            "question_id": f"VIVA_FB_{commit_hash[:6]}_1",
            "commit_hash": commit_hash,
            "file_path": file_path,
            "line_range": "1-30",
            "referenced_lines": [1, 15],
            "category": "FAILURE_EDGE_CASE",
            "difficulty": "Hard",
            "question_text": f"{contributor_name}, in commit #{commit_hash[:7]} for '{file_path}', you implemented '{first_func}'. If an unexpected null input or network timeout occurs during execution, how does your implementation prevent unhandled exceptions?",
            "expected_key_concepts": ["null check", "exception handling", "graceful degradation", "boundary validation"],
            "trap_signals": ["Generic textbook definition", "Claiming it works automatically"]
        },
        {
            "question_id": f"VIVA_FB_{commit_hash[:6]}_2",
            "commit_hash": commit_hash,
            "file_path": file_path,
            "line_range": "15-45",
            "referenced_lines": [20, 25],
            "category": "IMPLEMENTATION_TRADEOFF",
            "difficulty": "Medium",
            "question_text": f"In this same commit, why did you structure '{first_func}' using this specific approach instead of an asynchronous worker queue or caching strategy?",
            "expected_key_concepts": ["latency vs throughput", "memory footprint", "concurrency trade-off"],
            "trap_signals": ["Says they don't know", "Sounds like ChatGPT recitation"]
        },
        {
            "question_id": f"VIVA_FB_{commit_hash[:6]}_3",
            "commit_hash": commit_hash,
            "file_path": file_path,
            "line_range": "1-50",
            "referenced_lines": [10],
            "category": "SCALABILITY",
            "difficulty": "Hard",
            "question_text": f"If concurrent requests to '{first_func}' spike by 50x in a production environment, what is the primary bottleneck and how would you optimize data access?",
            "expected_key_concepts": ["database connection pool", "indexing", "horizontal scaling", "rate limiting"],
            "trap_signals": ["Says scaling is automatic", "Cannot identify database bottleneck"]
        }
    ]
    return fallback_questions[:question_count]

def evaluate_grounded_fallback(student_answer: str, expected_concepts: List[str]) -> Dict[str, Any]:
    """
    Heuristic grading when AI API is unavailable.
    """
    answer_lower = student_answer.lower()
    covered = [c for c in expected_concepts if c.lower() in answer_lower]
    missed = [c for c in expected_concepts if c.lower() not in answer_lower]
    
    # Generic fluff indicators
    fluff_words = ["efficiently handles", "standard pattern", "leverages", "robust architecture", "seamless integration"]
    fluff_detected = [f for f in fluff_words if f in answer_lower]

    score = 25.0
    if len(covered) > 0:
        score += (len(covered) / max(1, len(expected_concepts))) * 60.0
    if len(fluff_detected) > 1 and len(covered) == 0:
        score = max(15.0, score - 20.0)

    score = min(100.0, round(score, 1))

    if score >= 75:
        verdict = "VERIFIED_BUILDER"
    elif score >= 50:
        verdict = "PROBABLE_AUTHOR"
    elif score >= 30:
        verdict = "SUSPECT_AI_FLUFF"
    else:
        verdict = "PROBABLE_FREELOADER"

    return {
        "score": score,
        "technical_accuracy": round(score * 0.95, 1),
        "tactical_authenticity": round(score * 0.9, 1),
        "edge_case_preparedness": round(score * 0.85, 1),
        "verdict": verdict,
        "key_concepts_covered": covered,
        "missed_concepts": missed,
        "builder_signals_detected": ["Addressed specific function parameters" if covered else "Basic conceptual awareness"],
        "fluff_signals_detected": fluff_detected,
        "feedback": f"Candidate demonstrated {len(covered)} of {len(expected_concepts)} required tactical concepts.",
        "evaluator_note": "Evaluated via grounded heuristic engine."
    }

class VivaExaminer:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.client = None
        if self.api_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                logger.warning(f"Could not initialize Google GenAI Client: {e}")

    def generate_questions(
        self,
        contributor_name: str,
        commit_hash: str,
        commit_message: str,
        file_path: str,
        code_snippet: str,
        diff_content: str,
        tier: int = 3,
        question_count: int = 3
    ) -> List[Dict[str, Any]]:
        """
        Generates line-specific viva questions using Gemini 2.5 Flash,
        falling back to grounded heuristics if API key is not configured.
        """
        if not self.client:
            return generate_grounded_fallback_questions(
                contributor_name, commit_hash, file_path, code_snippet, question_count
            )

        prompt = f"""
You are the Autonomous Code Examiner for Pramaan AI.
Generate targeted, line-specific technical viva defense questions for a student who claims to have authored this code.

RULES:
1. NEVER ask generic theoretical questions.
2. Every question MUST reference a specific line number, function name, or variable from the code snippet.
3. Questions should be impossible to answer without having actually written this code.
4. Output MUST be valid JSON with a 'questions' array.

CONTRIBUTOR: {contributor_name}
COMMIT HASH: {commit_hash}
COMMIT MESSAGE: "{commit_message}"
FILE PATH: {file_path}

CODE SNIPPET:
```
{code_snippet[:3000]}
```

DIFF CONTEXT:
```diff
{diff_content[:2000]}
```

Generate exactly {question_count} questions adhering to this schema:
{{
  "questions": [
    {{
      "question_id": "VIVA_Q_1",
      "commit_hash": "{commit_hash}",
      "file_path": "{file_path}",
      "line_range": "1-30",
      "referenced_lines": [15, 20],
      "category": "FAILURE_EDGE_CASE",
      "difficulty": "Hard",
      "question_text": "...",
      "expected_key_concepts": ["concept1", "concept2"],
      "trap_signals": ["trap1"]
    }}
  ]
}}
"""
        try:
            response = self.client.models.generate_content(
                model=settings.GEMINI_MODEL_QUESTION,
                contents=prompt,
                config={
                    "response_mime_type": "application/json",
                    "temperature": settings.GEMINI_TEMPERATURE_QUESTION,
                }
            )
            parsed = json.loads(response.text)
            return parsed.get("questions", [])
        except Exception as e:
            logger.error(f"Gemini Question Generation failed: {e}. Using grounded fallback.")
            return generate_grounded_fallback_questions(
                contributor_name, commit_hash, file_path, code_snippet, question_count
            )

    def evaluate_response(
        self,
        question_text: str,
        code_snippet: str,
        expected_key_concepts: List[str],
        student_answer: str,
        ttfk_seconds: float = 0.0,
        paste_detected: bool = False
    ) -> Dict[str, Any]:
        """
        Evaluates student's viva defense answer against code reality.
        """
        if not self.client:
            return evaluate_grounded_fallback(student_answer, expected_key_concepts)

        prompt = f"""
You are the Chief Academic Integrity Auditor for Pramaan AI.
Evaluate the student's answer to this code viva question.

QUESTION: "{question_text}"
CODE SNIPPET:
```
{code_snippet[:2500]}
```
EXPECTED CONCEPTS: {json.dumps(expected_key_concepts)}

STUDENT'S ANSWER:
"{student_answer}"

METADATA:
- Paste detected: {paste_detected}
- Time to answer: {ttfk_seconds}s

Output ONLY valid JSON matching:
{{
  "score": 0-100,
  "technical_accuracy": 0-100,
  "tactical_authenticity": 0-100,
  "edge_case_preparedness": 0-100,
  "verdict": "VERIFIED_BUILDER | PROBABLE_AUTHOR | SUSPECT_AI_FLUFF | PROBABLE_FREELOADER",
  "key_concepts_covered": ["..."],
  "missed_concepts": ["..."],
  "builder_signals_detected": ["..."],
  "fluff_signals_detected": ["..."],
  "feedback": "2-3 sentence feedback for student",
  "evaluator_note": "1 sentence internal note for judges"
}}
"""
        try:
            response = self.client.models.generate_content(
                model=settings.GEMINI_MODEL_EVALUATE,
                contents=prompt,
                config={
                    "response_mime_type": "application/json",
                    "temperature": settings.GEMINI_TEMPERATURE_EVALUATE,
                }
            )
            return json.loads(response.text)
        except Exception as e:
            logger.error(f"Gemini Evaluation failed: {e}. Using heuristic fallback.")
            return evaluate_grounded_fallback(student_answer, expected_key_concepts)
