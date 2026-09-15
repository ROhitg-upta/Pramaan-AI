import asyncio
import logging
from datetime import datetime
from typing import Dict, Any, List
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db, SessionLocal
from app.core.config import settings
from app.models.db_models import AnalysisRun, ContributorRecord, TimelineEventRecord, AnomalyRecord, VivaQuestionRecord
from app.engine.git_miner import GitForensicMiner
from app.engine.alias_resolver import AliasResolver
from app.engine.ast_classifier import ASTClassifier
from app.engine.anomaly_detector import AnomalyDetector, ContributorForensicProfile
from app.engine.viva_examiner import VivaExaminer

logger = logging.getLogger(__name__)
router = APIRouter()

class AnalyzeRepoRequest(BaseModel):
    repo_url: str
    branch: str = "main"

def run_forensic_pipeline(analysis_id: str, repo_url: str, branch: str):
    """
    Background worker that runs the full forensic analysis pipeline and updates SQLite.
    """
    db: Session = SessionLocal()
    try:
        run = db.query(AnalysisRun).filter(AnalysisRun.id == analysis_id).first()
        if not run:
            return

        # 1. Step: Cloning & Mining
        run.progress_percent = 15
        run.current_step = "Cloning repository and traversing git commit history..."
        db.commit()

        miner = GitForensicMiner(repo_url, max_commits=settings.REPO_MAX_COMMITS)
        mining_result = miner.mine()

        run.progress_percent = 40
        run.current_step = f"Mined {mining_result.total_commits} commits. Resolving author identities..."
        run.total_commits = mining_result.total_commits
        run.total_lines = mining_result.total_lines_added
        run.total_files = mining_result.total_files_audited
        db.commit()

        # 2. Step: Alias Resolution
        alias_resolver = AliasResolver()
        resolved_authors = alias_resolver.resolve(mining_result.raw_authors)

        # 3. Step: AST Complexity Classification & Timeline Events
        run.progress_percent = 65
        run.current_step = "Classifying source code into complexity tiers (Tier 0-3)..."
        db.commit()

        ast_classifier = ASTClassifier()
        # Per author tier counts: author_name -> {tier_0, tier_1, tier_2, tier_3}
        author_tiers: Dict[str, Dict[int, int]] = {a.name: {0: 0, 1: 0, 2: 0, 3: 0} for a in resolved_authors}
        tier3_snippets: Dict[str, List[Dict[str, Any]]] = {a.name: [] for a in resolved_authors}

        for commit in mining_result.commits:
            # Map commit to canonical author
            canonical_author = commit.author_name
            for author in resolved_authors:
                if commit.author_email.lower() in [e.lower() for e in author.emails] or commit.author_name == author.name:
                    canonical_author = author.name
                    break

            for mod in commit.modified_files:
                tier, weight, reason = ast_classifier.classify_file(mod.file_path, mod.diff_snippet)
                mod.tier = tier
                mod.tier_weight = weight
                if canonical_author in author_tiers:
                    author_tiers[canonical_author][tier] += mod.lines_added

                # Save snippet candidate for viva question generation
                if tier >= 2 and mod.diff_snippet and len(tier3_snippets.get(canonical_author, [])) < 5:
                    tier3_snippets[canonical_author].append({
                        "commit_hash": commit.commit_hash,
                        "commit_message": commit.message,
                        "file_path": mod.file_path,
                        "code_snippet": mod.diff_snippet,
                        "tier": tier
                    })

            # Save Timeline Event Record
            evt = TimelineEventRecord(
                analysis_id=analysis_id,
                commit_hash=commit.commit_hash,
                author_name=canonical_author,
                timestamp=commit.timestamp,
                message=commit.message,
                lines_added=commit.lines_added,
                lines_deleted=commit.lines_deleted,
                files_changed=commit.files_changed_count,
                day_index=commit.day_index
            )
            db.add(evt)

        # 4. Step: Anomaly & Fraud Detection
        run.progress_percent = 80
        run.current_step = "Executing behavioral fraud heuristics and anomaly detection..."
        db.commit()

        anomaly_detector = AnomalyDetector()
        viva_examiner = VivaExaminer()
        all_flags: List[AnomalyRecord] = []
        overall_scores: List[float] = []

        for author in resolved_authors:
            tiers = author_tiers.get(author.name, {0: 0, 1: 0, 2: 0, 3: 0})
            profile = ContributorForensicProfile(
                name=author.name,
                emails=author.emails,
                commits_count=author.commits_count,
                lines_added=author.lines_added,
                lines_deleted=author.lines_deleted,
                churn_ratio=author.churn_ratio,
                tier_0_lines=tiers[0],
                tier_1_lines=tiers[1],
                tier_2_lines=tiers[2],
                tier_3_lines=tiers[3],
                burstiness_score=author.burstiness_score,
                first_commit=author.first_commit,
                last_commit=author.last_commit,
                active_days=author.active_days
            )

            flags = anomaly_detector.detect_anomalies(
                profile=profile,
                project_total_lines=mining_result.total_lines_added,
                project_total_commits=mining_result.total_commits
            )

            for f in flags:
                flag_rec = AnomalyRecord(
                    analysis_id=analysis_id,
                    contributor_name=author.name,
                    type=f.type,
                    severity=f.severity,
                    commit_hash=f.commit_hash,
                    description=f.description,
                    details=f.details,
                    timestamp=f.timestamp
                )
                db.add(flag_rec)
                all_flags.append(flag_rec)

            # Calculate Component Scores
            # Git Forensics: penalize burstiness & zero churn, reward cadence
            git_score = max(10.0, min(100.0, (1.0 - author.burstiness_score) * 60 + min(40, author.churn_ratio)))
            if any(f.type == "FLAG_BIG_BANG" for f in flags):
                git_score = min(git_score, 20.0)

            # AST Complexity: ratio of Tier 3 / Total lines
            tot_lines = max(1, author.lines_added)
            tier3_ratio = (tiers[3] / tot_lines)
            ast_score = round(min(100.0, tier3_ratio * 120.0 + (tiers[2] / tot_lines) * 40.0), 1)

            # Composite baseline Pramaan Score (viva starts as null/unattempted)
            base_score = round(0.55 * git_score + 0.45 * ast_score, 1)
            overall_scores.append(base_score)

            # Determine verdict
            if any(f.type == "FLAG_BIG_BANG" for f in flags):
                verdict = "SUSPECT_FREELOADER"
                avatar_color = "#EF4444"
            elif any(f.type == "FLAG_GHOST_CONTRIBUTOR" for f in flags):
                verdict = "GHOST_CONTRIBUTOR"
                avatar_color = "#F59E0B"
            elif base_score >= 70:
                verdict = "VERIFIED_BUILDER"
                avatar_color = "#10B981"
            else:
                verdict = "PROBABLE_AUTHOR"
                avatar_color = "#06B6D4"

            # 5-axis Radar values
            radar = {
                "algorithmic_depth": min(100, int(tier3_ratio * 150)),
                "iterative_churn": min(100, int(author.churn_ratio * 2.5)),
                "commit_consistency": min(100, int((1.0 - author.burstiness_score) * 100)),
                "code_breadth": min(100, int(author.active_days * 15)),
                "ast_complexity": min(100, int(ast_score))
            }

            contrib_rec = ContributorRecord(
                analysis_id=analysis_id,
                primary_name=author.name,
                emails=author.emails,
                avatar_color=avatar_color,
                total_commits=author.commits_count,
                lines_added=author.lines_added,
                lines_deleted=author.lines_deleted,
                churn_ratio=author.churn_ratio,
                tier_0_lines=tiers[0],
                tier_1_lines=tiers[1],
                tier_2_lines=tiers[2],
                tier_3_lines=tiers[3],
                burstiness_score=author.burstiness_score,
                git_forensics_score=git_score,
                ast_complexity_score=ast_score,
                pramaan_score=base_score,
                verdict=verdict,
                radar_axes=radar
            )
            db.add(contrib_rec)
            db.flush()

            # Pre-generate 3 targeted Viva Questions for this contributor
            snippets = tier3_snippets.get(author.name, [])
            if snippets:
                sample_snip = snippets[0]
                questions = viva_examiner.generate_questions(
                    contributor_name=author.name,
                    commit_hash=sample_snip["commit_hash"],
                    commit_message=sample_snip["commit_message"],
                    file_path=sample_snip["file_path"],
                    code_snippet=sample_snip["code_snippet"],
                    diff_content=sample_snip["code_snippet"],
                    tier=sample_snip["tier"],
                    question_count=3
                )
                for q in questions:
                    q_rec = VivaQuestionRecord(
                        contributor_id=contrib_rec.id,
                        commit_hash=q.get("commit_hash", sample_snip["commit_hash"]),
                        file_path=q.get("file_path", sample_snip["file_path"]),
                        line_range=q.get("line_range", "1-30"),
                        code_snippet=sample_snip["code_snippet"],
                        category=q.get("category", "FAILURE_EDGE_CASE"),
                        difficulty=q.get("difficulty", "Hard"),
                        question_text=q.get("question_text", ""),
                        expected_key_concepts=q.get("expected_key_concepts", []),
                        trap_signals=q.get("trap_signals", [])
                    )
                    db.add(q_rec)

        # 5. Finalize Analysis Run
        avg_score = round(sum(overall_scores) / len(overall_scores), 1) if overall_scores else 50.0
        run.overall_pramaan_score = avg_score
        run.integrity_grade = "A" if avg_score >= 80 else ("B+" if avg_score >= 65 else ("C" if avg_score >= 45 else "D"))
        run.progress_percent = 100
        run.current_step = "Analysis complete. Forensic dossier ready."
        run.status = "completed"
        db.commit()

    except Exception as e:
        logger.error(f"Analysis pipeline failed for {analysis_id}: {e}", exc_info=True)
        run = db.query(AnalysisRun).filter(AnalysisRun.id == analysis_id).first()
        if run:
            run.status = "failed"
            run.current_step = f"Analysis error: {str(e)}"
            db.commit()
    finally:
        db.close()

