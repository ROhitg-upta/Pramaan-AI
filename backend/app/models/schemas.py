from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ModifiedFileInfo(BaseModel):
    file_path: str
    change_type: str  # ADD, MODIFY, DELETE, RENAME
    lines_added: int = 0
    lines_deleted: int = 0
    diff_snippet: Optional[str] = None
    tier: Optional[int] = None
    tier_weight: Optional[float] = None

class CommitInfo(BaseModel):
    commit_hash: str
    author_name: str
    author_email: str
    timestamp: datetime
    message: str
    lines_added: int = 0
    lines_deleted: int = 0
    files_changed_count: int = 0
    is_merge: bool = False
    is_anomalous: bool = False
    anomaly_type: Optional[str] = None
    day_index: Optional[int] = 1
    modified_files: List[ModifiedFileInfo] = Field(default_factory=list)

class RawAuthorMetrics(BaseModel):
    name: str
    emails: List[str] = Field(default_factory=list)
    commits_count: int = 0
    lines_added: int = 0
    lines_deleted: int = 0
    churn_ratio: float = 0.0
    first_commit: Optional[datetime] = None
    last_commit: Optional[datetime] = None
    active_days: int = 0
    burstiness_score: float = 0.0
    commits: List[str] = Field(default_factory=list)  # list of commit hashes

class MiningResult(BaseModel):
    repo_url_or_path: str
    total_commits: int
    total_lines_added: int
    total_lines_deleted: int
    total_files_audited: int
    first_commit_date: Optional[datetime] = None
    last_commit_date: Optional[datetime] = None
    commits: List[CommitInfo] = Field(default_factory=list)
    raw_authors: Dict[str, RawAuthorMetrics] = Field(default_factory=dict)
