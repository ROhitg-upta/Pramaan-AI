import re
from typing import Dict, List, Set, Tuple
from app.models.schemas import RawAuthorMetrics

def normalize_text(text: str) -> str:
    """Removes non-alphanumeric chars, lowercases, and trims whitespace."""
    if not text:
        return ""
    return re.sub(r'[^a-zA-Z0-9]', '', text).lower()

def levenshtein_similarity(s1: str, s2: str) -> float:
    """Calculates Levenshtein ratio between 0.0 and 1.0."""
    if s1 == s2:
        return 1.0
    if not s1 or not s2:
        return 0.0

    len1, len2 = len(s1), len(s2)
    # Distance matrix
    matrix = [[0] * (len2 + 1) for _ in range(len1 + 1)]
    for i in range(len1 + 1):
        matrix[i][0] = i
    for j in range(len2 + 1):
        matrix[0][j] = j

    for i in range(1, len1 + 1):
        for j in range(1, len2 + 1):
            cost = 0 if s1[i - 1] == s2[j - 1] else 1
            matrix[i][j] = min(
                matrix[i - 1][j] + 1,      # deletion
                matrix[i][j - 1] + 1,      # insertion
                matrix[i - 1][j - 1] + cost # substitution
            )

    dist = matrix[len1][len2]
    max_len = max(len1, len2)
    return 1.0 - (dist / max_len) if max_len > 0 else 1.0

def are_aliases(name1: str, emails1: List[str], name2: str, emails2: List[str], threshold: float = 0.82) -> bool:
    """
    Determines if two author records represent the same human contributor.
    """
    # 1. Exact email match between any emails
    set1 = set(e.lower().strip() for e in emails1 if e)
    set2 = set(e.lower().strip() for e in emails2 if e)
    if set1 and set2 and not set1.isdisjoint(set2):
        return True

    # 2. Normalized name similarity
    n1 = normalize_text(name1)
    n2 = normalize_text(name2)
    if n1 and n2 and levenshtein_similarity(n1, n2) >= threshold:
        return True

    # 3. Email username prefix similarity
    # e.g. "rohit.sharma@..." vs "rohitsharma@..."
    for e1 in set1:
        u1 = normalize_text(e1.split("@")[0])
        for e2 in set2:
            u2 = normalize_text(e2.split("@")[0])
            if u1 and u2 and levenshtein_similarity(u1, u2) >= threshold:
                return True
        # Check email username against display name
        if u1 and n2 and levenshtein_similarity(u1, n2) >= threshold:
            return True

    for e2 in set2:
        u2 = normalize_text(e2.split("@")[0])
        if u2 and n1 and levenshtein_similarity(u2, n1) >= threshold:
            return True

    return False

class AliasResolver:
    """
    Clusters raw git authors into deduplicated canonical contributor profiles.
    """
    def __init__(self, similarity_threshold: float = 0.82):
        self.threshold = similarity_threshold

    def resolve(self, raw_authors: Dict[str, RawAuthorMetrics]) -> List[RawAuthorMetrics]:
        if not raw_authors:
            return []

        author_list = list(raw_authors.values())
        # Clusters of authors
        clusters: List[List[RawAuthorMetrics]] = []

        for author in author_list:
            matched_cluster = None
            for cluster in clusters:
                # Compare against the primary representative of the cluster
                rep = cluster[0]
                if are_aliases(author.name, author.emails, rep.name, rep.emails, self.threshold):
                    matched_cluster = cluster
                    break

            if matched_cluster is not None:
                matched_cluster.append(author)
            else:
                clusters.append([author])

        # Merge clusters into canonical author profiles
        resolved_contributors: List[RawAuthorMetrics] = []
        for cluster in clusters:
            if len(cluster) == 1:
                resolved_contributors.append(cluster[0])
                continue

            # Pick the cleanest display name (prefer non-email names, longest formatted name)
            primary_name = max(cluster, key=lambda a: len(a.name) if "@" not in a.name else 0).name
            merged_emails: Set[str] = set()
            total_commits = 0
            total_added = 0
            total_deleted = 0
            all_commit_hashes: List[str] = []
            earliest_date = None
            latest_date = None
            all_active_days = 0

            for a in cluster:
                merged_emails.update(a.emails)
                total_commits += a.commits_count
                total_added += a.lines_added
                total_deleted += a.lines_deleted
                all_commit_hashes.extend(a.commits)
                if a.first_commit:
                    if earliest_date is None or a.first_commit < earliest_date:
                        earliest_date = a.first_commit
                if a.last_commit:
                    if latest_date is None or a.last_commit > latest_date:
                        latest_date = a.last_commit
                all_active_days = max(all_active_days, a.active_days)

            churn = round((total_deleted / total_added * 100), 1) if total_added > 0 else 0.0
            avg_burstiness = round(sum(a.burstiness_score for a in cluster) / len(cluster), 2)

            merged_author = RawAuthorMetrics(
                name=primary_name,
                emails=sorted(list(merged_emails)),
                commits_count=total_commits,
                lines_added=total_added,
                lines_deleted=total_deleted,
                churn_ratio=churn,
                first_commit=earliest_date,
                last_commit=latest_date,
                active_days=all_active_days,
                burstiness_score=avg_burstiness,
                commits=all_commit_hashes
            )
            resolved_contributors.append(merged_author)

        return resolved_contributors
