import os
import re
from typing import Tuple, Dict, Any, Optional

TIER_WEIGHTS = {
    0: 0.0,
    1: 0.2,
    2: 1.0,
    3: 3.0
}

TIER_DESCRIPTIONS = {
    0: "Tier 0 (Ignored / Vendor / Asset)",
    1: "Tier 1 (Boilerplate / Config / Presentation)",
    2: "Tier 2 (Application / UI / Route Logic)",
    3: "Tier 3 (Core Algorithmic / Deep Logic)"
}

# Regex patterns indicating Tier 3 core algorithmic logic
CORE_LOGIC_PATTERNS = [
    r"\b(jwt|encrypt|decrypt|hash|cipher|crypto|token|auth)\b",
    r"\b(mutex|lock|semaphore|concurrent|thread|asyncio\.gather)\b",
    r"\b(algorithm|sort|search|binary_search|dijkstra|graph|tree)\b",
    r"\b(cache|redis|ttl|memoize|lru_cache)\b",
    r"\b(matrix|cosine_similarity|euclidean|regression|knn|svd|model)\b",
    r"\b(state_machine|transition|reducer|dispatch)\b",
    r"\b(idempotency|race_condition|retry_with_backoff)\b"
]

# Path patterns indicating Tier 3
CORE_PATH_PATTERNS = [
    "services/", "engine/", "algorithms/", "crypto/", "auth/", 
    "core/", "security/", "models/algo", "ml/", "utils/math"
]

# Path patterns indicating Tier 2
APP_PATH_PATTERNS = [
    "controllers/", "routes/", "views/", "components/", "pages/", 
    "handlers/", "api/", "hooks/", "store/", "context/"
]

# Extensions for Tier 1
BOILERPLATE_EXTENSIONS = {
    ".html", ".htm", ".css", ".scss", ".sass", ".less", ".md", ".txt", ".yaml", ".yml", ".toml"
}

# Extensions for Tier 0
IGNORED_EXTENSIONS = {
    ".lock", ".json", ".svg", ".png", ".jpg", ".jpeg", ".ico", ".map", ".min.js", ".min.css", ".sql"
}

class ASTClassifier:
    """
    Classifies code changes into 4 semantic complexity tiers (Tier 0 to Tier 3)
    and computes weighted contribution scores.
    """

    def classify_file(self, file_path: str, diff_or_content: Optional[str] = None) -> Tuple[int, float, str]:
        """
        Returns (tier_number, tier_weight, reasoning).
        """
        normalized_path = file_path.replace("\\", "/").lower()
        _, ext = os.path.splitext(normalized_path)

        # 1. Tier 0 check: Ignored files, lockfiles, minified files, vendor
        if ext in IGNORED_EXTENSIONS or "lock" in normalized_path:
            return 0, TIER_WEIGHTS[0], "Static config, asset, or lockfile."

        # 2. Tier 1 check: Pure HTML, CSS, Markdown documentation
        if ext in BOILERPLATE_EXTENSIONS:
            return 1, TIER_WEIGHTS[1], "Styling, presentation markup, or documentation."

        if any(cfg in normalized_path for cfg in ["config", "setup.", "env.", "types.", "interface."]):
            return 1, TIER_WEIGHTS[1], "Configuration or type declarations."

        # 3. Check for Tier 3: Core logic directories
        if any(pattern in normalized_path for pattern in CORE_PATH_PATTERNS):
            return 3, TIER_WEIGHTS[3], "High-value business logic, algorithm, or service path."

        # 4. Content analysis for Tier 3 patterns
        if diff_or_content:
            sample = diff_or_content[:5000].lower()
            tier3_matches = 0
            for pat in CORE_LOGIC_PATTERNS:
                if re.search(pat, sample):
                    tier3_matches += 1

            if tier3_matches >= 2:
                return 3, TIER_WEIGHTS[3], f"Detected {tier3_matches} core algorithmic and security patterns."

        # 5. Tier 2 check: Application & UI controllers/routes
        if any(pattern in normalized_path for pattern in APP_PATH_PATTERNS):
            return 2, TIER_WEIGHTS[2], "Application controller, API route, or UI component logic."

        # Default fallback: Tier 2 for code files (.py, .ts, .js, .go, .rs, .java)
        if ext in {".py", ".ts", ".js", ".jsx", ".tsx", ".go", ".rs", ".java", ".cpp", ".c"}:
            return 2, TIER_WEIGHTS[2], "General source code logic."

        return 1, TIER_WEIGHTS[1], "Generic non-algorithmic file."

    def calculate_weighted_score(self, lines_added: int, tier: int) -> float:
        """Computes effective code score: lines * tier_weight"""
        weight = TIER_WEIGHTS.get(tier, 1.0)
        return round(lines_added * weight, 2)
