import os
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import init_db

DEMO_REPO_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../smart-campus-app"))

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    init_db()

def test_root_and_health_endpoints():
    with TestClient(app) as client:
        r_root = client.get("/")
        assert r_root.status_code == 200
        assert r_root.json()["app"] == "Pramaan AI"

        r_health = client.get("/health")
        assert r_health.status_code == 200
        assert r_health.json()["status"] == "healthy"

def test_analyze_and_report_pipeline_via_api():
    with TestClient(app) as client:
        # 1. Trigger analysis on demo repo
        res = client.post("/api/v1/analyze/repo", json={
            "repo_url": DEMO_REPO_PATH,
            "branch": "master"
        })
        assert res.status_code == 202
        data = res.json()
        assert "analysis_id" in data
        analysis_id = data["analysis_id"]

        # 2. Check status endpoint
        res_status = client.get(f"/api/v1/analyze/{analysis_id}/status")
        assert res_status.status_code == 200
        status_data = res_status.json()
        assert status_data["analysis_id"] == analysis_id

        # 3. Check report endpoint
        res_report = client.get(f"/api/v1/analyze/{analysis_id}/report")
        assert res_report.status_code == 200
        report_data = res_report.json()
        assert report_data["analysis_id"] == analysis_id
        assert len(report_data["contributors"]) == 3

        # Check that Aryan is flagged as suspect
        aryan = next(c for c in report_data["contributors"] if "Aryan" in c["primary_name"])
        assert aryan["verdict"] == "SUSPECT_FREELOADER"

        # Check that Rohit is verified builder
        rohit = next(c for c in report_data["contributors"] if "Rohit" in c["primary_name"])
        assert rohit["verdict"] == "VERIFIED_BUILDER"

        # 4. Check Viva Questions for Rohit
        res_viva = client.post(f"/api/v1/viva/{analysis_id}/questions", json={
            "contributor_id": rohit["id"],
            "question_count": 3
        })
        assert res_viva.status_code == 200
        viva_data = res_viva.json()
        assert len(viva_data["questions"]) >= 1
        question = viva_data["questions"][0]

        # 5. Evaluate an answer for this question
        res_eval = client.post("/api/v1/viva/evaluate", json={
            "question_id": question["id"],
            "student_answer": "I used a distributed mutex lock with a 5 second TTL to prevent race conditions during refresh token rotation.",
            "ttfk_seconds": 3.2,
            "paste_detected": False
        })
        assert res_eval.status_code == 200
        eval_data = res_eval.json()
        assert "score" in eval_data
        assert "verdict" in eval_data
