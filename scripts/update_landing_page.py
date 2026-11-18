import os

path = os.path.join('frontend', 'src', 'app', 'page.tsx')
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# Normalize CRLF/LF for matching
crlf = '\r\n' in text
newline = '\r\n' if crlf else '\n'

# 1. Update imports
old_imp = f"  Code2,{newline}  CheckCircle2,{newline}  Sparkles,{newline}}} from \"lucide-react\";"
new_imp = f"  Code2,{newline}  CheckCircle2,{newline}  Sparkles,{newline}  Key,{newline}  AlertCircle,{newline}}} from \"lucide-react\";"

if old_imp in text:
    text = text.replace(old_imp, new_imp, 1)
    print("Imports updated")
else:
    print("Imports pattern not matched")

# 2. Update state and handleAudit
old_state = f'''  const [showInputModal, setShowInputModal] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  // Close modal on Escape
  useEffect(() => {{
    const handleKeyDown = (e: KeyboardEvent) => {{
      if (e.key === "Escape") {{
        setShowInputModal(false);
      }}
    }};
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }}, []);

  const handleAudit = async (targetUrl = repoUrl) => {{
    const urlToAnalyze = targetUrl.trim() || "https://github.com/demo/smart-campus-app";
    if (typeof window !== "undefined") {{
      sessionStorage.setItem("pramaan_target_url", urlToAnalyze);
    }}
    setIsAuditing(true);
    try {{
      const res = await analyzeRepo(urlToAnalyze, selectedBranch);
      const analysisId = res?.analysis_id || "demo-smart-campus";
      router.push(`/investigate/${{analysisId}}`);
    }} catch (err) {{
      console.warn("Analysis trigger failed, routing to demo:", err);
      router.push("/investigate/demo-smart-campus");
    }} finally {{
      setIsAuditing(false);
    }}
  }};'''.replace('\n', newline)

new_state = f'''  const [showInputModal, setShowInputModal] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [patToken, setPatToken] = useState("");
  const [showPatInput, setShowPatInput] = useState(false);

  // Load saved PAT if available
  useEffect(() => {{
    if (typeof window !== "undefined") {{
      const savedToken = localStorage.getItem("pramaan_gh_token");
      if (savedToken) setPatToken(savedToken);
    }}
  }}, []);

  // Close modal on Escape
  useEffect(() => {{
    const handleKeyDown = (e: KeyboardEvent) => {{
      if (e.key === "Escape") {{
        setShowInputModal(false);
        setAuditError(null);
      }}
    }};
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }}, []);

  const handleAudit = async (targetUrl = repoUrl) => {{
    setAuditError(null);
    const cleaned = targetUrl.trim();

    if (!cleaned) {{
      setAuditError("Please enter a valid GitHub repository URL (e.g. https://github.com/owner/repo) or pick a sample repository.");
      return;
    }}

    if (typeof window !== "undefined" && patToken.trim()) {{
      localStorage.setItem("pramaan_gh_token", patToken.trim());
    }}

    // Direct check for demo fixtures
    if (cleaned === "demo" || cleaned.includes("demo-smart-campus") || cleaned.includes("demo/smart-campus-app")) {{
      if (typeof window !== "undefined") {{
        sessionStorage.setItem("pramaan_target_url", "https://github.com/demo/smart-campus-app");
      }}
      setShowInputModal(false);
      router.push("/investigate/demo-smart-campus");
      return;
    }}

    if (typeof window !== "undefined") {{
      sessionStorage.setItem("pramaan_target_url", cleaned);
    }}

    setIsAuditing(true);
    try {{
      const res = await analyzeRepo(cleaned, selectedBranch);
      setShowInputModal(false);
      const analysisId = res?.analysis_id || "demo-smart-campus";
      router.push(`/investigate/${{analysisId}}`);
    }} catch (err: any) {{
      console.error("Analysis trigger error:", err);
      setAuditError(err?.message || "Failed to initiate repository audit. Please verify the URL or provide a GitHub Personal Access Token.");
    }} finally {{
      setIsAuditing(false);
    }}
  }};'''.replace('\n', newline)

if old_state in text:
    text = text.replace(old_state, new_state, 1)
    print("State updated")
else:
    print("State pattern not matched")

