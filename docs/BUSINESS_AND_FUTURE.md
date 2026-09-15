# 💰 Pramaan AI — Business Model, Market Opportunity & Future Roadmap

> **Purpose:** Judges don't just evaluate technical skill — they evaluate POTENTIAL. This document proves Pramaan AI is not a hackathon toy. It's a viable EdTech SaaS product with a massive addressable market, clear monetization, and a path to scale.

---

## 1. Market Opportunity

### The Problem Is Massive & Universal

| Metric | Number | Source |
| :--- | :--- | :--- |
| Global university students | 235 million+ | UNESCO 2025 |
| Indian engineering students alone | 10 million+ | AICTE 2025 |
| Students doing group projects per semester | ~80% of CS/IT students | Industry estimate |
| Professors who suspect freeloading in teams | 73% | Survey of 500 CS faculty, ACM 2024 |
| Hackathons hosted globally per year | 12,000+ | MLH + Devpost data |
| Time professors spend evaluating group projects | 4-8 hours per batch of 20 teams | Academic workflow study |

### The AI Disruption Factor (2024-2026)
- **ChatGPT/Copilot usage among students:** 89% of CS students use AI tools weekly (GitHub Education Survey 2025).
- **Code plagiarism detection accuracy has dropped to 23%** because AI generates unique code every time — defeating MOSS and Turnitin completely.
- **Universities are desperate** for tools that verify COMPREHENSION, not just originality.

### Total Addressable Market (TAM)

```
TAM: All universities + bootcamps + hackathons globally
     = $2.8B academic integrity market (Grand View Research 2025)

SAM: CS/IT departments needing code-specific integrity tools
     = ~$420M (15% of TAM)

SOM: Indian universities + global hackathons (Year 1-2 target)
     = ~$12M (realistic initial capture)
```

---

## 2. Revenue Model

### Tier 1: Free (Community / Open Source Core)
- Analyze **3 repos per month**
- Up to **50 commits per repo**
- Basic forensic report (no Viva)
- Pramaan watermark on receipt
- **Purpose:** Adoption driver. Students try it for their own projects.

### Tier 2: Pro — ₹499/month ($6/month) per Professor
- **Unlimited** repo analysis
- Up to **1,000 commits** per repo
- Full AI Viva Defense Engine (3 questions per contributor)
- Downloadable PDF audit reports
- Priority analysis queue
- **Target:** Individual professors, TA leads, hackathon organizers

### Tier 3: University License — ₹2,99,999/year ($3,600/year) per department
- **Unlimited** everything
- Custom question rubrics aligned to department syllabus
- Batch analysis: upload 20 team repos at once, get comparison dashboard
- LMS integration (Moodle, Canvas, Google Classroom)
- Student authentication (university SSO)
- Analytics dashboard for department heads: semester-wise integrity trends
- **Target:** CS/IT department heads, deans, university IT governance

### Tier 4: Hackathon Platform License — Per-event pricing
- **$200-500 per hackathon** (based on team count)
- Real-time judging dashboard: paste any team's repo, get instant forensic report
- Leaderboard integration with Devfolio, Unstop, MLH
- **Target:** Hackathon organizers, corporate sponsors, MLH events

---

## 3. Go-to-Market Strategy

### Phase 1: Grassroots Student Adoption (Month 1-3)
- **Free tier** drives organic adoption among student developers.
- Share on Reddit (r/cscareerquestions, r/IndianDevelopers), Twitter/X tech communities.
- College tech club partnerships: "Analyze your capstone before submission."
- Viral loop: Every Pramaan Receipt shared on LinkedIn/GitHub acts as free marketing.

### Phase 2: Professor & TA Outreach (Month 3-6)
- Email campaigns to CS department heads at top 100 Indian engineering colleges.
- "Try Pramaan on your last batch's capstone repos — see what you discover."
- Free pilot programs: 30-day full access for any professor who signs up.
- Conference presentations at academic tech events (ACM India, IEEE workshops).

### Phase 3: Institutional Sales & Partnerships (Month 6-12)
- University site licenses sold through EdTech distribution channels.
- Integration with existing LMS platforms (Moodle plugin, Canvas LTI).
- Partnership with hackathon platforms (Devfolio, Unstop, HackerEarth).

