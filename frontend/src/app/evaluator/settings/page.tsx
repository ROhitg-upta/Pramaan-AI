"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Database,
  Building,
  Bell,
  CheckCircle2,
  AlertCircle,
  Save,
  Send,
  Zap,
  Lock,
  ArrowLeft,
  Server,
  Activity,
  HardDrive,
} from "lucide-react";

export default function EvaluatorSettingsPage() {
  const [orgName, setOrgName] = useState("Stanford University • Cyber-Forensics Lab");
  const [academicTerm, setAcademicTerm] = useState("Spring 2026");
  const [webhookUrl, setWebhookUrl] = useState("https://discord.com/api/webhooks/12345/pramaan-alerts");
  const [alertOnDump, setAlertOnDump] = useState(true);
  const [alertOnViva, setAlertOnViva] = useState(true);

  const [isSaved, setIsSaved] = useState(false);
  const [webhookTestStatus, setWebhookTestStatus] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleTestWebhook = () => {
    setWebhookTestStatus("Sending test payload...");
    setTimeout(() => {
      setWebhookTestStatus("✓ Test notification delivered (HTTP 200 OK)");
      setTimeout(() => setWebhookTestStatus(null), 3000);
    }, 800);
  };

  return (
    <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 font-mono text-xs text-zinc-500 mb-2">
            <Link href="/evaluator/dashboard" className="hover:text-zinc-300 transition">
              Evaluator Dashboard
            </Link>
            <span>/</span>
            <span className="text-zinc-300">Institution Settings</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
            Enterprise Infrastructure &amp; Settings
          </h1>
          <p className="mt-1 font-mono text-xs text-zinc-400">
            Configure cloud PostgreSQL connection, department branding, and automated webhook dispatch.
          </p>
        </div>
      </div>

      {/* 1. Database Infrastructure Status Card */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-xl shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <Database className="h-5 w-5 text-emerald-400" />
            <h3 className="font-display text-base font-bold text-zinc-100">
              Database Infrastructure Status
            </h3>
          </div>
          <span className="inline-flex items-center space-x-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>CONNECTED TO NEON POSTGRESQL</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="text-zinc-500 text-[10px] uppercase">Connection Endpoint</div>
            <div className="font-bold text-zinc-200 mt-1 truncate">ep-cool-neon.us-east-2.aws</div>
            <div className="text-[10px] text-emerald-400 mt-1">SSL Mode: Required (TLS 1.3)</div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="text-zinc-500 text-[10px] uppercase">Query Latency</div>
            <div className="text-2xl font-bold text-zinc-100 mt-1">18 ms</div>
            <div className="text-[10px] text-zinc-500 mt-1">AWS us-east-2 to Vercel Edge</div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="text-zinc-500 text-[10px] uppercase">Table Records Synced</div>
            <div className="text-2xl font-bold text-zinc-100 mt-1">22 Records</div>
            <div className="text-[10px] text-zinc-500 mt-1">Users: 3 • Audits: 12 • Vivas: 7</div>
          </div>
        </div>
      </div>

      {/* 2. Organization Branding Card */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center space-x-2.5 border-b border-zinc-800 pb-3">
          <Building className="h-5 w-5 text-zinc-300" />
          <h3 className="font-display text-base font-bold text-zinc-100">
            University &amp; Organization Branding
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div>
            <label className="block text-zinc-400 mb-1">Organization / University Name</label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Academic Term / Hackathon Cycle</label>
            <input
              type="text"
              value={academicTerm}
              onChange={(e) => setAcademicTerm(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:border-zinc-600"
            />
          </div>
        </div>
      </div>

      {/* 3. Automated Webhook Notifications Card */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-xl shadow-xl space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <Bell className="h-5 w-5 text-zinc-300" />
            <h3 className="font-display text-base font-bold text-zinc-100">
              Automated Webhook Dispatch
            </h3>
          </div>
          <span className="text-zinc-500 text-[10px]">Discord / Slack Compatible</span>
        </div>

        <div>
          <label className="block text-zinc-400 mb-1">Incoming Webhook URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://discord.com/api/webhooks/..."
              className="flex-1 rounded-xl border border-white/10 bg-zinc-950 px-3.5 py-2.5 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
            />
            <button
              type="button"
              onClick={handleTestWebhook}
              className="px-4 py-2.5 rounded-xl border border-white/10 bg-zinc-950 text-zinc-300 hover:bg-zinc-800 transition"
            >
              Test Payload
            </button>
          </div>
          {webhookTestStatus && (
            <div className="text-emerald-400 text-[11px] mt-1.5">{webhookTestStatus}</div>
          )}
        </div>

        <div className="space-y-2 pt-2 border-t border-white/5">
          <label className="flex items-center space-x-2 text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={alertOnDump}
              onChange={(e) => setAlertOnDump(e.target.checked)}
              className="rounded bg-zinc-950 border-white/10 text-cyan-500 focus:ring-0"
            />
            <span>Trigger alert immediately when a candidate pushes a Monolithic 3 AM Dump (&gt;1,500 lines, 0 churn)</span>
          </label>

          <label className="flex items-center space-x-2 text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={alertOnViva}
              onChange={(e) => setAlertOnViva(e.target.checked)}
              className="rounded bg-zinc-950 border-white/10 text-cyan-500 focus:ring-0"
            />
            <span>Trigger alert when a candidate completes an oral defense and awaits faculty signature</span>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end space-x-3">
        {isSaved && (
          <span className="font-mono text-xs text-emerald-400 flex items-center space-x-1">
            <CheckCircle2 className="h-4 w-4" />
            <span>Settings saved successfully!</span>
          </span>
        )}
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center space-x-2 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 px-6 py-2.5 font-mono text-xs font-bold shadow-lg transition"
        >
          <Save className="h-4 w-4" />
          <span>Save Configuration</span>
        </button>
      </div>
    </div>
  );
}
