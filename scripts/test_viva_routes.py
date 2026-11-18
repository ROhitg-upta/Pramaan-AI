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
        with urllib.request.urlopen(req, timeout=10) as res:
            return res.status, json.loads(res.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8')
    except Exception as e:
        return 0, str(e)

print("Testing Viva Generation with Real Grounded Files...")
gen_status, gen_res = post_json("/api/viva/generate", {
    "contributorName": "Rohit Gupta",
    "repoName": "ROhitg-upta/Pramaan-AI",
    "auditedFiles": [
        {
            "filePath": "frontend/src/app/api/github/analyze/route.ts",
            "commitHash": "fa130f9",
            "diffSnippet": "export async function POST(req: NextRequest) {\n  const body = await req.json();\n  const { repoUrl, branch } = body;\n  // Handle GitHub 202 retry\n}",
            "tier": 3
        },
        {
            "filePath": "frontend/src/lib/github-analyzer.ts",
            "commitHash": "fa130f9",
            "diffSnippet": "export async function analyzeGitHubRepoDirectly(url: string, branch: string, onProgress: ProgressCallback) {\n  // Ingestion DAG\n}",
            "tier": 3
        }
    ]
})

print(f"Gen Status: {gen_status}")
print(f"Questions Generated: {len(gen_res.get('questions', []))}")
for i, q in enumerate(gen_res.get('questions', []), 1):
    print(f"  Q{i}: {q.get('question_text')}")
    print(f"      File: {q.get('file_path')} (Commit: {q.get('commit_hash')})")
    print(f"      Expected Concepts: {q.get('expected_key_concepts')}")

print("\nTesting Viva Evaluation with Answer...")
eval_status, eval_res = post_json("/api/viva/evaluate", {
    "questionId": "q-1",
    "questionText": gen_res.get('questions', [{}])[0].get('question_text', "Explain how you handle edge cases."),
    "answer": "In route.ts, I wrapped the GitHub API calls with error handling and retry logic. For 202 Accepted, we sleep 1 second and retry up to 3 times because GitHub computes contributor stats asynchronously. For rate limits, we extract resetTime from headers and return a 403 payload.",
    "expectedKeyConcepts": ["retry", "202 Accepted", "error", "headers"]
})

print(f"Eval Status: {eval_status}")
print(f"Verdict: {eval_res.get('verdict')}")
print(f"Score: {eval_res.get('score')}")
print(f"Technical Accuracy: {eval_res.get('technical_accuracy')}")
print(f"Tactical Authenticity: {eval_res.get('tactical_authenticity')}")
print(f"Key Concepts Covered: {eval_res.get('key_concepts_covered')}")
print(f"Builder Signals: {eval_res.get('builder_signals_detected')}")
print(f"Feedback: {eval_res.get('feedback')}")
print(f"Evaluator Note: {eval_res.get('evaluator_note')}")
