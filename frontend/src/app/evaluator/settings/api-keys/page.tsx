"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Key,
  Plus,
  Copy,
  Check,
  Trash2,
  Eye,
  EyeOff,
  Terminal,
  ShieldAlert,
  Activity,
  ArrowLeft,
  Server,
  Code2,
  ExternalLink,
} from "lucide-react";

interface ApiKeyItem {
  id: string;
  name: string;
  keyMasked: string;
  rawKey: string;
  createdAt: string;
  lastUsed: string;
  callsCount: number;
  monthlyLimit: number;
}

export default function ApiKeysSettingsPage() {
  const [keys, setKeys] = useState<ApiKeyItem[]>([
    {
      id: "key-1",
      name: "GitHub Actions CI/CD Forensics Bot",
      keyMasked: "prm_live_9f82••••••••••••e82a",
      rawKey: "prm_live_9f82b7c4a10d8e29bc41d2f7e82a",
      createdAt: "2026-09-10",
      lastUsed: "4 minutes ago",
      callsCount: 3420,
      monthlyLimit: 10000,
    },
    {
      id: "key-2",
      name: "Stanford Canvas LMS Webhook Dispatcher",
      keyMasked: "prm_live_4a11••••••••••••3c99",
      rawKey: "prm_live_4a11c88d29ef10bb992a77e13c99",
      createdAt: "2026-09-02",
      lastUsed: "2 hours ago",
      callsCount: 840,
      monthlyLimit: 10000,
    },
  ]);

  const [newKeyName, setNewKeyName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [visibleKeyId, setVisibleKeyId] = useState<string | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [selectedSnippetTab, setSelectedSnippetTab] = useState<"curl" | "github" | "python">("github");

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const randomHex = Array.from({ length: 24 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    const generatedRaw = `prm_live_${randomHex}`;
    const generatedMasked = `prm_live_${randomHex.slice(0, 4)}••••••••••••${randomHex.slice(-4)}`;

    const newKey: ApiKeyItem = {
      id: `key-${Date.now()}`,
      name: newKeyName.trim(),
      keyMasked: generatedMasked,
      rawKey: generatedRaw,
      createdAt: new Date().toISOString().split("T")[0],
      lastUsed: "Never",
      callsCount: 0,
      monthlyLimit: 10000,
    };

    setKeys([newKey, ...keys]);
    setNewKeyName("");
    setIsCreating(false);
    setVisibleKeyId(newKey.id);
  };

  const handleRevokeKey = (id: string) => {
    if (confirm("Are you sure you want to permanently revoke this API key? Active CI/CD actions using this key will immediately fail.")) {
      setKeys(keys.filter((k) => k.id !== id));
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleCopySnippet = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(type);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const totalCalls = keys.reduce((acc, k) => acc + k.callsCount, 0);
  const totalLimit = keys.reduce((acc, k) => acc + k.monthlyLimit, 0);
  const quotaPercent = Math.round((totalCalls / totalLimit) * 100);

  const snippetCode = {
    github: `# Add this step to your .github/workflows/pramaan-verify.yml
- name: ⚖️ Pramaan Proof-of-Work PR Audit
  uses: Pramaan-AI/action@v1
  with:
    api-token: \${{ secrets.PRAMAAN_API_KEY }}
    github-token: \${{ secrets.GITHUB_TOKEN }}
    block-on-cheat: true`,
    curl: `curl -X POST https://api.pramaan.ai/api/v1/analyze/pr \\
  -H "Authorization: Bearer prm_live_xxxx" \\
  -H "Content-Type: application/json" \\
  -d '{"repo": "org/repo", "pr_number": 42}'`,
    python: `import httpx

headers = {"Authorization": "Bearer prm_live_xxxx"}
response = httpx.post(
    "https://api.pramaan.ai/api/v1/analyze/pr",
    headers=headers,
    json={"repo": "stanford-cs101/final-capstone", "pr_number": 12}
)
audit = response.json()
print("POW Composite Score:", audit["composite_score"])`,
  };

  return (
    <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 text-zinc-100">
      {/* Header & Sub-nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 font-mono text-xs text-zinc-500 mb-2">
            <Link href="/evaluator/dashboard" className="hover:text-zinc-300 transition">
              Evaluator Dashboard
            </Link>
            <span>/</span>
            <Link href="/evaluator/settings" className="hover:text-zinc-300 transition">
              Settings
            </Link>
            <span>/</span>
            <span className="text-zinc-300">API Keys &amp; Quotas</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
            API Keys &amp; Organization Telemetry
          </h1>
          <p className="mt-1 font-mono text-xs text-zinc-400">
            Generate programmatic keys for the Pramaan CI/CD GitHub Action, LMS integrations, and automated pipelines.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreating(!isCreating)}
          className="inline-flex items-center space-x-2 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 px-4 py-2 font-mono text-xs font-bold transition shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Generate New Secret Key</span>
        </button>
      </div>

      {/* Quota Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="uppercase text-[10px] tracking-wider">Monthly API Quota</span>
            <Activity className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-100 mt-2">
            {totalCalls.toLocaleString()} / {totalLimit.toLocaleString()}
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all"
              style={{ width: `${quotaPercent}%` }}
            />
          </div>
          <div className="text-[10px] text-zinc-500 mt-1.5">{quotaPercent}% quota utilized this cycle</div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="uppercase text-[10px] tracking-wider">Active Secret Keys</span>
            <Key className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-100 mt-2">
            {keys.length} Keys Live
          </div>
          <div className="text-[10px] text-zinc-400 mt-3 flex items-center space-x-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>All keys operational (SHA-256 sealed)</span>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="uppercase text-[10px] tracking-wider">Rate Limit Ceiling</span>
            <Server className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-100 mt-2">
            1,000 req / min
          </div>
          <div className="text-[10px] text-zinc-500 mt-3">Enterprise Dedicated Cluster</div>
        </div>
      </div>

      {/* Creation Modal / Inline Drawer */}
      {isCreating && (
        <form
          onSubmit={handleCreateKey}
          className="rounded-2xl border border-emerald-500/40 bg-zinc-900/80 p-6 backdrop-blur-md space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-bold text-zinc-100 flex items-center space-x-2">
              <Key className="h-4 w-4 text-emerald-400" />
              <span>Create New Programmatic API Key</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-zinc-500 hover:text-zinc-300 font-mono text-xs"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="block font-mono text-xs text-zinc-400 mb-1">
              Token Name / Purpose Description
            </label>
            <input
              type="text"
              required
              placeholder="e.g. CS401 Senior Project CI Bot, Canvas LMS Sync"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 font-mono text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200 font-mono text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-500 text-zinc-950 hover:bg-emerald-400 font-mono text-xs font-bold transition"
            >
              Confirm &amp; Generate Token
            </button>
          </div>
        </form>
      )}

      {/* API Keys Table */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-md overflow-hidden">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="font-display text-sm font-bold text-zinc-100 flex items-center space-x-2">
            <Key className="h-4 w-4 text-emerald-400" />
            <span>Active API Keys</span>
          </h3>
          <span className="font-mono text-[10px] text-zinc-500">
            Never expose secret tokens in public client-side code
          </span>
        </div>

        <div className="divide-y divide-zinc-800 font-mono text-xs">
          {keys.map((key) => {
            const isRevealed = visibleKeyId === key.id;
            const displayedToken = isRevealed ? key.rawKey : key.keyMasked;

            return (
              <div
                key={key.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-900/60 transition"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-zinc-200">{key.name}</span>
                    <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.2 text-[9px] text-emerald-400">
                      LIVE
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-zinc-400">
                    <code className="bg-zinc-950 border border-zinc-800 px-2 py-1 rounded text-zinc-300 text-[11px] selection:bg-emerald-500/30">
                      {displayedToken}
                    </code>

                    <button
                      type="button"
                      onClick={() => setVisibleKeyId(isRevealed ? null : key.id)}
                      className="p-1 rounded text-zinc-500 hover:text-zinc-300 transition"
                      title={isRevealed ? "Mask Token" : "Reveal Token"}
                    >
                      {isRevealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopy(key.rawKey, key.id)}
                      className="p-1 rounded text-zinc-500 hover:text-emerald-400 transition"
                      title="Copy Key to Clipboard"
                    >
                      {copiedKeyId === key.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="text-[10px] text-zinc-500 flex items-center space-x-3 pt-0.5">
                    <span>Created: {key.createdAt}</span>
                    <span>•</span>
                    <span>Last used: {key.lastUsed}</span>
                    <span>•</span>
                    <span>{key.callsCount.toLocaleString()} calls this month</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleRevokeKey(key.id)}
                    className="inline-flex items-center space-x-1.5 rounded-xl border border-rose-500/20 bg-rose-950/20 px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-950/40 hover:border-rose-500/40 transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Revoke</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Integration Code Snippet Assistant */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
          <div className="flex items-center space-x-2">
            <Code2 className="h-4 w-4 text-emerald-400" />
            <h3 className="font-display text-sm font-bold text-zinc-100">
              Quick Integration Code Snippets
            </h3>
          </div>

          <div className="flex items-center space-x-1 font-mono text-xs">
            {(["github", "curl", "python"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedSnippetTab(tab)}
                className={`px-3 py-1 rounded-lg transition uppercase text-[10px] font-bold ${
                  selectedSnippetTab === tab
                    ? "bg-zinc-800 text-zinc-100 border border-zinc-700"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab === "github" ? "GitHub Action" : tab}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <pre className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed">
            {snippetCode[selectedSnippetTab]}
          </pre>

          <button
            type="button"
            onClick={() => handleCopySnippet(snippetCode[selectedSnippetTab], selectedSnippetTab)}
            className="absolute top-3 right-3 inline-flex items-center space-x-1 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-[11px] font-mono text-zinc-300 hover:bg-zinc-800 transition"
          >
            {copiedSnippet === selectedSnippetTab ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Security Notice */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4 font-mono text-xs text-zinc-500 flex items-start space-x-3">
        <ShieldAlert className="h-4 w-4 text-zinc-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-zinc-300">Security Recommendation:</strong> Store your API keys in GitHub Secrets (e.g. <code>PRAMAAN_API_KEY</code>) or campus environment vaults. Do not commit tokens directly into repository code. If a token is compromised, click <strong>Revoke</strong> immediately to invalidate all authorization scopes.
        </div>
      </div>
    </div>
  );
}
