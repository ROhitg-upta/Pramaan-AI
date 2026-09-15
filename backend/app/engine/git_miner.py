import os
import shutil
import uuid
import logging
from datetime import datetime
from typing import Dict, List, Optional, Set
from pydriller import Repository
from git import Repo

from app.core.config import settings
from app.models.schemas import CommitInfo, ModifiedFileInfo, RawAuthorMetrics, MiningResult

logger = logging.getLogger(__name__)

# Directory and file ignore patterns for high-signal forensics
IGNORED_DIRECTORIES = {
    "node_modules", "vendor", "dist", "build", ".next", ".git", 
    "venv", ".venv", "__pycache__", "coverage", ".turbo", ".cache"
}

IGNORED_EXTENSIONS = {
    ".lock", ".min.js", ".min.css", ".map", ".svg", ".png", 
    ".jpg", ".jpeg", ".gif", ".ico", ".pdf", ".zip", ".tar", ".gz"
}

def is_ignored_path(file_path: Optional[str]) -> bool:
    if not file_path:
        return True
    
    parts = file_path.replace("\\", "/").split("/")
    for part in parts:
        if part in IGNORED_DIRECTORIES:
            return True
            
    _, ext = os.path.splitext(file_path.lower())
    if ext in IGNORED_EXTENSIONS:
        return True
        
    return False

def calculate_burstiness(timestamps: List[datetime]) -> float:
    """
    Calculates normalized burstiness of commits (0.0 = steady, 1.0 = highly bursty/single dump).
    """
    if len(timestamps) <= 1:
        return 1.0 if len(timestamps) == 1 else 0.0
        
    intervals = []
    for i in range(1, len(timestamps)):
        diff_seconds = abs((timestamps[i] - timestamps[i-1]).total_seconds())
        intervals.append(diff_seconds)
        
    if not intervals or sum(intervals) == 0:
        return 1.0
        
    mean_interval = sum(intervals) / len(intervals)
    variance = sum((x - mean_interval) ** 2 for x in intervals) / len(intervals)
    std_dev = variance ** 0.5
    
    # Coefficient of variation (CV) = std_dev / mean
    cv = std_dev / mean_interval if mean_interval > 0 else 1.0
    # Normalized burstiness index B = (cv - 1) / (cv + 1) mapped to [0, 1]
    b = (cv - 1) / (cv + 1)
    normalized = max(0.0, min(1.0, (b + 1) / 2))
    return round(normalized, 2)