@router.post("/repo", status_code=status.HTTP_202_ACCEPTED)
def analyze_repository(
    req: AnalyzeRepoRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    if not req.repo_url or not req.repo_url.strip():
        raise HTTPException(status_code=400, detail="Repository URL is required.")

    analysis_run = AnalysisRun(
        repo_url=req.repo_url.strip(),
        branch=req.branch,
        status="processing",
        progress_percent=5,
        current_step="Initializing forensic sandbox..."
    )
    db.add(analysis_run)
    db.commit()
    db.refresh(analysis_run)

    # Launch background worker
    background_tasks.add_task(run_forensic_pipeline, analysis_run.id, req.repo_url.strip(), req.branch)

    return {
        "analysis_id": analysis_run.id,
        "status": "processing",
        "message": "Repository accepted. Forensic analysis pipeline initialized."
    }

@router.get("/{analysis_id}/status")
def get_analysis_status(analysis_id: str, db: Session = Depends(get_db)):
    run = db.query(AnalysisRun).filter(AnalysisRun.id == analysis_id).first()
    if not run:
        raise HTTPException(status_code=404, detail="Analysis not found.")

    anomalies = db.query(AnomalyRecord).filter(AnomalyRecord.analysis_id == analysis_id).all()

    return {
        "analysis_id": run.id,
        "status": run.status,
        "progress_percent": run.progress_percent,
        "current_step": run.current_step,
        "live_metrics": {
            "total_commits": run.total_commits,
            "total_lines": run.total_lines,
            "contributors_found": len(run.contributors),
            "files_analyzed": run.total_files
        },
        "early_red_flags": [
            {
                "id": a.id,
                "type": a.type,
                "severity": a.severity,
                "contributor_name": a.contributor_name,
                "description": a.description,
                "details": a.details
            } for a in anomalies
        ]
    }

@router.get("/{analysis_id}/report")
def get_analysis_report(analysis_id: str, db: Session = Depends(get_db)):
    run = db.query(AnalysisRun).filter(AnalysisRun.id == analysis_id).first()
    if not run:
        raise HTTPException(status_code=404, detail="Analysis not found.")

    contributors = db.query(ContributorRecord).filter(ContributorRecord.analysis_id == analysis_id).all()
    events = db.query(TimelineEventRecord).filter(TimelineEventRecord.analysis_id == analysis_id).order_by(TimelineEventRecord.timestamp.asc()).all()
    anomalies = db.query(AnomalyRecord).filter(AnomalyRecord.analysis_id == analysis_id).all()

    return {
        "analysis_id": run.id,
        "repo_url": run.repo_url,
        "branch": run.branch,
        "total_commits": run.total_commits,
        "total_lines_audited": run.total_lines,
        "total_files": run.total_files,
        "integrity_grade": run.integrity_grade,
        "overall_pramaan_score": run.overall_pramaan_score,
        "contributors": [
            {
                "id": c.id,
                "primary_name": c.primary_name,
                "emails": c.emails,
                "avatar_color": c.avatar_color,
                "total_commits": c.total_commits,
                "lines_added": c.lines_added,
                "lines_deleted": c.lines_deleted,
                "churn_ratio": c.churn_ratio,
                "tier_breakdown": {
                    "tier_0": {"lines": c.tier_0_lines},
                    "tier_1": {"lines": c.tier_1_lines},
                    "tier_2": {"lines": c.tier_2_lines},
                    "tier_3": {"lines": c.tier_3_lines}
                },
                "sub_scores": {
                    "git_forensics": c.git_forensics_score,
                    "ast_complexity": c.ast_complexity_score,
                    "viva_defense": c.viva_defense_score
                },
                "pramaan_score": c.pramaan_score,
                "verdict": c.verdict,
                "radar_axes": c.radar_axes
            } for c in contributors
        ],
        "timeline": [
            {
                "commit_hash": e.commit_hash,
                "author": e.author_name,
                "timestamp": e.timestamp.isoformat() if e.timestamp else None,
                "message": e.message,
                "lines_added": e.lines_added,
                "lines_deleted": e.lines_deleted,
                "files_changed": e.files_changed,
                "is_anomalous": e.is_anomalous,
                "day_index": e.day_index
            } for e in events
        ],
        "anomalies": [
            {
                "id": a.id,
                "type": a.type,
                "severity": a.severity,
                "contributor_name": a.contributor_name,
                "commit_hash": a.commit_hash,
                "evidence_summary": a.description,
                "details": a.details
            } for a in anomalies
        ]
    }
