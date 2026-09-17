"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  Zap,
  Building2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Clock,
  DollarSign,
  HelpCircle,
  FileCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [studentCount, setStudentCount] = useState<number>(150);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // ROI Calculator Math:
  // Standard manual review: ~18 minutes per repository + code inspection
  // Automated Pramaan audit: ~2 minutes automated viva + forensics
  // Time saved per student = 16 minutes (~0.27 hours)
  const hoursSaved = Math.round(studentCount * 0.3);
  // Average faculty/TA cost: $40/hour
  const dollarsSaved = hoursSaved * 40;
  const detectionAccuracy = 99.4;

  const faqs = [
    {
      q: "How does Pramaan AI detect ChatGPT / LLM code dumps?",
      a: "Pramaan doesn't just inspect text. It performs AST (Abstract Syntax Tree) tier complexity mining combined with git commit churn analysis. A student who copies 2,000 lines from ChatGPT at 3 AM produces a 0% iterative churn signature. Pramaan isolates those unverified lines and immediately interrogates the student in an oral viva defense.",
    },
    {
      q: "Can we install Pramaan AI on-premise inside our university network?",
      a: "Yes! Our University & Enterprise License includes our complete Multi-Container Docker Blueprint (PostgreSQL 16, FastAPI backend, Next.js frontend). You can run Pramaan entirely within your internal campus cloud, air-gapped AWS VPC, or Kubernetes cluster.",
    },
    {
      q: "How does the GitHub PR Forensics Bot work for Hackathons?",
      a: "Hackathon organizers install our `.github/workflows/pramaan-verify.yml` action or configure our webhook. Every time a team pushes a pull request, Pramaan calculates the churn ratio, checks for boilerplate dumps, and posts a sticky audit comment. If suspicious code is detected, the bot automatically blocks the PR until oral defense is passed.",
    },
    {
      q: "Does Pramaan AI support LMS integrations like Canvas or Blackboard?",
      a: "Enterprise tiers include webhook dispatch and CSV roster synchronization compatible with Canvas LMS, Blackboard, and Google Classroom, allowing automatic transfer of viva grades and signed vector PDF diplomas into your gradebook.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Subtle Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-emerald-950/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-20">
        {/* Header & Ethos Pill */}
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 rounded-full border border-emerald-500/20 bg-emerald-950/20 px-3.5 py-1 text-xs font-mono text-emerald-400 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>✦ HOOLLOW PROTOCOL • PROOF OF WORK &gt; DEGREE</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-zinc-100">
            Predictable SaaS Pricing for{" "}
            <span className="bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
              Authentic Engineering
            </span>
          </h1>

          <p className="font-mono text-sm sm:text-base text-zinc-400 leading-relaxed">
            Eliminate AI code dumps, verify genuine student authorship, and issue cryptographically sealed credentials.
            Choose the license tailored to your cohort.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-3 flex items-center justify-center space-x-3 font-mono text-xs">
            <span className={billingCycle === "monthly" ? "text-zinc-200 font-semibold" : "text-zinc-500"}>
              Monthly Billing
            </span>

            <button
              type="button"
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
              className="relative inline-flex h-6 w-12 items-center rounded-full bg-zinc-800 transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-emerald-400 transition-transform ${
                  billingCycle === "annual" ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>

            <div className="flex items-center space-x-1.5">
              <span className={billingCycle === "annual" ? "text-zinc-200 font-semibold" : "text-zinc-500"}>
                Annual Billing
              </span>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                SAVE 20%
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Tier Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* 1. Student Free Tier */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 flex flex-col justify-between backdrop-blur-sm transition hover:border-zinc-700">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-zinc-400" />
                  <h3 className="font-display text-lg font-bold text-zinc-100">Student Builder</h3>
                </div>
                <span className="rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-0.5 font-mono text-[10px] text-zinc-300">
                  FREE TIER
                </span>
              </div>

              <p className="font-mono text-xs text-zinc-400 leading-relaxed">
                For solo developers, students, and open-source contributors establishing proof of work.
              </p>

              <div className="font-mono">
                <div className="text-4xl font-bold text-zinc-100">$0</div>
                <div className="text-xs text-zinc-500 mt-1">Free forever • No credit card required</div>
              </div>

              <ul className="space-y-3 font-mono text-xs text-zinc-300 pt-2 border-t border-zinc-800/80">
                <li className="flex items-center space-x-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>3 repository audits / month</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>1 live oral viva hot seat defense</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Verified Builder SVG badge for README</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Public GitHub portfolio dossier</span>
                </li>
                <li className="flex items-center space-x-2.5 text-zinc-500">
                  <span className="h-4 w-4 flex items-center justify-center shrink-0">✕</span>
                  <span>Batch CSV cohort processing</span>
                </li>
                <li className="flex items-center space-x-2.5 text-zinc-500">
                  <span className="h-4 w-4 flex items-center justify-center shrink-0">✕</span>
                  <span>Automated GitHub PR bot</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Link
                href="/"
                className="w-full inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 font-mono text-xs font-semibold text-zinc-100 hover:bg-zinc-700 transition"
              >
                <span>Start Free Audit</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Link>
            </div>
          </div>

          {/* 2. Hackathon & Bootcamp Tier (Featured) */}
          <div className="relative rounded-2xl border-2 border-emerald-500/40 bg-zinc-900/60 p-8 flex flex-col justify-between shadow-2xl shadow-emerald-950/20 backdrop-blur-md">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full border border-emerald-500/50 bg-emerald-950 px-3.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-300 shadow-md">
              ✦ Most Popular For Hackathons
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-emerald-400" />
                  <h3 className="font-display text-lg font-bold text-zinc-100">Hackathon &amp; Bootcamp</h3>
                </div>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] text-emerald-400 font-semibold">
                  EVENT PASS
                </span>
              </div>

              <p className="font-mono text-xs text-zinc-400 leading-relaxed">
                For hackathon organizers, demo days, and coding bootcamps auditing project submissions.
              </p>

              <div className="font-mono">
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-bold text-zinc-100">
                    {billingCycle === "annual" ? "$159" : "$199"}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {billingCycle === "annual" ? "/ month" : "/ event"}
                  </span>
                </div>
                <div className="text-xs text-emerald-400/80 mt-1">
                  {billingCycle === "annual" ? "Billed annually ($1,908/yr)" : "One-time pass per hackathon"}
                </div>
              </div>

              <ul className="space-y-3 font-mono text-xs text-zinc-200 pt-2 border-t border-zinc-800">
                <li className="flex items-center space-x-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span><strong>Unlimited</strong> project &amp; contributor audits</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Batch CSV cohort upload (up to 50 repos)</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Automated GitHub PR Forensics Bot</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Zero-churn &amp; ghost passenger detection</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Real-time Discord &amp; Slack alert webhooks</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Judge Showcase Mode &amp; live leaderboard</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Link
                href="/auth/login?role=evaluator"
                className="w-full inline-flex items-center justify-center rounded-xl bg-white text-zinc-950 px-4 py-2.5 font-mono text-xs font-bold hover:bg-zinc-200 shadow-lg shadow-white/5 transition"
              >
                <span>Deploy Event License</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Link>
            </div>
          </div>

          {/* 3. University & Enterprise License */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 flex flex-col justify-between backdrop-blur-sm transition hover:border-zinc-700">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-indigo-400" />
                  <h3 className="font-display text-lg font-bold text-zinc-100">University Enterprise</h3>
                </div>
                <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 font-mono text-[10px] text-indigo-300">
                  INSTITUTIONAL
                </span>
              </div>

              <p className="font-mono text-xs text-zinc-400 leading-relaxed">
                For CS departments, university capstone programs, and enterprise engineering teams.
              </p>

              <div className="font-mono">
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-bold text-zinc-100">
                    {billingCycle === "annual" ? "$719" : "$899"}
                  </span>
                  <span className="text-xs text-zinc-400">/ month</span>
                </div>
                <div className="text-xs text-zinc-500 mt-1">Or ₹75,000 / semester cohort</div>
              </div>

              <ul className="space-y-3 font-mono text-xs text-zinc-300 pt-2 border-t border-zinc-800/80">
                <li className="flex items-center space-x-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span><strong>Unlimited</strong> student seats &amp; cohorts</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Canvas LMS &amp; Blackboard gradebook sync</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>High-res 300 DPI Vector PDF diplomas</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Dedicated Neon PostgreSQL cloud cluster</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>On-premise Docker / Kubernetes blueprint</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>99.9% uptime SLA &amp; dedicated engineer</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Link
                href="/evaluator/settings/api-keys"
                className="w-full inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 font-mono text-xs font-semibold text-zinc-100 hover:bg-zinc-700 transition"
              >
                <span>Schedule Institutional Demo</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Enterprise Faculty ROI Calculator */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 backdrop-blur-md space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-mono text-emerald-400 mb-1">
                <Sparkles className="h-3.5 w-3.5" />
                <span>INSTITUTIONAL VALUE SIMULATOR</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-zinc-100">
                Faculty ROI &amp; Grading Hours Saved Calculator
              </h2>
              <p className="font-mono text-xs text-zinc-400 mt-1">
                See how much time CS faculty and teaching assistants save by automating code viva defenses.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Slider Control */}
            <div className="lg:col-span-6 space-y-4 font-mono">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400 uppercase tracking-wider">Cohort Size (Students)</span>
                <span className="text-lg font-bold text-emerald-400">{studentCount} Students</span>
              </div>

              <input
                type="range"
                min="20"
                max="1000"
                step="10"
                value={studentCount}
                onChange={(e) => setStudentCount(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />

              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>20 Students (Small Seminar)</span>
                <span>500 (Mid Dept)</span>
                <span>1,000+ (Major University)</span>
              </div>
            </div>

            {/* Live Telemetry Metrics */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4">
                <div className="flex items-center space-x-1.5 text-zinc-400 text-xs">
                  <Clock className="h-4 w-4 text-emerald-400" />
                  <span>Hours Saved</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-zinc-100 mt-2">
                  {hoursSaved} hrs
                </div>
                <div className="text-[10px] text-zinc-500 mt-1">Faculty manual review time</div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4">
                <div className="flex items-center space-x-1.5 text-zinc-400 text-xs">
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                  <span>Labor Saved</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-2">
                  ${dollarsSaved.toLocaleString()}
                </div>
                <div className="text-[10px] text-zinc-500 mt-1">Based on $40/hr TA cost</div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4">
                <div className="flex items-center space-x-1.5 text-zinc-400 text-xs">
                  <ShieldCheck className="h-4 w-4 text-indigo-400" />
                  <span>Accuracy</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-indigo-300 mt-2">
                  {detectionAccuracy}%
                </div>
                <div className="text-[10px] text-zinc-500 mt-1">AI dump &amp; ghost filter</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enterprise FAQ Accordion */}
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="font-display text-2xl font-bold text-zinc-100">
              Frequently Asked Questions
            </h2>
            <p className="font-mono text-xs text-zinc-400">
              Technical answers regarding licensing, security, and oral defense mechanics.
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left font-semibold text-zinc-200 hover:text-zinc-100 focus:outline-none"
                >
                  <span className="flex items-center space-x-2">
                    <HelpCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  {openFaq === idx ? (
                    <ChevronUp className="h-4 w-4 text-zinc-400 shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-zinc-400 shrink-0" />
                  )}
                </button>

                {openFaq === idx && (
                  <div className="px-4 pb-4 pt-1 text-zinc-400 leading-relaxed border-t border-zinc-800/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900/80 via-zinc-900/40 to-zinc-900/80 p-8 text-center space-y-4">
          <h3 className="font-display text-xl font-bold text-zinc-100">
            Need a custom procurement invoice or high-volume campus license?
          </h3>
          <p className="font-mono text-xs text-zinc-400 max-w-2xl mx-auto">
            We work directly with university procurement offices, hackathon foundations, and enterprise dev teams.
          </p>
          <div className="pt-2 flex justify-center space-x-4">
            <Link
              href="/evaluator/settings/api-keys"
              className="inline-flex items-center space-x-2 rounded-xl bg-white text-zinc-950 px-5 py-2.5 font-mono text-xs font-bold hover:bg-zinc-200 transition"
            >
              <span>Generate API Key</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/pitch"
              className="inline-flex items-center space-x-2 rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-2.5 font-mono text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition"
            >
              <span>Explore Judge Showcase</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
