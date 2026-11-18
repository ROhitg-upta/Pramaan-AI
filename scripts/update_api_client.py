import os

path = os.path.join('frontend', 'src', 'lib', 'api.ts')
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

crlf = '\r\n' in text
newline = '\r\n' if crlf else '\n'

# 1. Update checkBackendHealth to check /health first, then /docs with 2500ms timeout
old_health = f'''export async function checkBackendHealth(): Promise<{{
  live: boolean;
  mode: "LIVE" | "GITHUB_DIRECT" | "MOCK";
  url: string;
  latencyMs?: number;
}}> {{
  const start = performance.now();
  try {{
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    const res = await fetch(`${{API_BASE_URL}}/docs`, {{
      method: "GET",
      signal: controller.signal,
    }});
    clearTimeout(timeoutId);

    const latencyMs = Math.round(performance.now() - start);
    return {{
      live: res.ok || res.status < 500,
      mode: res.ok ? "LIVE" : "GITHUB_DIRECT",
      url: API_BASE_URL,
      latencyMs,
    }};
  }} catch {{
    return {{
      live: false,
      mode: "GITHUB_DIRECT",
      url: API_BASE_URL,
    }};
  }}
}}'''.replace('\n', newline)

new_health = f'''export async function checkBackendHealth(): Promise<{{
  live: boolean;
  mode: "LIVE" | "GITHUB_DIRECT" | "MOCK";
  url: string;
  latencyMs?: number;
}}> {{
  const start = performance.now();
  try {{
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    // Try /health first, then fallback to /docs
    const res = await fetch(`${{API_BASE_URL}}/health`, {{
      method: "GET",
      signal: controller.signal,
    }}).catch(() => null);

    clearTimeout(timeoutId);

    if (res && (res.ok || res.status < 500)) {{
      const latencyMs = Math.round(performance.now() - start);
      return {{
        live: true,
        mode: "LIVE",
        url: API_BASE_URL,
        latencyMs,
      }};
    }}

    // Secondary probe for /docs
    const controller2 = new AbortController();
    const timeoutId2 = setTimeout(() => controller2.abort(), 1500);
    const docsRes = await fetch(`${{API_BASE_URL}}/docs`, {{
      method: "GET",
      signal: controller2.signal,
    }}).catch(() => null);
    clearTimeout(timeoutId2);

    if (docsRes && (docsRes.ok || docsRes.status < 500)) {{
      const latencyMs = Math.round(performance.now() - start);
      return {{
        live: true,
        mode: "LIVE",
        url: API_BASE_URL,
        latencyMs,
      }};
    }}

    return {{
      live: false,
      mode: "GITHUB_DIRECT",
      url: API_BASE_URL,
    }};
  }} catch {{
    return {{
      live: false,
      mode: "GITHUB_DIRECT",
      url: API_BASE_URL,
    }};
  }}
}}'''.replace('\n', newline)

if old_health in text:
    text = text.replace(old_health, new_health, 1)
    print("checkBackendHealth updated")
else:
    print("checkBackendHealth pattern not matched")

# 2. Update analyzeRepo with timeout on Render backend
old_analyze = f'''  // 1. Try FastAPI backend if running
  try {{
    const res = await fetch(`${{API_BASE_URL}}/api/v1/analyze/repo`, {{
      method: "POST",
      headers: {{ "Content-Type": "application/json" }},
      body: JSON.stringify({{ repo_url: cleanUrl, branch }}),
    }});

    if (res.ok) {{
      const data = await res.json();
      return {{
        analysis_id: data.analysis_id,
        status: "processing",
        message: "FastAPI PyDriller forensic pipeline initialized.",
        isRealRepo: true,
      }};
    }}
  }} catch {{
    // FastAPI backend offline — seamlessly fall through to Direct GitHub API engine
  }}'''.replace('\n', newline)

new_analyze = f'''  // 1. Try FastAPI backend (Render / Local) with resilient 3500ms timeout
  try {{
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${{API_BASE_URL}}/api/v1/analyze/repo`, {{
      method: "POST",
      headers: {{ "Content-Type": "application/json" }},
      body: JSON.stringify({{ repo_url: cleanUrl, branch }}),
      signal: controller.signal,
    }});
    clearTimeout(timeoutId);

    if (res.ok) {{
      const data = await res.json();
      return {{
        analysis_id: data.analysis_id,
        status: "processing",
        message: "FastAPI PyDriller forensic pipeline initialized on Render.",
        isRealRepo: true,
      }};
    }}
  }} catch {{
    // FastAPI backend offline or sleeping on Render — seamlessly fall through to Direct GitHub API engine
  }}'''.replace('\n', newline)

if old_analyze in text:
    text = text.replace(old_analyze, new_analyze, 1)
    print("analyzeRepo updated")