# 3. Update Modal JSX with Error Alert & PAT Input & Real Repos
old_form = f'''              {{/* Form Input */}}
              <form
                onSubmit={{(e) => {{
                  e.preventDefault();
                  handleAudit();
                }}}}
                className="mt-5 space-y-4"
              >
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    Repository URL
                  </label>
                  <div className="relative flex items-center">
                    <GitBranch className="absolute left-3.5 h-4 w-4 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="https://github.com/organization/repository"
                      value={{repoUrl}}
                      onChange={{(e) => setRepoUrl(e.target.value)}}
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/80 py-2.5 pl-10 pr-4 font-mono text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {{/* Quick Test Repositories (1-Click) */}}
                <div className="space-y-2 pt-1 border-t border-white/5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="flex items-center space-x-1 text-emerald-400 font-semibold">
                      <Sparkles className="h-3 w-3" />
                      <span>Quick Test Repositories (1-Click)</span>
                    </span>
                    <span className="text-[10px] text-zinc-500">Auto-fills &amp; starts</span>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5 font-mono text-xs">
                    <button
                      type="button"
                      onClick={{() => {{
                        const url = "https://github.com/ROhitg-upta/abtalks-redesign";
                        setRepoUrl(url);
                        setShowInputModal(false);
                        handleAudit(url);
                      }}}}
                      className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 rounded-xl border border-white/10 bg-zinc-900/90 px-3 py-2 text-left hover:border-emerald-500/40 hover:bg-zinc-800 transition group"
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <span className="text-emerald-400">✨</span>
                        <span className="font-semibold text-zinc-200 group-hover:text-emerald-300">
                          ABTalks Redesign
                        </span>
                        <span className="text-[10px] text-zinc-500 truncate">ROhitg-upta/abtalks-redesign</span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-400 shrink-0">Fast UI Test ➔</span>
                    </button>

                    <button
                      type="button"
                      onClick={{() => {{
                        const url = "https://github.com/demo/smart-campus-app";
                        setRepoUrl(url);
                        setShowInputModal(false);
                        handleAudit(url);
                      }}}}
                      className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 rounded-xl border border-white/10 bg-zinc-900/90 px-3 py-2 text-left hover:border-cyan-500/40 hover:bg-zinc-800 transition group"
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <span className="text-cyan-400">🏫</span>
                        <span className="font-semibold text-zinc-200 group-hover:text-cyan-300">
                          Smart Campus App
                        </span>
                        <span className="text-[10px] text-zinc-500 truncate">3 Authors • Capstone</span>
                      </div>
                      <span className="text-[10px] font-semibold text-cyan-400 shrink-0">Multi-Author ➔</span>
                    </button>

                    <button
                      type="button"
                      onClick={{() => {{
                        const url = "https://github.com/demo/monolithic-ai-dump";
                        setRepoUrl(url);
                        setShowInputModal(false);
                        handleAudit(url);
                      }}}}
                      className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 rounded-xl border border-rose-500/30 bg-rose-950/20 px-3 py-2 text-left hover:border-rose-500/60 hover:bg-rose-950/40 transition group"
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <span className="text-rose-400">🚨</span>
                        <span className="font-semibold text-rose-300 group-hover:text-rose-200">
                          Monolithic AI Dump
                        </span>
                        <span className="text-[10px] text-rose-400/70 truncate">4,800 lines • 3:42 AM</span>
                      </div>
                      <span className="text-[10px] font-semibold text-rose-400 shrink-0">Fraud Trigger ➔</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={{() => {{
                      setShowInputModal(false);
                      handleExploreDemo();
                    }}}}
                    className="font-mono text-xs text-zinc-400 hover:text-white flex items-center space-x-1"
                  >
                    <Zap className="h-3 w-3 text-emerald-400" />
                    <span>Or load interactive demo project</span>
                  </button>

                  <button
                    type="submit"
                    disabled={{isAuditing}}
                    className="inline-flex items-center space-x-2 rounded-xl bg-white px-5 py-2.5 font-mono text-xs font-semibold text-black hover:bg-zinc-200 transition disabled:opacity-50"
                  >
                    <span>{{isAuditing ? "Auditing..." : "Start Forensics"}}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>'''.replace('\n', newline)

