# 🧠 Pramaan AI — Master Agent Context & Execution Blueprint

> **Notice for any AI Model / LLM:**  
> This file is the single source of truth for **Pramaan AI (प्रमाण AI)**. When starting any new conversation, session, or subagent, load this file. It contains the complete architectural DNA, domain logic, tech stack, and execution rules so you can build, extend, or debug any part of the project with **ZERO hallucinations** and **ZERO need for user re-explanation**.

---

## 1. Project Identity & Vision

* **Project Name:** Pramaan AI (प्रमाण AI)
* **Tagline:** *Har Code Ka Pramaan. Autonomous Code Forensics & Viva Defense Engine.*
* **Target Event:** Horizon Hackathon (Key Partner: **Hoollow** — Ethos: *"Proof of Work > Degree"*, *"Truth in Building"*).
* **Core Value Proposition:** Exposes freeloaders, copy-paste scrapers, and AI code dumpers in student group projects by mathematically attributing code complexity, reconstructing git crime timelines, and subjecting each contributor to an autonomous, line-specific AI viva defense.

---

## 2. Directory Structure & Documentation Map

Every component of Pramaan AI has its dedicated, immutable specification file:

```
Pramaan AI/
├── MASTER_CONTEXT.md        # [THIS FILE] Global context, system rules & agent prompt
├── WORKFLOW.md              # High-level pipeline, milestone roadmap & system flow
├── DESIGN_SPEC.md           # Cinematic 5-Act UI/UX design system, layouts & animations
├── FRONTEND_PAGES_SPEC.md   # Page-by-page Next.js implementation (state, API, components)
├── BACKEND_SPEC.md          # Git mining algorithms, AST weights, API schemas & DB models
├── VIVA_ENGINE_SPEC.md      # Gemini prompts, defense rubrics, question generation & scoring
├── PROMPT_LIBRARY.md        # Every exact Gemini prompt template (copy-paste ready)
├── SAMPLE_API_DATA.md       # Mock API responses for parallel frontend dev (data contracts)
├── ENV_AND_SETUP.md         # Env variables, install steps, deployment (Vercel + Railway)
├── ERROR_HANDLING.md        # Every error state, degradation patterns, frontend error UI
├── DEMO_REPO_SPEC.md        # Controlled demo repo script, 3 archetypes, expected results
├── TESTING_SPEC.md          # Unit tests, integration tests, E2E, performance benchmarks
├── COMPETITIVE_ANALYSIS.md  # MOSS/Turnitin teardown, 3 unfair advantages, objection handlers
├── BUSINESS_AND_FUTURE.md   # TAM/SAM, 4-tier SaaS pricing, GTM strategy, feature roadmap
├── SECURITY_AND_PRIVACY.md  # Data policies, ethical AI framework, GDPR/DPDP compliance
├── JUDGE_SCORING_MAP.md     # Judging criteria → feature mapping, stage script, win tactics
├── PITCH_AND_SUBMISSION.md  # Horizon hackathon pitch, Unstop questions, live demo script
├── README.md                # Public GitHub presentation & quickstart
├── backend/                 # FastAPI, PyDriller, GitPython, Gemini Engine
└── frontend/                # Next.js 14, Tailwind CSS, Framer Motion, Recharts
```

---

## 3. Core Functional Pillars

### Pillar 1: Deep Git Forensics & Timeline Reconstruction
* **Commit Velocity & Burstiness:** Tracks commit frequency vs lines added. Flags "Big Bang" dumps (e.g. 5,000 lines in 1 commit at 3 AM with zero prior commits).
* **Code Churn Analysis:** Measures $\text{Added} : \text{Modified} : \text{Deleted}$ ratios. Real builders iteratively write, break, test, and delete code. Copy-pasters add monolithic blocks with 0 deletions.
* **Identity Resolution:** Deduplicates author emails and handles into singular contributor profiles using Levenshtein distance and git log author-committer matching.

### Pillar 2: AST & Semantic Code Weighting
Not all lines of code are equal. Lines are classified through AST parsing:
* **Tier 0 (0.0x - Ignored):** Generated code, package locks, auto-migrations, SVGs, minified bundles.
* **Tier 1 (0.2x - Boilerplate):** HTML boilerplate, standard Tailwind layouts, configs (`tsconfig.json`), simple getters/setters.
* **Tier 2 (1.0x - Application Logic):** Standard REST controllers, UI state bindings, form handling, CRUD functions.
* **Tier 3 (3.0x - Core Algorithmic):** Custom auth/crypto logic, state machines, algorithmic optimizers, concurrency primitives, complex database aggregations.

### Pillar 3: Autonomous Line-Targeted Viva Defense
* Extracts exact diffs for each contributor where Tier 2/Tier 3 logic was introduced.
* Gemini generates targeted, un-googleable questions: *"In commit `a8f12c`, you implemented `handleTokenRefresh`. If the refresh token rotates during an in-flight duplicate request, how does line 44 handle race conditions?"*
* Evaluates student's typed or spoken answer against code AST reality and assigns a Viva Authenticity Score (0–100).

### Pillar 4: The Verifiable Pramaan Proof-of-Work Receipt
* Generates a sleek, Hoollow-inspired thermal/glassmorphic cryptographic receipt and audit report.
* Computes composite score:
  $$\text{Pramaan Score} = 0.35 \times \text{Git Forensics} + 0.25 \times \text{AST Complexity} + 0.40 \times \text{Viva Defense}$$

---

## 4. Tech Stack Standards (Strict Enforcement)

* **Backend:** Python 3.11+, FastAPI, PyDriller, GitPython, SQLite / SQLAlchemy, Google GenAI SDK (Gemini 2.5/1.5 Flash).
* **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide React, Framer Motion, Recharts, Canvas Confetti.
* **Aesthetic Standard:** **Cinematic Forensic Investigation Experience.** NOT a dashboard — a 5-Act narrative story (Briefing → Investigation → Evidence Wall → Interrogation → Verdict). Dark obsidian base (`#050507` void, `#0A0D14` primary, `#0F1629` cards). Forensic neon accents: emerald `#10B981` for verified proof, amber `#F59E0B` for warnings, crimson `#EF4444` for fraud alerts, cyan `#06B6D4` for AI/scanning, purple `#8B5CF6` for AST complexity. Animated dot-grid background. Typewriter text streaming. Spring-physics card animations via Framer Motion. Thermal receipt with torn-edge clip-path for shareable proof output.

---

## 5. Agent Instructions for Any New Session

If you are an AI assistant opening this project in a new chat:
1. **Never ask the user what the project is.** Read this file, `DESIGN_SPEC.md`, `BACKEND_SPEC.md`, and `VIVA_ENGINE_SPEC.md`.
2. **Never hallucinate tech stack.** Stick exclusively to FastAPI (Python) + Next.js (TypeScript) + Gemini.
3. **Always preserve the Hoollow "Proof of Work" narrative.** Every feature, metric, and UI component should celebrate real builders and aggressively uncover academic fraud and freeloading.
4. **When asked to implement a feature:**
   - Refer to the respective spec file.
   - Implement production-grade code with error handling, type definitions, and zero mock placeholders.