### Phase 4: Global Expansion (Year 2+)
- International university licenses (US, UK, EU markets).
- Enterprise version: Tech companies using Pramaan to verify coding bootcamp graduates' actual skill before hiring.
- API-as-a-Service: Other EdTech tools integrate Pramaan's forensic engine via API.

---

## 4. Future Feature Roadmap (Post-Hackathon)

### 🔜 Near-Term (1-3 months post-hackathon)
- [ ] **Private Repository Support:** GitHub OAuth integration for analyzing private repos with user consent.
- [ ] **Multi-Language AST:** Extend tree-sitter support beyond Python/JS to Java, C++, Go, Rust.
- [ ] **Batch Analysis Dashboard:** Upload 20 team repos, get a comparative bird's-eye view.
- [ ] **Voice-to-Text Viva (Whisper API):** Server-side audio transcription for accurate voice-based viva.

### 🔮 Mid-Term (3-6 months)
- [ ] **Historical Student Profile (Pramaan Passport):** A student's accumulated proof-of-work across all semesters, building a verifiable builder portfolio.
- [ ] **Live Viva Proctoring:** Webcam + screen monitoring during viva to prevent tab-switching to ChatGPT.
- [ ] **Plagiarism Cross-Match:** Compare repos across students in the same batch (MOSS-like, but with AST + behavioral signals).
- [ ] **LMS Integrations:** Moodle, Canvas, Google Classroom plugins for seamless assignment workflow.

### 🚀 Long-Term (6-12 months)
- [ ] **Enterprise Hiring Verification:** Companies submit a candidate's GitHub. Pramaan verifies if they actually built what they claim on their resume.
- [ ] **Pramaan Verified Badge:** A GitHub-compatible badge that employers and recruiters recognize as proof of genuine builder capability.
- [ ] **AI Model Fine-Tuning:** Fine-tune a custom model on thousands of viva sessions for even more accurate authenticity detection.

---

## 5. Competitive Moat Durability

| Moat Component | Can Competitors Copy Easily? | Why Not? |
| :--- | :--- | :--- |
| Temporal Git Forensics | Medium | Algorithm can be replicated, but tuning anomaly thresholds requires real-world data from thousands of repos. |
| AST Semantic Weighting | Medium-Hard | Multi-language AST classification requires significant engineering and heuristic refinement. |
| Autonomous Viva Defense | **Very Hard** | This requires sophisticated prompt engineering, anti-hallucination grounding, and a UX that feels like a real oral exam — not just a chatbot. We have first-mover advantage. |
| Pramaan Proof Receipt (Brand) | **Hard to Replicate** | "Pramaan Verified" becomes a recognized brand in academic integrity, similar to how "Turnitin Originality" is synonymous with essay checking. |
| Training Data Network Effect | **Very Hard** | Every viva session trains our understanding of builder vs freeloader language patterns. More usage = better detection. Competitors start from zero. |

---

## 6. Key Metrics We'd Track (If This Were a Startup)

| Metric | Definition | Target (Month 6) |
| :--- | :--- | :--- |
| **Repos Analyzed** | Total repositories processed | 10,000 |
| **Professors Onboarded** | Pro tier subscribers | 200 |
| **Viva Sessions Conducted** | Total AI viva completions | 5,000 |
| **Freeloader Detection Rate** | % of flagged contributors confirmed by professors | >80% accuracy |
| **Receipts Shared** | Proof receipts downloaded/shared on LinkedIn/GitHub | 3,000 |
| **NPS (Professor)** | Net Promoter Score from professor users | >60 |

---

## 7. The "Why Now?" Slide

Three forces converging in 2026 that make Pramaan AI's timing perfect:

1. **AI-generated code is at an all-time high.** 89% of CS students use Copilot/ChatGPT weekly. Traditional plagiarism tools are BLIND to AI output.
2. **Universities are panicking.** NEP 2024 in India emphasizes skill verification over rote grades. European universities are banning AI but have no verification infrastructure.
3. **LLM APIs are now cheap and fast enough.** Gemini 2.5 Flash processes a viva question in under 2 seconds at $0.001 per call. This wasn't economically viable 18 months ago.

**Pramaan AI sits at the intersection of a massive problem, a regulatory tailwind, and newly available technology. This is the right product at the right time.**
