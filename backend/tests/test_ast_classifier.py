from app.engine.ast_classifier import ASTClassifier

def test_tier_classification():
    classifier = ASTClassifier()

    # Tier 0: Lockfiles / JSON
    tier, weight, _ = classifier.classify_file("package-lock.json")
    assert tier == 0
    assert weight == 0.0

    tier, weight, _ = classifier.classify_file("assets/logo.svg")
    assert tier == 0

    # Tier 1: CSS, HTML, Configs
    tier, weight, _ = classifier.classify_file("src/styles/main.css")
    assert tier == 1
    assert weight == 0.2

    tier, weight, _ = classifier.classify_file("README.md")
    assert tier == 1

    # Tier 2: Components and Routes
    tier, weight, _ = classifier.classify_file("src/components/UserCard.tsx")
    assert tier == 2
    assert weight == 1.0

    tier, weight, _ = classifier.classify_file("app/api/users.py")
    assert tier == 2

    # Tier 3: Core algorithms, Auth, Services
    tier, weight, _ = classifier.classify_file("src/services/auth_service.py")
    assert tier == 3
    assert weight == 3.0

    # Tier 3 via content pattern check
    content = "async def rotate_token():\n    lock = await acquire_redis_lock()\n    return jwt.encode(payload)"
    tier, weight, _ = classifier.classify_file("random_file.py", diff_or_content=content)
    assert tier == 3

def test_weighted_scoring():
    classifier = ASTClassifier()
    # 100 lines of Tier 3 = 300 points
    assert classifier.calculate_weighted_score(100, 3) == 300.0
    # 100 lines of Tier 1 = 20 points
    assert classifier.calculate_weighted_score(100, 1) == 20.0
    # 100 lines of Tier 0 = 0 points
    assert classifier.calculate_weighted_score(100, 0) == 0.0
