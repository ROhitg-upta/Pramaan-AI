import os
import pytest
from app.engine.git_miner import GitForensicMiner
from app.engine.alias_resolver import AliasResolver
from app.engine.ast_classifier import ASTClassifier
from app.engine.anomaly_detector import AnomalyDetector, ContributorForensicProfile
from app.engine.viva_examiner import VivaExaminer

DEMO_REPO_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../smart-campus-app"))

def test_full_forensic_pipeline_on_demo_repo():
    assert os.path.exists(DEMO_REPO_PATH), f"Demo repo not found at {DEMO_REPO_PATH}"

    # 1. Mine commits
    miner = GitForensicMiner(DEMO_REPO_PATH)
    mining_result = miner.mine()

    assert mining_result.total_commits >= 6
    assert len(mining_result.raw_authors) == 3

    # 2. Resolve aliases
    alias_resolver = AliasResolver()
    resolved_contributors = alias_resolver.resolve(mining_result.raw_authors)
    assert len(resolved_contributors) == 3

    names = [c.name for c in resolved_contributors]
    assert "Rohit Sharma" in names
    assert "Aryan Kumar" in names
    assert "Priya Patel" in names

    # 3. AST classification
    ast_classifier = ASTClassifier()
    author_tiers = {c.name: {0: 0, 1: 0, 2: 0, 3: 0} for c in resolved_contributors}

    for commit in mining_result.commits:
        for mod in commit.modified_files:
            tier, weight, _ = ast_classifier.classify_file(mod.file_path, mod.diff_snippet)
            author_tiers[commit.author_name][tier] += mod.lines_added

    # Rohit authored Tier 3 auth logic
    assert author_tiers["Rohit Sharma"][3] > 0
    # Priya authored 0 Tier 3 logic
    assert author_tiers["Priya Patel"][3] == 0

    # 4. Anomaly detection
    anomaly_detector = AnomalyDetector()
    all_flags = {}

    for c in resolved_contributors:
        tiers = author_tiers[c.name]
        profile = ContributorForensicProfile(
            name=c.name,
            emails=c.emails,
            commits_count=c.commits_count,
            lines_added=c.lines_added,
            lines_deleted=c.lines_deleted,
            churn_ratio=c.churn_ratio,
            tier_0_lines=tiers[0],
            tier_1_lines=tiers[1],
            tier_2_lines=tiers[2],
            tier_3_lines=tiers[3],
            burstiness_score=c.burstiness_score,
            last_commit=c.last_commit
        )
        flags = anomaly_detector.detect_anomalies(
            profile,
            project_total_lines=mining_result.total_lines_added,
            project_total_commits=mining_result.total_commits
        )
        all_flags[c.name] = [f.type for f in flags]

    # Assert specific forensic verdicts
    assert len(all_flags["Rohit Sharma"]) == 0  # Verified builder, clean
    assert "FLAG_BIG_BANG" in all_flags["Aryan Kumar"]  # Big Bang dumper
    assert "FLAG_GHOST_CONTRIBUTOR" in all_flags["Priya Patel"]  # Ghost contributor

    # 5. Viva question generation
    viva_examiner = VivaExaminer()
    questions = viva_examiner.generate_questions(
        contributor_name="Rohit Sharma",
        commit_hash="abc1234",
        commit_message="feat: JWT auth rotation",
        file_path="backend/services/auth_service.py",
        code_snippet="async def rotate_refresh_token(self, user_id): lock = await self._acquire_user_lock()",
        diff_content="def rotate_refresh_token",
        tier=3,
        question_count=3
    )

    assert len(questions) == 3
    assert "rotate_refresh_token" in questions[0]["question_text"]
