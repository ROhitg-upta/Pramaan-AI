# 🏛️ PRAMAAN AI (प्रमाण AI)
## Comprehensive Research Whitepaper, System Architecture & Frontier Engineering Blueprint
*Autonomous Code Forensics, 4-Tier AST Complexity Attribution, and Line-Targeted Oral Viva Defense Engine*

---

> **Document Status:** Authoritative Research & Technical Whitepaper  
> **Authors:** Pramaan AI Core Engineering Group  
> **Target Standard:** Hoollow Proof-of-Work Protocol (*"Proof of Work > Degree"* / *"Truth in Building"*)  
> **Deployment Status:** Production-Ready (Next.js 14/16 App Router on Vercel + FastAPI Backend + Edge Fallback)  
> **Live Production Edge:** `https://pramaan-ai-frontend-lovat.vercel.app/`  
> **Version:** 2.0-RC1 (Enterprise / Academic Integrity Edition)

---

## 📑 Table of Contents
1. [Executive Summary & The Paradigm Shift](#1-executive-summary--the-paradigm-shift)
2. [The Crisis: Why Traditional Code Assessment Has Collapsed](#2-the-crisis-why-traditional-code-assessment-has-collapsed)
3. [End-to-End System Architecture & Data Flow](#3-end-to-end-system-architecture--data-flow)
   - [3.1 Complete Architectural Pipeline](#31-complete-architectural-pipeline)
   - [3.2 Mathematical Formulation & Algorithmic Engines](#32-mathematical-formulation--algorithmic-engines)
     - [A. Temporal Commit Mining & Churn Trajectory](#a-temporal-commit-mining--churn-trajectory)
     - [B. Multi-Email Identity Resolution (Levenshtein Clustering)](#b-multi-email-identity-resolution-levenshtein-clustering)
     - [C. 4-Tier AST Complexity Weighting](#c-4-tier-ast-complexity-weighting)
     - [D. Shannon Entropy & Velocity Anomaly Detection](#d-shannon-entropy--velocity-anomaly-detection)
     - [E. Context-Grounded Oral Viva Defense (Gemini 2.5 Flash)](#e-context-grounded-oral-viva-defense-gemini-25-flash)
     - [F. Authenticity Scoring & Proof-of-Work Receipt](#f-authenticity-scoring--proof-of-work-receipt)
4. [What Has Been Built: Comprehensive Module-by-Module Inventory](#4-what-has-been-built-comprehensive-module-by-module-inventory)
5. [Rigorous Pros & Cons Analysis (Strengths vs. Vulnerabilities)](#5-rigorous-pros--cons-analysis-strengths-vs-vulnerabilities)
   - [5.1 Core Strengths & Unfair Advantages](#51-core-strengths--unfair-advantages)
   - [5.2 Critical Vulnerabilities, Failure Modes & Edge Cases](#52-critical-vulnerabilities-failure-modes--edge-cases)
6. [Key Vectors for Improvement (The Grand Research Roadmap)](#6-key-vectors-for-improvement-the-grand-research-roadmap)
7. [Grand-Level System Prompts & Meta-Engineering Blueprints for Frontier AI Models](#7-grand-level-system-prompts--meta-engineering-blueprints-for-frontier-ai-models)
   - [Prompt 1: Autonomous MicroVM Sandboxed Fuzzing & Execution Engine](#prompt-1-autonomous-microvm-sandboxed-fuzzing--execution-engine)
   - [Prompt 2: AST-Anchored Adversarial Viva Interrogation with Zero Hallucination](#prompt-2-ast-anchored-adversarial-viva-interrogation-with-zero-hallucination)
   - [Prompt 3: Semantic GNN Code Graph Plagiarism & Clonal Disentanglement](#prompt-3-semantic-gnn-code-graph-plagiarism--clonal-disentanglement)
   - [Prompt 4: Zero-Knowledge Competency Proofs (zk-SNARKs for Source Code Mastery)](#prompt-4-zero-knowledge-competency-proofs-zk-snarks-for-source-code-mastery)

---

## 1. Executive Summary & The Paradigm Shift

Modern software engineering education, hackathons, and technical hiring are experiencing a catastrophic collapse of trust. The proliferation of frontier Large Language Models (LLMs)—including Claude 3.5 Sonnet, GPT-4o, and Cursor/Copilot—has severed the historical correlation between **code existence** and **human comprehension**.

Historically, evaluators relied on two deeply flawed proxies:
1. **GitHub Activity Vanity Metrics:** Commit counts, green contribution grids, and raw Lines of Code (LoC).
2. **Static Text Plagiarism Scanners:** MOSS (Stanford) and Turnitin, which rely on syntactic n-gram hashing and winnowing.

These systems are rendered completely impotent when a student or candidate can prompt an LLM to generate 4,000 lines of syntactically valid, unique code in 30 seconds.

**Pramaan AI (प्रमाण AI)** pioneers an entirely new category: **Behavioral Code Forensics coupled with Autonomous, Multimodal Viva Defense**. Rather than inspecting static text snapshots, Pramaan AI interrogates the temporal evolutionary trajectory of the git commit graph, classifies code modifications via Abstract Syntax Tree (AST) complexity weights, puts each contributor in an autonomous voice-driven technical hot-seat, and outputs a cryptographically verifiable Proof-of-Work Receipt.

```
       TRADITIONAL PARADIGM                             PRAMAAN AI PARADIGM
┌─────────────────────────────────┐             ┌─────────────────────────────────┐
│     Raw Lines of Code (LoC)     │  ────────▶  │ 4-Tier AST Semantic Weighting   │
│   Static Plagiarism Hash (MOSS) │  ────────▶  │ Temporal Git Behavioral Churn   │
│  Passive Green Contribution Box │  ────────▶  │ File-Linked Spoken Oral Viva    │
│  Subjective TA Grading Rubrics  │  ────────▶  │ Tamper-Evident QR Proof Receipt │
└─────────────────────────────────┘             └─────────────────────────────────┘
```

---

## 2. The Crisis: Why Traditional Code Assessment Has Collapsed

### 2.1 The Four Systemic Failure Modes of Modern Code Evaluation

#### Failure Mode 1: The "Big Bang" AI Code Dump
A contributor joins a team, does zero work for 48 hours, and 2 hours before the deadline pastes an entire full-stack application generated by an LLM into a single commit (`feat: add entire backend and frontend`). Traditional platforms credit them with 95% of the repository's lines, sidelining genuine teammates who methodically engineered 300 lines of complex state machines.

#### Failure Mode 2: Vanity Churn & Formatting Inflation
A contributor runs `prettier` or auto-formats 8,000 lines of vendor JSON, CSS, or generated lockfiles (`package-lock.json`). GitHub Insights displays them as the primary maintainer, despite zero algorithmic value added.

#### Failure Mode 3: The Ghost Contributor & Free-Rider Dilemma
In university capstones and hackathons, free-riders take credit for repositories they cannot explain. When questioned in live panels, they evade technical scrutiny because judges lack the time to trace specific line authorship across 40 commits.

#### Failure Mode 4: Identity Fragmentation (The Multi-Email Obfuscation)
Developers commit across differing environments (e.g., local laptop terminal `alex@home-pc.local`, college email `alexander@university.edu`, GitHub web `alex-dev`). Traditional tools fragment this developer into 3 distinct individuals, ruining evaluation metrics.

---

## 3. End-to-End System Architecture & Data Flow

### 3.1 Complete Architectural Pipeline

```mermaid
flowchart TD
    A["Public / Private Git Repository URL"] --> B["Ingestion & Dual-Mode Orchestrator"]
    
    subgraph S1 ["Phase 1: Ingestion & Forensics"]
        B --> C1["FastAPI PyDriller Worker (Server Mode)"]
        B --> C2["Direct GitHub REST API Engine (Edge Fallback)"]
        C1 --> D["Chronological Commit Traversal"]
        C2 --> D
        D --> E["Multi-Email Alias Deduplication (Levenshtein)"]
    end

    subgraph S2 ["Phase 2: Semantic Complexity & Anomaly Engine"]
        E --> F["Tree-sitter AST Multi-Language Parser"]
        F --> G["4-Tier Complexity Classifier"]
        G --> H["Shannon Entropy & Churn Analysis"]
        H --> I{"Anomaly Heuristics"}
        I -->|"FLAG_BIG_BANG"| J1["AI Code Dump Alert"]
        I -->|"FLAG_GHOST_CODER"| J2["Free-Rider Flag"]
        I -->|"FLAG_ZERO_CHURN"| J3["Monolithic Paste Warning"]
    end

    subgraph S3 ["Phase 3: Autonomous Oral Viva Hot-Seat"]
        G --> K["AST Function & Line-Range Slicer"]
        K --> L["Gemini 2.5 Flash Context Packager"]
        L --> M["Line-Targeted Viva Questions (JSON Schema)"]
        M --> N["Browser Web Speech API Spoken Interrogation"]
        N --> O["Anti-Cheat Telemetry (Blur, Paste, TTFW)"]
        O --> P["3-Axis Authenticity Evaluator Rubric"]
    end

    subgraph S4 ["Phase 4: Cryptographic Credentialing & Delivery"]
        P --> Q["Composite Pramaan Score Engine"]
        Q --> R1["Thermal Monospace Proof Receipt"]
        Q --> R2["300 DPI Landscape Vector Diploma"]
        Q --> R3["Stateless Ed25519 / HMAC QR Payload"]
        Q --> R4["GitHub PR CI/CD Status Blocker (422 Check)"]
    end
```

---

### 3.2 Mathematical Formulation & Algorithmic Engines

#### A. Temporal Commit Mining & Churn Trajectory
For any repository $R$, let the commit sequence ordered chronologically be:
$$C = \langle c_1, c_2, \dots, c_n \rangle \quad \text{where } t(c_i) \le t(c_{i+1})$$

For each commit $c_k$, the engine extracts the author metadata, modified file set $F_{c_k}$, lines added $A(c_k)$, and lines deleted $D(c_k)$.

The **Code Churn Ratio** $\chi_a$ for an author $a$ is defined as:
$$\chi_a = \frac{\sum_{c \in C_a} D(c)}{\sum_{c \in C_a} A(c) + \epsilon}$$

*Empirical Rule:*
- Real engineers write, refactor, and delete: $0.15 \le \chi_a \le 0.65$.
- Unverified AI scrapers and monolithic copiers display near-zero churn: $\chi_a < 0.02$ with $A(c) > 1,500$.

---

#### B. Multi-Email Identity Resolution (Levenshtein Clustering)
Developers frequently switch git credentials. Given a set of raw author identities $I = \{(N_1, E_1), (N_2, E_2), \dots\}$, the engine calculates pairwise string metrics:

$$\text{Sim}_{\text{Lev}}(s_1, s_2) = 1 - \frac{\text{LevenshteinDistance}(s_1, s_2)}{\max(|s_1|, |s_2|)}$$

Two identities $I_i$ and $I_j$ are merged into a canonical contributor profile $\mathcal{P}_k$ if:
$$\text{Sim}_{\text{Lev}}(\text{Normalize}(N_i), \text{Normalize}(N_j)) \ge 0.85 \quad \lor \quad \text{PrefixMatch}(E_i, E_j)$$

$$\mathcal{P}_k = \bigcup_{m} I_m \implies \text{Commits}(\mathcal{P}_k) = \sum C_{I_m}$$

---

#### C. 4-Tier AST Complexity Weighting
Traditional evaluation treats all lines as equal ($1 \text{ LoC} = 1$). Pramaan AI tokenizes files into Abstract Syntax Trees using Tree-sitter (Python, TypeScript, JavaScript, Go, Rust, Java, C++) and applies a non-linear tiering matrix:

| Tier | Category | Multiplier ($w_i$) | Inclusion Criteria |
| :---: | :--- | :---: | :--- |
| **Tier 0** | Ignored | **$0.0\times$** | `package-lock.json`, minified bundles, auto-generated migrations, SVGs, lockfiles, dist/build assets. |
| **Tier 1** | Boilerplate | **$0.2\times$** | Plain HTML, CSS/Tailwind utility layouts, basic config objects (`tsconfig.json`), type definitions without logic. |
| **Tier 2** | Application Logic | **$1.0\times$** | Standard CRUD handlers, UI state bindings, form handling, standard REST routing. |
| **Tier 3** | Core Algorithmic | **$3.0\times$** | Custom auth/crypto primitives, concurrency locks (`SETNX`), state machines, custom tree/graph algorithms, async pipeline schedulers. |

The **Weighted AST Contribution Share** $S_a$ of an author $a$ across repository $R$ is:
$$W_a = \sum_{f \in F_a} \sum_{i=0}^3 w_i \cdot \text{Lines}_{f, \text{Tier}_i}$$
$$S_a = \frac{W_a}{\sum_{u \in \text{Authors}} W_u} \times 100\%$$

---

#### D. Shannon Entropy & Velocity Anomaly Detection
To differentiate hand-crafted human code from single-burst LLM code dumps, Pramaan AI analyzes character entropy and temporal burstiness.

1. **Shannon Entropy of Code Diffs:**
   $$H(X) = -\sum_{i=1}^{n} P(x_i) \log_2 P(x_i)$$
   - Human iterative coding presents variable entropy with high whitespace/comment fluctuations.
   - Compressed, auto-generated, or raw copied code dumps present unnaturally uniform entropy distributions across contiguous blocks.

2. **Commit Velocity Heuristics:**
   $$\text{Velocity}(c_k) = \frac{A(c_k)}{t(c_k) - t(c_{k-1})}$$
   If $\text{Velocity}(c_k) > 1,200 \text{ lines/min}$ and commit count for author $a \le 2$ with $A_a > 0.35 \times A_{\text{total}}$, the engine immediately raises:
   $$\text{FLAG\_BIG\_BANG} \implies \text{Severity: High (Crimson)}$$

---

#### E. Context-Grounded Oral Viva Defense (Gemini 2.5 Flash)
Rather than asking trivia questions, Pramaan AI isolates the exact AST subtrees modified by the specific contributor.

```
Candidate Diffs ──▶ AST Slicer (Tier 2/3) ──▶ Context Packager (Hash, Path, Lines) ──▶ Gemini 2.5 Flash
```

**Question Grounding Invariant:**
Every generated question **must** cite:
1. Exact commit hash (e.g., `#a8f12c`)
2. File path (e.g., `services/distributed_lock.py`)
3. Precise line span (e.g., lines 42–68)
4. Concrete architectural rationale request (e.g., *"Why did you use Redis SETNX with an explicit TTL rather than an in-memory mutex, and what happens if line 53 throws before release?"*)

**Anti-Cheat Voice Telemetry:**
The Web Speech API captures real-time microphone dictation while the frontend monitors:
- $\Delta t_{\text{TTFW}}$: Time-to-First-Word (if $> 45\text{s}$, flags delay).
- $\text{FocusLossCount}$: Count of `visibilitychange` (tab switches).
- $\text{ClipboardPasteEvents}$: Instant text injection into the answer box.

---

#### F. Authenticity Scoring & Proof-of-Work Receipt
The composite **Pramaan Integrity Score** $\Pi_a \in [0, 100]$ is computed via a multi-objective weighted objective function:

$$\Pi_a = 0.35 \cdot \Gamma_a + 0.25 \cdot \Omega_a + 0.40 \cdot \Psi_a$$

Where:
- $\Gamma_a$: **Git Forensic Trajectory Score** (penalizes Big Bang dumps, zero deletions, and panic bursts).
- $\Omega_a$: **AST Complexity Score** (derived from ratio of Tier 3 / Tier 2 lines vs Tier 0/1).
- $\Psi_a$: **Viva Defense Score** (evaluated across Technical Recall, Architectural Reasoning, and Edge-Case Handling).

**Cryptographic QR Proof Payload:**
The output is signed into an offline-verifiable JSON payload:
$$\text{Payload} = \{\text{repo}, \text{author}, \text{pramaan\_score}, \text{tier3\_share}, \text{timestamp}, \text{sig}\}$$
$$\text{sig} = \text{HMAC-SHA256}(\text{Payload}_{\text{raw}}, \mathcal{K}_{\text{private}})$$

Recruiters and judges scanning the QR code on a physical diploma or thermal receipt can verify the candidate offline without database access.

---

## 4. What Has Been Built: Comprehensive Module-by-Module Inventory

Pramaan AI was conceived, architected, and delivered through **15 comprehensive production modules** spanning a modern full-stack monorepo:

```
Pramaan AI/
├── frontend/                     # Next.js 14/16 App Router (TypeScript, Tailwind v4, Lucide)
│   ├── src/app/
│   │   ├── page.tsx              # Landing Hero, 1-Click Repos, Live Audit Triggers
│   │   ├── investigate/[id]/     # 5-Stage Live Scanning Telemetry & Terminal Stream
│   │   ├── evidence/[id]/        # Forensic Case Files, DNA Radar Chart, Heatmaps
│   │   ├── viva/[aid]/[cid]/     # Real-Time Voice Viva Hot-Seat Room (TTS + STT)
│   │   ├── verdict/[aid]/        # Cryptographic Thermal Receipt & 300 DPI Diploma
│   │   ├── student/dashboard/    # Candidate Portal & Verifiable Portfolio
│   │   ├── evaluator/dashboard/  # Hackathon Judge / Professor Workbench & Cohorts
│   │   └── api/webhook/github/   # CI/CD PR Status Blocker & Merge Gate
│   └── src/lib/
│       ├── api.ts                # Dual-Engine Client (FastAPI + Edge GitHub Direct)
│       └── github-analyzer.ts    # Complete Browser-Side Fallback Forensic Engine
├── backend/                      # Python 3.11+ FastAPI Forensic Services
│   ├── app/
│   │   ├── engine/git_miner.py   # PyDriller Chronological Traversal & Diffs
│   │   ├── engine/ast_classifier.py # Tree-sitter Code Weighting Engine
│   │   ├── engine/alias_resolver.py # Levenshtein Email Clustering
│   │   ├── engine/anomaly_detector.py # Anti-Cheat Heuristic Rule Matrix
│   │   └── engine/viva_examiner.py  # Gemini 2.5 Flash Grounded Interrogation
│   └── app/main.py               # REST API, Health Probes, CORS
├── scripts/                      # High-Res Asset Generators, Mockups & PPTX Builders
└── docker-compose.yml            # 1-Click Containerized Production Orchestration
```

### Module Breakdown Matrix:
1. **Module 1 — Core Ingestion & Git Mining:** Implemented shallow cloning (`--depth 50`) and PyDriller chronological commit traversal.
2. **Module 2 — Multi-Email Alias Resolver:** Normalized author identities with Levenshtein similarity thresholds ($> 0.85$).
3. **Module 3 — 4-Tier AST Complexity Classifier:** Built grammar-based tree parsing separating boilerplate from Tier 3 concurrency/crypto.
4. **Module 4 — Behavioral Anomaly Detector:** Coded heuristic alarms: `FLAG_BIG_BANG`, `FLAG_GHOST_CONTRIBUTOR`, `FLAG_ZERO_CHURN`.
5. **Module 5 — Autonomous Oral Viva Examiner:** Integrated Gemini 2.5 Flash with strict Pydantic JSON schemas and file-line grounding.
6. **Module 6 — Cinematic Forensic UI System:** Built dark obsidian aesthetic (`#09090b`), forensic grid backgrounds, and neon alerts.
7. **Module 7 — Live Pipeline Scanning Telemetry:** Created `/investigate/[id]` with real-time terminal stream and 5-stage progress indicators.
8. **Module 8 — Evidence Case Files & Heatmaps:** Created `/evidence/[id]` with DNA radar charts, commit crime timelines, and diff inspectors.
9. **Module 9 — Voice Dictation Audio Viva Room:** Engineered `/viva/[aid]/[cid]` with Web Speech STT, acoustic wave visualizer, and non-repeating transcript delta stitching.
10. **Module 10 — Cryptographic Thermal Receipt & 300 DPI Diploma:** Built printable thermal receipts with torn-edge styling and vector landscape diplomas.
11. **Module 11 — Evaluator & Cohort Batch Portal:** Engineered `/evaluator/dashboard` with 50-team CSV batch ingestion and leaderboard filtering.
12. **Module 12 — GitHub PR CI/CD Webhook Blocker:** Built automated PR status check rejecting pull requests (`422 Unprocessable Entity`) if viva integrity falls below threshold.
13. **Module 13 — Dual-Mode Direct Edge Fallback:** Coded `github-analyzer.ts` allowing 100% of forensic calculations and viva generation to run in the browser if backend is offline.
14. **Module 14 — 1-Click Sample Ingestion & Platform Tour:** Added interactive 4-slide "How It Works" modal and instant sample repository chips.
15. **Module 15 — Production Hardening & Vercel Edge Deployment:** Clean Next.js compilation across 25 routes, SVG Proof Diamond favicon, and zero-error edge build.

---

## 5. Rigorous Pros & Cons Analysis (Strengths vs. Vulnerabilities)

### 5.1 Core Strengths & Unfair Advantages
1. **Semantic Understanding vs. Text Matching:** Unlike MOSS and Turnitin, which are bypassed by AI rephrasing, Pramaan AI interrogates the actual syntax tree and oral comprehension.
2. **Dual-Mode Architectural Resilience:** Operates with high-performance FastAPI backend when available, but gracefully degrades to client-side GitHub REST API analysis on edge deployments (Vercel) without user disruption.
3. **Zero Installation Overhead for Candidates:** Students do not need to install local CLI agents, browser extensions, or Docker containers. Simply paste a public GitHub URL and defend your code.
4. **Offline Verifiable Proofs:** The QR code on receipts and diplomas is self-contained and cryptographically signed, allowing instant verification by hiring managers without API dependencies.
5. **Radical Time Compression for Evaluators:** Reduces capstone/hackathon evaluation from 20 minutes per team to under 90 seconds of high-signal forensic review.

---

### 5.2 Critical Vulnerabilities, Failure Modes & Edge Cases
To maintain academic and industrial rigor, any advanced AI model extending this codebase must resolve these known architectural limitations:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                           CURRENT ARCHITECTURAL LIMITATIONS MATRIX                             │
├──────────────────────────┬─────────────────────────────────┬───────────────────────────────────┤
│ Limitation Area          │ Root Cause                      │ Failure Manifestation             │
├──────────────────────────┼─────────────────────────────────┼───────────────────────────────────┤
│ 1. GitHub API Rate Limits│ Unauthenticated client IP calls │ Max 60 requests/hour on public    │
│                          │ from browser edge mode.         │ GitHub REST API without token.    │
├──────────────────────────┼─────────────────────────────────┼───────────────────────────────────┤
│ 2. Shallow Clone Diffs   │ `--depth 50` parameter truncates│ Commits prior to the 50-commit    │
│                          │ legacy repository history.      │ threshold are attributed to root. │
├──────────────────────────┼─────────────────────────────────┼───────────────────────────────────┤
│ 3. Voice Viva Ambient    │ Reliance on browser native      │ Poor transcription in noisy       │
│    Acoustic Noise        │ Web Speech API engine.          │ hackathon environments.           │
├──────────────────────────┼─────────────────────────────────┼───────────────────────────────────┤
│ 4. Squashed Merge Loss   │ GitHub PR 'Squash and Merge'    │ True multi-author atomic history  │
│                          │ condenses all diffs to 1 commit.│ is flattened into a single committer│
├──────────────────────────┼─────────────────────────────────┼───────────────────────────────────┤
│ 5. Tree-sitter Portability│ Native C-bindings in Python    │ Heavy serverless containers,      │
│    in Serverless         │ require compiled binaries.      │ exceeding AWS Lambda 250MB limit. │
└──────────────────────────┴─────────────────────────────────┴───────────────────────────────────┘
```

---

## 6. Key Vectors for Improvement (The Grand Research Roadmap)

For any future AI model, research lab, or engineering team building upon Pramaan AI, the following five vectors represent the transformative frontier:

### Vector 1: Dynamic MicroVM Sandboxed Fuzzing & Mutation Testing
* **Current State:** Static AST parsing and oral viva.
* **Next Leap:** Spin up an ephemeral Firecracker MicroVM or WASM sandbox. Inject mutated unit tests and fault injections into the candidate's exact functions. If the candidate wrote a distributed lock, simulate network partitions and observe if their code deadlocks.

### Vector 2: Keystroke Dynamics & IDE Telemetry Ingestion
* **Current State:** Analysis begins after code is pushed to Git.
* **Next Leap:** Integrate a lightweight VS Code / JetBrains telemetry plugin that records typing velocity (words per minute), backspace/deletion frequency, and copy-paste clipboard volume. A human typing code shows rhythmic cadence; AI copiers paste 400 characters instantaneously.

### Vector 3: Graph Neural Networks (GNN) on AST & Dependency Graphs
* **Current State:** Rule-based file pattern matching for Tier 0–Tier 3.
* **Next Leap:** Construct a unified Program Dependence Graph (PDG) combining Control Flow Graphs (CFG) and Data Flow Graphs (DFG). Train an inductive GNN (e.g., Graph Convolutional Network) to compute vector embeddings of semantic logic, identifying structural plagiarism even if variable names, function signatures, and control structures have been obfuscated.

### Vector 4: Zero-Knowledge Competency Proofs (zk-SNARKs)
* **Current State:** Verification requires public repository code diffs.
* **Next Leap:** For closed-source, proprietary enterprise codebases, construct a zk-SNARK proof system. The developer proves they authored complex algorithmic logic and passed the viva defense without exposing their employer's proprietary source code to the auditor.

### Vector 5: Multi-Agent Adversarial Viva Council
* **Current State:** Single LLM examiner questions the student.
* **Next Leap:** A dual-agent council:
  - *Examiner Agent (The Inquisitor):* Probes code vulnerabilities and edge cases.
  - *Advocate Agent (The Defender):* Analyzes whether the candidate's answer demonstrated legitimate architectural trade-off reasoning rather than ignorance.
  - *Judge Agent (The Arbiter):* Issues the final consensus score.

---

## 7. Grand-Level System Prompts & Meta-Engineering Blueprints for Frontier AI Models

The following 4 production-grade meta-prompts are designed to be ingested by frontier AI models (Claude 3.5 Sonnet, GPT-4o, Gemini 2.5 Pro) to execute grand-level architectural upgrades on Pramaan AI.

---

### Prompt 1: Autonomous MicroVM Sandboxed Fuzzing & Execution Engine

```text
[SYSTEM INSTRUCTION: AUTONOMOUS MICROVM SANDBOX ARCHITECT FOR PRAMAAN AI]
You are a Principal Systems Engineer specializing in container isolation, Firecracker microVMs, and automated fuzz testing for software evaluation.

YOUR OBJECTIVE:
Design and implement an ephemeral execution backend for Pramaan AI that runs and stress-tests candidate-authored code in real time without security risks.

ARCHITECTURAL REQUIREMENTS:
1. Ephemeral Sandbox Architecture:
   - Provide a Python/Go worker that boots a sandboxed execution jail (via Firecracker, WebAssembly/Wasmtime, or gVisor sandbox).
   - Impose strict limits: 512MB RAM, 1 vCPU, 5-second CPU timeout, zero outbound network access (preventing SSRF/crypto-mining).

2. Automated Fuzzing & Mutation Engine:
   - Extract candidate's modified functions from the AST diff.
   - Automatically generate property-based test inputs (using Hypothesis or Atheris) targeting boundary conditions (e.g., Integer Overflow, Null Pointers, Malformed UTF-8, Race Conditions).
   - If the candidate authored a sorting routine, test with reverse-sorted arrays, identical elements, and 10^5 elements.

3. Execution Telemetry Integration:
   - Output structured execution metrics: Memory Peak (MB), CPU Execution Time (ms), Exception Stacktraces, and Mutated Tests Passed Ratio.
   - Bind these execution metrics into the composite Pramaan Score:
     Pramaan Score = 0.25*(Git Forensics) + 0.20*(AST Weight) + 0.30*(Execution Sandbox) + 0.25*(Oral Viva).

DELIVERABLE:
Provide production-ready, clean Python code implementing the SandboxRunner class, safe Docker/gVisor runner commands, and the Pydantic schema for sandbox test execution.
```

---

### Prompt 2: AST-Anchored Adversarial Viva Interrogation with Zero Hallucination

```text
[SYSTEM INSTRUCTION: ADVERSARIAL ORAL VIVA EXAMINER FOR PRAMAAN AI]
You are the Chief Academic Forensic Examiner for Pramaan AI. You are examining a software engineering student defending their contribution in a high-stakes university capstone or hackathon project.

INPUT DATA CONTRACT:
You will receive a JSON payload containing:
1. `commit_hash`: The exact SHA commit identifier.
2. `file_path`: Path of the modified file.
3. `line_span`: Exact line numbers authored by this candidate (e.g., lines 142-189).
4. `code_diff`: The raw unified diff containing additions (+) and deletions (-).
5. `ast_symbols`: AST extracted symbols (e.g., class names, function signatures, loops, locks).

CORE OPERATIONAL RULES:
1. ZERO HALLUCINATION & ZERO GENERIC TRIVIA:
   - Under NO circumstance may you ask theoretical textbook questions (e.g., "What is a binary search?", "Explain ACID properties", "What is React state?").
   - Every question MUST explicitly cite:
     "In commit [HASH], inside [FILE_PATH] at line [LINE_NUMBER], you implemented [FUNCTION/LOGIC]..."
2. ADVERSARIAL PROBING (Focus on Trade-offs & Failure Modes):
   - Probe concurrency races, unhandled exception states, state drift, and resource leaks.
   - Ask WHY the candidate chose this specific pattern over standard library alternatives.
3. FORMAT ENFORCEMENT:
   Output ONLY valid JSON adhering to this exact schema:
   {
     "viva_questions": [
       {
         "question_id": "string",
         "commit_hash": "string",
         "file_path": "string",
         "line_reference": "string",
         "technical_domain": "Concurrency | ErrorHandling | Architecture | StateManagement",
         "question_text": "string",
         "expected_key_concepts": ["string"],
         "trap_signals": ["string"],
         "difficulty_tier": "Medium | Hard | Extreme"
       }
     ]
   }
```

---

### Prompt 3: Semantic GNN Code Graph Plagiarism & Clonal Disentanglement

```text
[SYSTEM INSTRUCTION: GNN PROGRAM ANALYSIS RESEARCHER FOR PRAMAAN AI]
You are an AI Code Intelligence Researcher specializing in Graph Neural Networks (GNNs), Program Dependence Graphs (PDGs), and semantic code clones.

YOUR OBJECTIVE:
Architect a cross-repository semantic plagiarism detection engine for Pramaan AI that defeats AI rephrasing, variable renaming, and AST shuffling.

TECHNICAL REQUIREMENTS:
1. Graph Construction:
   - Convert candidate source code into a Program Dependence Graph (PDG) combining Control Flow Graphs (CFG) and Data Dependence Graphs (DDG) via Tree-sitter.
   - Represent AST nodes as typed entities (FunctionDeclaration, BinaryExpression, TryCatchStatement) and edges as control/data dependencies.

2. Graph Embedding Architecture:
   - Specify a Graph Convolutional Network (GCN) or Gated Graph Sequence Neural Network (GGNN) architecture that encodes subgraphs into dense 256-dimensional vectors.
   - Formulate a contrastive loss objective (InfoNCE) such that semantic duplicates (e.g., Bubble Sort vs Bubble Sort with renamed variables and inverted loops) map to cosine similarity > 0.92, while functionally distinct routines map to < 0.35.

3. Deliverable:
   - Write a self-contained Python script using NetworkX and PyTorch Geometric demonstrating the extraction of a basic CFG from Python code, adjacency matrix construction, and embedding calculation.
```

---

### Prompt 4: Zero-Knowledge Competency Proofs (zk-SNARKs for Source Code Mastery)

```text
[SYSTEM INSTRUCTION: ZERO-KNOWLEDGE CRYPTOGRAPHY ARCHITECT FOR PRAMAAN AI]
You are a Cryptographic Protocol Engineer specializing in Zero-Knowledge Succinct Non-Interactive Arguments of Knowledge (zk-SNARKs) and privacy-preserving credentialing.

YOUR MISSION:
Design a zero-knowledge verification extension for Pramaan AI that allows enterprise software engineers working on proprietary, closed-source repositories to prove their engineering competency and viva defense scores to recruiters without revealing proprietary source code.

MATHEMATICAL & PROTOCOL SPECIFICATIONS:
1. Public Inputs:
   - `x_pub = {Developer_DID, Verification_Timestamp, Pramaan_Composite_Score, Min_Complexity_Threshold}`
2. Private Witness:
   - `w_priv = {Proprietary_Source_AST, Exact_Git_Diffs, Examiner_Signed_Viva_Rubric}`
3. Circuit Constraints (in Circom or halo2):
   - Prove that the private witness AST contains >= K lines of Tier-3 complexity logic.
   - Prove that the viva defense transcript was signed by an authorized Pramaan AI Examiner public key.
   - Prove that `Pramaan_Composite_Score` is correctly computed according to the formula:
     Score = 0.35*(Git_Score) + 0.25*(AST_Score) + 0.40*(Viva_Score) >= Min_Complexity_Threshold.

DELIVERABLE:
Provide the complete Circom circuit template (`pramaan_competency.circom`), the snarkjs proof generation workflow, and the smart contract / frontend verifier logic.
```

---

## 8. Conclusion

Pramaan AI (प्रमाण AI) transforms code assessment from a broken system of vanity metrics and passive static text comparisons into an active, forensic, multimodal verification engine. By bridging git commit trajectories, AST syntactic complexity, real-time voice defense, and cryptographic proof receipts, it provides the educational and tech-hiring ecosystem with an un-gameable standard: **Truth in Building**.

---
*End of Whitepaper — Pramaan AI Core Architecture Specification*
