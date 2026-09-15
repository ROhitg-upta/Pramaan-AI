from typing import List, Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel

class AnomalyFlag(BaseModel):
    type: str  # FLAG_BIG_BANG, FLAG_ZERO_CHURN, FLAG_GHOST_CONTRIBUTOR, FLAG_PANIC_BURST
    severity: str  # CRITICAL, HIGH, MEDIUM, LOW
    contributor_name: str
    description: str
    details: str
    commit_hash: Optional[str] = None
    timestamp: Optional[datetime] = None

class ContributorForensicProfile(BaseModel):
    name: str
    emails: List[str]
    commits_count: int
    lines_added: int
    lines_deleted: int
    churn_ratio: float
    tier_0_lines: int = 0
    tier_1_lines: int = 0
    tier_2_lines: int = 0
    tier_3_lines: int = 0
    burstiness_score: float = 0.0
    first_commit: Optional[datetime] = None
    last_commit: Optional[datetime] = None
    active_days: int = 0
    anomalies: List[AnomalyFlag] = []

class AnomalyDetector:
    """
    Detects behavioral red flags and freeloading patterns from contributor metrics.
    """

    def detect_anomalies(
        self,
        profile: ContributorForensicProfile,
        project_total_lines: int,
        project_total_commits: int,
        submission_deadline: Optional[datetime] = None
    ) -> List[AnomalyFlag]:
        flags: List[AnomalyFlag] = []

        # 1. Big Bang Dump Check
        # Contributor committed massive lines (>1500 or >35% of total project) in <= 2 commits
        is_few_commits = profile.commits_count <= 2
        is_huge_volume = profile.lines_added >= 1500 or (
            project_total_lines > 0 and (profile.lines_added / project_total_lines) >= 0.35
        )
        if is_few_commits and is_huge_volume and project_total_commits > 5:
            flags.append(AnomalyFlag(
                type="FLAG_BIG_BANG",
                severity="CRITICAL",
                contributor_name=profile.name,
                description=f"{profile.commits_count} commit(s) accounting for +{profile.lines_added:,} lines with minimal history.",
                details="Single massive code dump with no incremental development trail. Typical signature of template copy-paste or AI dump.",
                timestamp=profile.last_commit
            ))

        # 2. Zero Churn / Monolithic Injection Check
        # High volume of additions with 0 or near-zero deletions/modifications
        if profile.lines_added >= 1000 and (profile.churn_ratio == 0.0 or profile.lines_deleted < 5):
            flags.append(AnomalyFlag(
                type="FLAG_ZERO_CHURN",
                severity="HIGH",
                contributor_name=profile.name,
                description=f"Zero deletions ({profile.lines_deleted} lines deleted against {profile.lines_added:,} added).",
                details="Absence of trial-and-error, refactoring, or iterative debugging. Code was likely injected pre-built.",
                timestamp=profile.last_commit
            ))

        # 3. The Lockstep Ghost Contributor
        # Contributor modified files, but has ZERO Tier 3 logic and >= 75% boilerplate/docs
        total_classified_lines = profile.tier_0_lines + profile.tier_1_lines + profile.tier_2_lines + profile.tier_3_lines
        if total_classified_lines > 0:
            doc_boilerplate_ratio = (profile.tier_0_lines + profile.tier_1_lines) / total_classified_lines
            if profile.tier_3_lines == 0 and doc_boilerplate_ratio >= 0.75:
                flags.append(AnomalyFlag(
                    type="FLAG_GHOST_CONTRIBUTOR",
                    severity="MEDIUM",
                    contributor_name=profile.name,
                    description="0% core algorithmic logic authored. 75%+ contributions are docs/styling.",
                    details="Contributor acted as a passenger, claiming project authorship while contributing no functional application or backend logic.",
                    timestamp=profile.last_commit
                ))

        # 4. Extreme Burstiness / Panic Burst
        if profile.burstiness_score >= 0.90 and profile.commits_count >= 1 and profile.lines_added > 800:
            flags.append(AnomalyFlag(
                type="FLAG_PANIC_BURST",
                severity="HIGH",
                contributor_name=profile.name,
                description=f"Extreme commit burstiness index ({profile.burstiness_score:.2f}/1.0).",
                details="Work concentrated in a single abnormal burst rather than distributed development.",
                timestamp=profile.last_commit
            ))

        return flags