else:
    print("analyzeRepo pattern not matched")

# 3. Update getVivaQuestions to try Render backend first, then Next.js route
old_viva_q = f'''  // Try Next.js server-side /api/viva/generate
  try {{
    const report = await getAnalysisReport(analysisId);
    const contributor = report.contributors.find((c) => c.id === contributorId);

    const res = await fetch("/api/viva/generate", {{
      method: "POST",
      headers: {{ "Content-Type": "application/json" }},
      body: JSON.stringify({{
        contributorName: contributor?.primary_name || "Contributor",
        repoName: report.repo_url.replace("https://github.com/", ""),
        auditedFiles: (report as any).audited_files || [],
        contributorId,
      }}),
    }});

    if (res.ok) {{
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {{
        return data;
      }}
    }}
  }} catch (err) {{
    console.warn("Server viva generation fallback:", err);
  }}'''.replace('\n', newline)

new_viva_q = f'''  // 1. Try Render FastAPI backend if active
  if (!analysisId.startsWith("demo-") && !analysisId.startsWith("gh-") && !analysisId.startsWith("gh__")) {{
    try {{
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const renderRes = await fetch(`${{API_BASE_URL}}/api/v1/viva/${{analysisId}}/${{contributorId}}/questions`, {{
        signal: controller.signal,
      }});
      clearTimeout(timeoutId);
      if (renderRes.ok) {{
        const renderData = await renderRes.json();
        if (renderData && renderData.questions && renderData.questions.length > 0) {{
          return renderData;
        }}
      }}
    }} catch {{
      // Render sleeping or endpoint unavailable — fall through to Next.js route
    }}
  }}

  // 2. Next.js server-side /api/viva/generate (Real Grounded Questions)
  try {{
    const report = await getAnalysisReport(analysisId);
    const contributor = report.contributors.find((c) => c.id === contributorId);

    const res = await fetch("/api/viva/generate", {{
      method: "POST",
      headers: {{ "Content-Type": "application/json" }},
      body: JSON.stringify({{
        contributorName: contributor?.primary_name || "Contributor",
        repoName: report.repo_url.replace("https://github.com/", ""),
        auditedFiles: (report as any).audited_files || [],
        contributorId,
      }}),
    }});

    if (res.ok) {{
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {{
        return data;
      }}
    }}
  }} catch (err) {{
    console.warn("Next.js viva generation fallback:", err);
  }}'''.replace('\n', newline)

if old_viva_q in text:
    text = text.replace(old_viva_q, new_viva_q, 1)
    print("getVivaQuestions updated")
else:
    print("getVivaQuestions pattern not matched")

# 4. Update evaluateVivaAnswer to try Render backend first, then Next.js route
old_viva_eval = f'''  // Try Next.js server-side /api/viva/evaluate
  try {{
    const res = await fetch("/api/viva/evaluate", {{
      method: "POST",
      headers: {{ "Content-Type": "application/json" }},
      body: JSON.stringify({{
        questionId,
        answer: studentAnswer,
        questionText,
        expectedKeyConcepts,
      }}),
    }});

    if (res.ok) {{
      return await res.json();
    }}
  }} catch {{
    // Fall through to client evaluation
  }}'''.replace('\n', newline)

new_viva_eval = f'''  // 1. Try Render FastAPI backend if active
  try {{
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const renderRes = await fetch(`${{API_BASE_URL}}/api/v1/viva/evaluate`, {{
      method: "POST",
      headers: {{ "Content-Type": "application/json" }},
      body: JSON.stringify({{
        question_id: questionId,
        answer: studentAnswer,
        question_text: questionText,
        expected_concepts: expectedKeyConcepts,
      }}),
      signal: controller.signal,
    }});
    clearTimeout(timeoutId);
    if (renderRes.ok) {{
      const evalData = await renderRes.json();
      return evalData;
    }}
  }} catch {{
    // Render sleeping — fall through to Next.js route
  }}

  // 2. Next.js server-side /api/viva/evaluate (Real Grounded Evaluation)
  try {{
    const res = await fetch("/api/viva/evaluate", {{
      method: "POST",
      headers: {{ "Content-Type": "application/json" }},
      body: JSON.stringify({{
        questionId,
        answer: studentAnswer,
        questionText,
        expectedKeyConcepts,
      }}),
    }});

    if (res.ok) {{
      return await res.json();
    }}
  }} catch {{
    // Fall through to deterministic client heuristic
  }}'''.replace('\n', newline)

if old_viva_eval in text:
    text = text.replace(old_viva_eval, new_viva_eval, 1)
    print("evaluateVivaAnswer updated")
else:
    print("evaluateVivaAnswer pattern not matched")

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print("api.ts updated successfully!")
