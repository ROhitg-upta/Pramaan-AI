import json
import urllib.request
import urllib.error

BASE_URL = "http://localhost:3005"

def post_json(endpoint, data):
    url = f"{BASE_URL}{endpoint}"
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as res:
            return res.status, json.loads(res.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        try:
            parsed = json.loads(body)
        except:
            parsed = body
        return e.code, parsed
    except Exception as e:
        return 0, str(e)

print("=" * 60)
print("TEST 1: Ingesting Real Repo (ROhitg-upta/Pramaan-AI)...")
print("=" * 60)
status, res = post_json("/api/github/analyze", {
    "repoUrl": "https://github.com/ROhitg-upta/Pramaan-AI",
    "branch": "main"
})
print(f"Status: {status}")
if status == 200:
    print(f"  Repo URL: {res.get('repo_url')}")
    print(f"  Total Commits: {res.get('total_commits')}")
    print(f"  Total Lines Audited: {res.get('total_lines_audited')}")
    print(f"  Total Files: {res.get('total_files')}")
    print(f"  Is Demo: {res.get('is_demo')}")
    print(f"  Contributors Count: {len(res.get('contributors', []))}")
    for c in res.get('contributors', []):
        print(f"    - Contributor: {c.get('name')} (@{c.get('github_login')})")
        print(f"      Commits: {c.get('commits_count')}, Lines: {c.get('lines_added')}, Churn: {c.get('churn_ratio')}")
        print(f"      Tier 3 Lines: {c.get('tier_breakdown', {}).get('tier_3_lines')}")
        print(f"      Tier 2 Lines: {c.get('tier_breakdown', {}).get('tier_2_lines')}")
        print(f"      Audited Files: {len(c.get('top_files', []))} files listed")
    print(f"  Global Audited Files: {len(res.get('audited_files', []))}")
    if res.get('audited_files'):
        sample_file = res['audited_files'][0]
        print(f"  Sample Audited File: {sample_file.get('filename')} (has patch: {bool(sample_file.get('patch'))})")
else:
    print(f"  Error Response: {res}")

print("\n" + "=" * 60)
print("TEST 2: Ingesting Invalid Repo (should return 404 cleanly)...")
print("=" * 60)
status_invalid, res_invalid = post_json("/api/github/analyze", {
    "repoUrl": "https://github.com/nonexistent-org/invalid-test-repo-9999",
    "branch": "main"
})
print(f"Status: {status_invalid} (Expected: 404 or 422)")
print(f"Response: {res_invalid}")

print("\n" + "=" * 60)
print("TEST 3: Viva Generation for Real Contributor...")
print("=" * 60)
if status == 200 and res.get('contributors'):
    first_contrib = res['contributors'][0]
    first_file = res['audited_files'][0]['filename'] if res.get('audited_files') else 'frontend/src/app/page.tsx'
    patch_snippet = res['audited_files'][0]['patch'][:200] if res.get('audited_files') and res['audited_files'][0].get('patch') else None

    viva_status, viva_res = post_json("/api/viva/generate", {
        "contributorName": first_contrib.get('name'),
        "repoName": "ROhitg-upta/Pramaan-AI",
        "primaryFiles": [first_file],
        "topCommits": ["Add Next.js GitHub analyze proxy and dynamic file heatmap diffs"],
        "codeDiffSnippet": patch_snippet
    })
    print(f"Viva Status: {viva_status}")
    if viva_status == 200:
        questions = viva_res.get('questions', [])
        print(f"Generated {len(questions)} Viva Questions:")
        for i, q in enumerate(questions, 1):
            print(f"  Q{i}: {q.get('question_text')}")
            print(f"      Target: {q.get('target_file')} | Concepts: {q.get('expected_concepts')}")
    else:
        print(f"Viva Gen Error: {viva_res}")

print("\n" + "=" * 60)
print("TEST 4: Viva Defense Evaluation...")
print("=" * 60)
eval_status, eval_res = post_json("/api/viva/evaluate", {
    "questionId": "q-1",
    "questionText": "Explain how you handle GitHub 202 Accepted polling and rate limit headers.",
    "candidateAnswer": "I implemented a retry loop that checks for 202 status codes up to 3 times with exponential backoff because GitHub's stats endpoint computes contributors asynchronously. I also pass the Authorization header with GITHUB_TOKEN to ensure 5,000 requests per hour limit.",
    "expectedConcepts": ["retry", "202 Accepted", "rate limit", "token"]
})
print(f"Eval Status: {eval_status}")
print(f"Eval Verdict: {eval_res.get('verdict')}")
print(f"Eval Score: {eval_res.get('score')}")
print(f"Key Concepts Covered: {eval_res.get('key_concepts_covered')}")
print(f"Evaluator Note: {eval_res.get('evaluator_note')}")
print("=" * 60)
