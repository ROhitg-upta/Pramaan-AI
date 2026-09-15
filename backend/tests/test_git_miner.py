import os
import shutil
import tempfile
from datetime import datetime
from git import Repo
import pytest

from app.engine.git_miner import GitForensicMiner, calculate_burstiness

@pytest.fixture
def temp_git_repo():
    """Creates a temporary git repo with controlled commits for testing."""
    temp_dir = tempfile.mkdtemp(prefix="test_repo_")
    repo = Repo.init(temp_dir)
    
    # Configure git author
    repo.config_writer().set_value("user", "name", "Test Builder").release()
    repo.config_writer().set_value("user", "email", "builder@test.com").release()
    
    # Commit 1: Add a python file
    file1 = os.path.join(temp_dir, "auth.py")
    with open(file1, "w") as f:
        f.write("def login():\n    return True\n")
    repo.index.add(["auth.py"])
    repo.index.commit("feat: initial login implementation")
    
    # Commit 2: Modify and delete some lines
    with open(file1, "w") as f:
        f.write("def login(user, password):\n    # verified auth\n    return True\n")
    repo.index.add(["auth.py"])
    repo.index.commit("refactor: add credentials parameters")

    yield temp_dir
    shutil.rmtree(temp_dir, ignore_errors=True)

def test_burstiness_calculation():
    # Single timestamp -> 1.0
    now = datetime.now()
    assert calculate_burstiness([now]) == 1.0
    # Empty -> 0.0
    assert calculate_burstiness([]) == 0.0

def test_git_miner_local_repo(temp_git_repo):
    miner = GitForensicMiner(temp_git_repo)
    result = miner.mine()
    
    assert result.total_commits == 2
    assert "Test Builder" in result.raw_authors
    
    author = result.raw_authors["Test Builder"]
    assert author.commits_count == 2
    assert "builder@test.com" in author.emails
    assert author.lines_added > 0
    assert author.churn_ratio > 0  # We modified/deleted lines in commit 2
    assert len(result.commits) == 2
    assert result.commits[0].author_name == "Test Builder"