new_form = f'''              {{/* Error Banner */}}
              {{auditError && (
                <div className="mt-4 p-3 rounded-xl border border-rose-500/30 bg-rose-950/40 text-rose-300 text-xs flex items-start space-x-2 font-mono">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-rose-200">Audit Request Notice:</span>
                    <span>{{auditError}}</span>
                  </div>
                </div>
              )}}

              {{/* Form Input */}}
              <form
                onSubmit={{(e) => {{
                  e.preventDefault();
                  handleAudit();
                }}}}
                className="mt-5 space-y-4"
              >
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    Repository URL
                  </label>
                  <div className="relative flex items-center">
                    <GitBranch className="absolute left-3.5 h-4 w-4 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="https://github.com/organization/repository"
                      value={{repoUrl}}
                      onChange={{(e) => {{
                        setRepoUrl(e.target.value);
                        if (auditError) setAuditError(null);
                      }}}}
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/80 py-2.5 pl-10 pr-4 font-mono text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {{/* Optional PAT Input Toggle */}}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={{() => setShowPatInput(!showPatInput)}}
                    className="flex items-center space-x-1.5 text-[11px] font-mono text-zinc-400 hover:text-zinc-200 transition"
                  >
                    <Key className="h-3 w-3 text-amber-400" />
                    <span>{{showPatInput ? "Hide GitHub Token" : "Optional: Add GitHub Token (5,000 req/hr & Private Repos)"}}</span>
                  </button>
                  {{showPatInput && (
                    <div className="mt-2 space-y-1">
                      <input
                        type="password"
                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxx (Stored locally in browser)"
                        value={{patToken}}
                        onChange={{(e) => setPatToken(e.target.value)}}
                        className="w-full rounded-xl border border-amber-500/20 bg-zinc-900/90 py-2 px-3 font-mono text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      <p className="text-[10px] font-mono text-zinc-500">
                        Token is saved only in browser localStorage and passed to GitHub API.
                      </p>
                    </div>
                  )}}
                </div>

                {{/* Quick Test Repositories */}}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="flex items-center space-x-1 text-emerald-400 font-semibold">
                      <Sparkles className="h-3 w-3" />
                      <span>One-Click Test Repositories</span>
                    </span>
                    <span className="text-[10px] text-zinc-500">Instant Forensic Load</span>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5 font-mono text-xs">
                    <button
                      type="button"
                      onClick={{() => {{
                        const url = "https://github.com/ROhitg-upta/Pramaan-AI";
                        setRepoUrl(url);
                        handleAudit(url);
                      }}}}
                      className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/20 px-3 py-2 text-left hover:border-emerald-500/60 hover:bg-emerald-950/40 transition group"
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <span className="text-emerald-400">✨</span>
                        <span className="font-semibold text-emerald-200 group-hover:text-emerald-100">
                          ROhitg-upta/Pramaan-AI
                        </span>
                        <span className="text-[10px] text-emerald-400/80 truncate">Real Repository • Live Analysis</span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-400 shrink-0">Live Audit ➔</span>
                    </button>

                    <button
                      type="button"
                      onClick={{() => {{
                        const url = "https://github.com/demo/smart-campus-app";
                        setRepoUrl(url);
                        handleAudit(url);
                      }}}}
                      className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 rounded-xl border border-white/10 bg-zinc-900/90 px-3 py-2 text-left hover:border-cyan-500/40 hover:bg-zinc-800 transition group"
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <span className="text-cyan-400">🏫</span>
                        <span className="font-semibold text-zinc-200 group-hover:text-cyan-300">
                          Smart Campus App
                        </span>
                        <span className="text-[10px] text-zinc-500 truncate">3 Authors • Simulated Fixture</span>
                      </div>
                      <span className="text-[10px] font-semibold text-cyan-400 shrink-0">Demo Capstone ➔</span>
                    </button>

                    <button
                      type="button"
                      onClick={{() => {{
                        const url = "https://github.com/demo/monolithic-ai-dump";
                        setRepoUrl(url);
                        handleAudit(url);
                      }}}}
                      className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 rounded-xl border border-rose-500/30 bg-rose-950/20 px-3 py-2 text-left hover:border-rose-500/60 hover:bg-rose-950/40 transition group"
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <span className="text-rose-400">🚨</span>
                        <span className="font-semibold text-rose-300 group-hover:text-rose-200">
                          Monolithic AI Dump
                        </span>
                        <span className="text-[10px] text-rose-400/70 truncate">Simulated Big-Bang Fraud Fixture</span>
                      </div>
                      <span className="text-[10px] font-semibold text-rose-400 shrink-0">Anomaly Demo ➔</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={{() => {{
                      setShowInputModal(false);
                      handleExploreDemo();
                    }}}}
                    className="font-mono text-xs text-zinc-400 hover:text-white flex items-center space-x-1"
                  >
                    <Zap className="h-3 w-3 text-emerald-400" />
                    <span>Or load interactive demo project</span>
                  </button>

                  <button
                    type="submit"
                    disabled={{isAuditing}}
                    className="inline-flex items-center space-x-2 rounded-xl bg-white px-5 py-2.5 font-mono text-xs font-semibold text-black hover:bg-zinc-200 transition disabled:opacity-50"
                  >
                    <span>{{isAuditing ? "Auditing..." : "Start Forensics"}}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>'''.replace('\n', newline)

if old_form in text:
    text = text.replace(old_form, new_form, 1)
    print("Form updated")
else:
    print("Form pattern not matched")

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Landing page successfully updated!")
