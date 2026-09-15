from datetime import datetime
from app.engine.anomaly_detector import AnomalyDetector, ContributorForensicProfile

def test_big_bang_dump_detection():
    detector = AnomalyDetector()

    # Profile representing Aryan Kumar (4821 lines in 1 commit, 0 deletions)
    profile = ContributorForensicProfile(
        name="Aryan Kumar",
        emails=["aryan@test.com"],
        commits_count=1,
        lines_added=4821,
        lines_deleted=0,
        churn_ratio=0.0,
        tier_0_lines=1000,
        tier_1_lines=3000,
        tier_2_lines=800,
        tier_3_lines=21,
        burstiness_score=0.98,
        last_commit=datetime.now()
    )

    flags = detector.detect_anomalies(
        profile=profile,
        project_total_lines=15000,
        project_total_commits=35
    )

    flag_types = [f.type for f in flags]
    assert "FLAG_BIG_BANG" in flag_types
    assert "FLAG_ZERO_CHURN" in flag_types
    assert "FLAG_PANIC_BURST" in flag_types

def test_legitimate_builder_no_flags():
    detector = AnomalyDetector()

    # Profile representing Rohit Sharma (38 commits, high churn, steady work)
    profile = ContributorForensicProfile(
        name="Rohit Sharma",
        emails=["rohit@test.com"],
        commits_count=38,
        lines_added=12000,
        lines_deleted=3800,
        churn_ratio=31.6,
        tier_0_lines=200,
        tier_1_lines=1500,
        tier_2_lines=4000,
        tier_3_lines=6300,
        burstiness_score=0.15,
        last_commit=datetime.now()
    )

    flags = detector.detect_anomalies(
        profile=profile,
        project_total_lines=15000,
        project_total_commits=35
    )

    assert len(flags) == 0  # Clean builder, zero flags

def test_ghost_contributor_detection():
    detector = AnomalyDetector()

    # Profile representing Priya Patel (only docs/CSS, 0 Tier 3)
    profile = ContributorForensicProfile(
        name="Priya Patel",
        emails=["priya@test.com"],
        commits_count=6,
        lines_added=150,
        lines_deleted=20,
        churn_ratio=13.3,
        tier_0_lines=50,
        tier_1_lines=95,
        tier_2_lines=5,
        tier_3_lines=0,
        burstiness_score=0.3,
        last_commit=datetime.now()
    )

    flags = detector.detect_anomalies(
        profile=profile,
        project_total_lines=15000,
        project_total_commits=35
    )

    flag_types = [f.type for f in flags]
    assert "FLAG_GHOST_CONTRIBUTOR" in flag_types
