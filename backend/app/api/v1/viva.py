import logging
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.db_models import ContributorRecord, VivaQuestionRecord
from app.engine.viva_examiner import VivaExaminer

logger = logging.getLogger(__name__)
router = APIRouter()

class GetQuestionsRequest(BaseModel):
    contributor_id: str
    question_count: int = 3

class EvaluateAnswerRequest(BaseModel):
    question_id: str
    student_answer: str
    ttfk_seconds: float = 0.0
    paste_detected: bool = False

@router.post("/{analysis_id}/questions")
def get_viva_questions(
    analysis_id: str,
    req: GetQuestionsRequest,
    db: Session = Depends(get_db)
):
    contributor = db.query(ContributorRecord).filter(
        ContributorRecord.id == req.contributor_id,
        ContributorRecord.analysis_id == analysis_id
    ).first()

    if not contributor:
        raise HTTPException(status_code=404, detail="Contributor not found in this analysis.")

    questions = db.query(VivaQuestionRecord).filter(
        VivaQuestionRecord.contributor_id == req.contributor_id
    ).limit(req.question_count).all()

    return {
        "contributor_id": contributor.id,
        "contributor_name": contributor.primary_name,
        "questions": [
            {
                "id": q.id,
                "commit_hash": q.commit_hash,
                "file_path": q.file_path,
                "line_range": q.line_range,
                "code_snippet": q.code_snippet,
                "category": q.category,
                "difficulty": q.difficulty,
                "question_text": q.question_text,
                "expected_key_concepts": q.expected_key_concepts,
                "trap_signals": q.trap_signals
            } for q in questions
        ]
    }

@router.post("/evaluate")
def evaluate_viva_answer(
    req: EvaluateAnswerRequest,
    db: Session = Depends(get_db)
):
    if not req.student_answer or len(req.student_answer.strip()) < 5:
        raise HTTPException(status_code=400, detail="Answer is too short or empty.")

    question = db.query(VivaQuestionRecord).filter(VivaQuestionRecord.id == req.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Viva question not found.")

    viva_examiner = VivaExaminer()
    evaluation = viva_examiner.evaluate_response(
        question_text=question.question_text,
        code_snippet=question.code_snippet,
        expected_key_concepts=question.expected_key_concepts or [],
        student_answer=req.student_answer,
        ttfk_seconds=req.ttfk_seconds,
        paste_detected=req.paste_detected
    )

    # Save to question record
    question.student_answer = req.student_answer
    question.score = evaluation.get("score", 0.0)
    question.technical_accuracy = evaluation.get("technical_accuracy", 0.0)
    question.authenticity_verdict = evaluation.get("verdict", "UNVERIFIED")
    question.feedback = evaluation.get("feedback", "")
    question.answered_at = datetime.utcnow()

    # Update contributor's overall viva score and recalibrate composite Pramaan Score
    contributor = db.query(ContributorRecord).filter(ContributorRecord.id == question.contributor_id).first()
    if contributor:
        all_answered = db.query(VivaQuestionRecord).filter(
            VivaQuestionRecord.contributor_id == contributor.id,
            VivaQuestionRecord.score.isnot(None)
        ).all()
        
        scores = [q.score for q in all_answered if q.score is not None]
        if scores:
            avg_viva = round(sum(scores) / len(scores), 1)
            contributor.viva_defense_score = avg_viva
            # Composite Pramaan Formula: 0.35 * Git + 0.25 * AST + 0.40 * Viva
            composite = round(
                0.35 * contributor.git_forensics_score +
                0.25 * contributor.ast_complexity_score +
                0.40 * avg_viva,
                1
            )
            contributor.pramaan_score = composite

            # Upgrade or downgrade verdict based on live viva performance
            if avg_viva >= 75:
                contributor.verdict = "VERIFIED_BUILDER"
                contributor.avatar_color = "#10B981"
            elif avg_viva < 35:
                contributor.verdict = "SUSPECT_AI_FLUFF"
                contributor.avatar_color = "#EF4444"

    db.commit()

    return evaluation
