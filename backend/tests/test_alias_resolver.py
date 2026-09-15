from app.engine.alias_resolver import AliasResolver, are_aliases, levenshtein_similarity
from app.models.schemas import RawAuthorMetrics

def test_levenshtein_similarity():
    assert levenshtein_similarity("rohit", "rohit") == 1.0
    assert levenshtein_similarity("rohit", "rohit1") >= 0.8
    assert levenshtein_similarity("alex", "bob") < 0.5

def test_alias_detection():
    # Same email
    assert are_aliases("Rohit", ["rohit@college.edu"], "Rohit S", ["rohit@college.edu"]) == True
    # Normalized name similarity
    assert are_aliases("Rohit Sharma", ["r@a.com"], "rohit-sharma", ["r@b.com"]) == True
    # Email prefix matching name
    assert are_aliases("Rohit Sharma", ["rohitsharma@gmail.com"], "Alex", ["rohitsharma@univ.edu"]) == True
    # Different people
    assert are_aliases("Aryan Kumar", ["aryan@gmail.com"], "Rohit Sharma", ["rohit@gmail.com"]) == False

def test_alias_clustering_and_merging():
    resolver = AliasResolver()
    
    author1 = RawAuthorMetrics(
        name="Rohit Sharma",
        emails=["rohit@college.edu"],
        commits_count=10,
        lines_added=500,
        lines_deleted=100,
        commits=["c1", "c2"]
    )
    author2 = RawAuthorMetrics(
        name="rohit-sharma",
        emails=["rohit.dev@gmail.com"],
        commits_count=5,
        lines_added=200,
        lines_deleted=50,
        commits=["c3"]
    )
    author3 = RawAuthorMetrics(
        name="Aryan Kumar",
        emails=["aryan@gmail.com"],
        commits_count=2,
        lines_added=1000,
        lines_deleted=0,
        commits=["c4"]
    )

    raw_dict = {
        "Rohit Sharma": author1,
        "rohit-sharma": author2,
        "Aryan Kumar": author3
    }

    resolved = resolver.resolve(raw_dict)
    assert len(resolved) == 2  # Rohit's two accounts should merge into 1

    rohit_profile = next(a for a in resolved if "Rohit" in a.name)
    assert rohit_profile.commits_count == 15
    assert rohit_profile.lines_added == 700
    assert rohit_profile.lines_deleted == 150
    assert set(rohit_profile.emails) == {"rohit@college.edu", "rohit.dev@gmail.com"}
    assert len(rohit_profile.commits) == 3