class GitForensicMiner:
    def __init__(self, repo_url_or_path: str, max_commits: int = 1000):
        self.source = repo_url_or_path
        self.max_commits = max_commits
        self.working_dir = None
        self.is_cloned_temp = False

    def prepare_repo(self) -> str:
        """Resolves local path or clones remote git repository."""
        if os.path.exists(self.source) and os.path.isdir(self.source):
            return os.path.abspath(self.source)

        # Clone remote git repository
        clone_uuid = str(uuid.uuid4())[:8]
        os.makedirs(settings.REPO_CLONE_DIR, exist_ok=True)
        target_dir = os.path.join(settings.REPO_CLONE_DIR, f"repo_{clone_uuid}")
        
        logger.info(f"Cloning {self.source} to {target_dir}...")
        Repo.clone_from(self.source, target_dir, depth=self.max_commits)
        self.working_dir = target_dir
        self.is_cloned_temp = True
        return target_dir

    def cleanup(self):
        """Cleans up temporary clone directory."""
        if self.is_cloned_temp and self.working_dir and os.path.exists(self.working_dir):
            try:
                shutil.rmtree(self.working_dir, ignore_errors=True)
            except Exception as e:
                logger.warning(f"Failed to remove temp repo dir {self.working_dir}: {e}")

    def mine(self) -> MiningResult:
        repo_path = self.prepare_repo()
        commits_list: List[CommitInfo] = []
        author_data: Dict[str, Dict] = {}
        all_audited_files: Set[str] = set()
        
        first_date: Optional[datetime] = None
        last_date: Optional[datetime] = None
        total_added = 0
        total_deleted = 0

        try:
            pydriller_repo = Repository(repo_path, order='date-order')
            commit_count = 0

            for commit in pydriller_repo.traverse_commits():
                if commit_count >= self.max_commits:
                    break

                commit_count += 1
                c_date = commit.author_date
                
                if first_date is None or c_date < first_date:
                    first_date = c_date
                if last_date is None or c_date > last_date:
                    last_date = c_date

                # Extract modified files (filtering ignored directories/extensions)
                mod_files: List[ModifiedFileInfo] = []
                commit_added = 0
                commit_deleted = 0

                for mod in commit.modified_files:
                    path = mod.new_path or mod.old_path
                    if is_ignored_path(path):
                        continue

                    all_audited_files.add(path)
                    added = mod.added_lines
                    deleted = mod.deleted_lines
                    commit_added += added
                    commit_deleted += deleted

                    # Diff snippet sample (first 100 lines)
                    diff_snippet = mod.diff[:2000] if mod.diff else None

                    mod_files.append(ModifiedFileInfo(
                        file_path=path,
                        change_type=mod.change_type.name,
                        lines_added=added,
                        lines_deleted=deleted,
                        diff_snippet=diff_snippet
                    ))

                total_added += commit_added
                total_deleted += commit_deleted

                # Author tracking key (normalized name)
                author_name = (commit.author.name or "Unknown").strip()
                author_email = (commit.author.email or "").strip().lower()

                if author_name not in author_data:
                    author_data[author_name] = {
                        "name": author_name,
                        "emails": set(),
                        "commits_count": 0,
                        "lines_added": 0,
                        "lines_deleted": 0,
                        "timestamps": [],
                        "commit_hashes": [],
                    }

                author_data[author_name]["emails"].add(author_email)
                author_data[author_name]["commits_count"] += 1
                author_data[author_name]["lines_added"] += commit_added
                author_data[author_name]["lines_deleted"] += commit_deleted
                author_data[author_name]["timestamps"].append(c_date)
                author_data[author_name]["commit_hashes"].append(commit.hash)

                # Day index relative to project start
                day_index = 1
                if first_date:
                    day_index = max(1, (c_date.date() - first_date.date()).days + 1)

                commit_info = CommitInfo(
                    commit_hash=commit.hash,
                    author_name=author_name,
                    author_email=author_email,
                    timestamp=c_date,
                    message=commit.msg.strip(),
                    lines_added=commit_added,
                    lines_deleted=commit_deleted,
                    files_changed_count=len(mod_files),
                    is_merge=commit.merge,
                    day_index=day_index,
                    modified_files=mod_files
                )
                commits_list.append(commit_info)

        finally:
            # Note: We keep working_dir if it was pre-existing, or cleanup if caller finishes
            pass

        # Build raw authors metrics
        raw_authors: Dict[str, RawAuthorMetrics] = {}
        for name, data in author_data.items():
            ts_list = sorted(data["timestamps"])
            added = data["lines_added"]
            deleted = data["lines_deleted"]
            churn = round((deleted / added * 100), 1) if added > 0 else 0.0

            active_days = len(set(ts.date() for ts in ts_list)) if ts_list else 0
            burstiness = calculate_burstiness(ts_list)

            raw_authors[name] = RawAuthorMetrics(
                name=name,
                emails=list(data["emails"]),
                commits_count=data["commits_count"],
                lines_added=added,
                lines_deleted=deleted,
                churn_ratio=churn,
                first_commit=ts_list[0] if ts_list else None,
                last_commit=ts_list[-1] if ts_list else None,
                active_days=active_days,
                burstiness_score=burstiness,
                commits=data["commit_hashes"]
            )

        return MiningResult(
            repo_url_or_path=self.source,
            total_commits=len(commits_list),
            total_lines_added=total_added,
            total_lines_deleted=total_deleted,
            total_files_audited=len(all_audited_files),
            first_commit_date=first_date,
            last_commit_date=last_date,
            commits=commits_list,
            raw_authors=raw_authors
        )
