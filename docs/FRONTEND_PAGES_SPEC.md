# 🖥️ Pramaan AI — Frontend Page-by-Page Implementation Guide

> **Purpose:** This file is the **developer handoff document**. Each section corresponds to exactly ONE Next.js page/route. Any AI agent or developer opening this file can implement ANY page in isolation without needing to read any other file. Every prop, every API call, every state variable, and every animation is specified.

---

## Global Setup

### Dependencies (`package.json`)
```json
{
  "dependencies": {
    "next": "^14.2",
    "react": "^18.3",
    "react-dom": "^18.3",
    "framer-motion": "^11.0",
    "recharts": "^2.12",
    "lucide-react": "^0.400",
    "canvas-confetti": "^1.9",
    "qrcode.react": "^3.1",
    "prismjs": "^1.29",
    "@radix-ui/react-tabs": "^1.1",
    "@radix-ui/react-tooltip": "^1.1",
    "@radix-ui/react-progress": "^1.1",
    "clsx": "^2.1",
    "tailwind-merge": "^2.3"
  },
  "devDependencies": {
    "typescript": "^5.5",
    "@types/react": "^18.3",
    "tailwindcss": "^3.4",
    "autoprefixer": "^10.4",
    "postcss": "^8.4"
  }
}
```

### Tailwind Config Extensions (`tailwind.config.ts`)
```typescript
export default {
  theme: {
    extend: {
      colors: {
        void: '#050507',
        obsidian: '#0A0D14',
        card: '#0F1629',
        'card-hover': '#151D35',
        elevated: '#1A2342',
        'code-bg': '#0D1117',
        'neon-emerald': '#10B981',
        'neon-amber': '#F59E0B',
        'neon-crimson': '#EF4444',
        'neon-cyan': '#06B6D4',
        'neon-purple': '#8B5CF6',
      },
      fontFamily: {
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'grid-drift': 'gridDrift 120s linear infinite',
        'scan-sweep': 'scanSweep 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'typewriter-cursor': 'blink 530ms step-end infinite',
      },
      keyframes: {
        gridDrift: { '0%': { backgroundPosition: '0 0' }, '100%': { backgroundPosition: '0 -1000px' } },
        scanSweep: { '0%': { top: '-2px', opacity: '0' }, '10%': { opacity: '1' }, '90%': { opacity: '1' }, '100%': { top: '100vh', opacity: '0' } },
        pulseGlow: { '0%, 100%': { opacity: '0.06' }, '50%': { opacity: '0.12' } },
        blink: { '50%': { opacity: '0' } },
      },
    },
  },
};
```

---

## Page 1: ACT 1 — The Briefing (`app/page.tsx`)

### Route: `/`
### Purpose: Cinematic landing page where the judge pastes a GitHub repo URL to initiate the investigation.

### State Variables:
```typescript
const [repoUrl, setRepoUrl] = useState<string>('');
const [branch, setBranch] = useState<string>('main');
const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
const [logoRevealed, setLogoRevealed] = useState<boolean>(false);
const [taglineComplete, setTaglineComplete] = useState<boolean>(false);
```

### Component Composition:
```
<ForensicGridBg />                     // Fixed background dot grid
<main className="relative z-10 flex flex-col items-center justify-center min-h-screen">
  <GlitchLogo onComplete={() => setLogoRevealed(true)} />
  {logoRevealed && (
    <>
      <h1>P R A M A A N  A I</h1>       // Letter-stagger fade-in (40ms per letter)
      <p>प्रमाण — Proof of Work</p>
      <TypewriterText
        text="Har Code Ka Pramaan"
        speed={50}
        onComplete={() => setTaglineComplete(true)}
      />
    </>
  )}
  {taglineComplete && (
    <InvestigationInput
      repoUrl={repoUrl}
      onUrlChange={setRepoUrl}
      branch={branch}
      onBranchChange={setBranch}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  )}
</main>
```

### API Call on Submit:
```typescript
async function handleSubmit() {
  setIsSubmitting(true);
  const res = await fetch('/api/v1/analyze/repo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repo_url: repoUrl, branch }),
  });
  const { analysis_id } = await res.json();
  router.push(`/investigate/${analysis_id}`);
}
```

---

## Page 2: ACT 2 — The Investigation (`app/investigate/[id]/page.tsx`)

### Route: `/investigate/:analysisId`
### Purpose: Real-time forensic scanning progress with live metrics streaming and early red-flag detection.

### State Variables:
```typescript
const [status, setStatus] = useState<'processing' | 'completed'>('processing');
const [progress, setProgress] = useState<number>(0);
const [currentStep, setCurrentStep] = useState<string>('');
const [metrics, setMetrics] = useState<{
  totalCommits: number;
  totalLines: number;
  contributors: number;
  filesAnalyzed: number;
}>({ totalCommits: 0, totalLines: 0, contributors: 0, filesAnalyzed: 0 });
const [redFlags, setRedFlags] = useState<RedFlag[]>([]);
const [logLines, setLogLines] = useState<string[]>([]);
const [phases, setPhases] = useState<Phase[]>([
  { name: 'Cloning Repository', status: 'pending' },
  { name: 'Mining Commits', status: 'pending' },
  { name: 'Identity Resolution', status: 'pending' },
  { name: 'AST Tier Classification', status: 'pending' },
  { name: 'Anomaly Detection', status: 'pending' },
  { name: 'Viva Question Generation', status: 'pending' },
]);
```

### Polling Logic:
```typescript
useEffect(() => {
  const interval = setInterval(async () => {
    const res = await fetch(`/api/v1/analyze/${analysisId}/status`);
    const data = await res.json();
    setProgress(data.progress_percent);
    setCurrentStep(data.current_step);
    // Update phases, metrics, red flags from response
    if (data.status === 'completed') {
      clearInterval(interval);
      // 1.5s dramatic pause, then navigate
      setTimeout(() => router.push(`/evidence/${analysisId}`), 1500);
    }
  }, 1000); // Poll every second
  return () => clearInterval(interval);
}, [analysisId]);
```

### Component Composition:
```
<ForensicGridBg />
<ScanLineSweep active={status === 'processing'} />  // Cyan sweep animation
<Navbar repo="team/capstone" timer={elapsedTime} />
<main>
  <PhaseProgress phases={phases} progress={progress} />
  <LiveMetricCounters metrics={metrics} />            // useCountUp hook for each number
  <AnimatePresence>
    {redFlags.map(flag => (
      <RedFlagAlertCard key={flag.id} flag={flag} />  // Slams in from right
    ))}
  </AnimatePresence>
  <TerminalLog lines={logLines} />                    // Auto-scrolling mono log
</main>
```

---

## Page 3: ACT 3 — The Evidence Wall (`app/evidence/[id]/page.tsx`)

### Route: `/evidence/:analysisId`
### Purpose: Full forensic dashboard with tabbed views for contributor comparison, timeline scrubbing, DNA radar, file heatmap, and red-flag dossiers.

### Data Fetch (on mount):
```typescript
const report = await fetch(`/api/v1/analyze/${analysisId}/report`).then(r => r.json());
// report contains: contributors[], timeline[], anomalies[], fileMap{}, repoMeta{}
```

### State Variables:
```typescript
const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'radar' | 'heatmap' | 'flags'>('overview');
const [selectedContributor, setSelectedContributor] = useState<string | null>(null);
```

### Tab Content Mapping:
```
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="overview">📊 Overview</TabsTrigger>
    <TabsTrigger value="timeline">🕐 Crime Timeline</TabsTrigger>
    <TabsTrigger value="radar">🧬 DNA Radar</TabsTrigger>
    <TabsTrigger value="heatmap">📁 File Heatmap</TabsTrigger>
    <TabsTrigger value="flags">🚩 Red Flags ({report.anomalies.length})</TabsTrigger>
  </TabsList>

  <TabsContent value="overview">
    <ContributorCardGrid contributors={report.contributors} onStartViva={handleStartViva} />
  </TabsContent>

  <TabsContent value="timeline">
    <CrimeTimeline
      commits={report.timeline}
      contributors={report.contributors}
      onCommitHover={setHoveredCommit}
    />
  </TabsContent>

  <TabsContent value="radar">
    <DnaRadarChart
      contributors={report.contributors}
      selected={selectedContributor}
      onSelect={setSelectedContributor}
    />
  </TabsContent>

  <TabsContent value="heatmap">
    <FileHeatmap fileMap={report.fileMap} contributors={report.contributors} />
  </TabsContent>

  <TabsContent value="flags">
    <RedFlagDossier
      anomalies={report.anomalies}
      onViewEvidence={openDiffModal}
      onInterrogate={(contributorId) => router.push(`/viva/${analysisId}/${contributorId}`)}
    />
  </TabsContent>
</Tabs>
```

---

## Page 4: ACT 4 — The Interrogation (`app/viva/[id]/[contributor]/page.tsx`)

### Route: `/viva/:analysisId/:contributorId`
### Purpose: Split-screen AI viva defense terminal. Left = code evidence. Right = AI examiner streaming questions.

### Data Fetch:
```typescript
// Fetch targeted viva questions for this contributor
const questions = await fetch(`/api/v1/viva/${analysisId}/questions`, {
  method: 'POST',
  body: JSON.stringify({ contributor_id: contributorId, question_count: 3 }),
}).then(r => r.json());
```

### State Variables:
```typescript
const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
const [questionStreaming, setQuestionStreaming] = useState<boolean>(true);
const [studentAnswer, setStudentAnswer] = useState<string>('');
const [isRecording, setIsRecording] = useState<boolean>(false);
const [evaluationResult, setEvaluationResult] = useState<EvalResult | null>(null);
const [authenticityScore, setAuthenticityScore] = useState<number>(0);
const [timeToFirstKeystroke, setTimeToFirstKeystroke] = useState<number | null>(null);
const [questionAppearedAt, setQuestionAppearedAt] = useState<number>(Date.now());
```

### Submit Answer & Evaluate:
```typescript
async function handleSubmitAnswer() {
  const res = await fetch('/api/v1/viva/evaluate', {
    method: 'POST',
    body: JSON.stringify({
      question_id: questions[currentQuestionIndex].id,
      student_answer: studentAnswer,
    }),
  });
  const result = await res.json();
  setEvaluationResult(result);
  setAuthenticityScore(result.score);
  // After all questions answered, navigate to verdict
  if (currentQuestionIndex >= questions.length - 1) {
    setTimeout(() => router.push(`/verdict/${analysisId}`), 3000);
  }
}
```

### Component Composition:
```
<div className="grid grid-cols-2 gap-0 h-screen">
  {/* LEFT: Evidence Panel */}
  <EvidencePanel
    filePath={currentQuestion.file_path}
    code={currentQuestion.code_snippet}
    highlightLines={currentQuestion.line_range}    // Cyan glowing highlight
    commitHash={currentQuestion.commit_hash}
  />

  {/* RIGHT: Examiner Panel */}
  <ExaminerPanel
    question={currentQuestion.question_text}
    difficulty={currentQuestion.difficulty}
    category={currentQuestion.category}
    isStreaming={questionStreaming}                  // Typewriter char-by-char
    onStreamComplete={() => {
      setQuestionStreaming(false);
      setQuestionAppearedAt(Date.now());
    }}
  />
</div>

{/* BOTTOM: Response Zone */}
<ResponseInput
  value={studentAnswer}
  onChange={handleAnswerChange}
  onSubmit={handleSubmitAnswer}
  isRecording={isRecording}
  onToggleRecord={toggleRecording}
/>

{/* BOTTOM BAR: Authenticity Meter */}
<AuthenticityMeter
  score={authenticityScore}
  verdict={evaluationResult?.verdict}
  isAnimating={!!evaluationResult}
/>

{/* CORNER: Anti-Cheat */}
<AntiCheatBadge
  ttfk={timeToFirstKeystroke}
  pasteDetected={pasteDetected}
/>
```

---

## Page 5: ACT 5 — The Verdict (`app/verdict/[id]/page.tsx`)

### Route: `/verdict/:analysisId`
### Purpose: Dramatic score reveal with animated radial progress, confetti for high scores, executive summary, and thermal proof receipt.

### Data Fetch:
```typescript
const report = await fetch(`/api/v1/analyze/${analysisId}/report`).then(r => r.json());
// Contains: contributors[] with final pramaan_score, sub_scores, verdict, executive_summary
```

### State Variables:
```typescript
const [revealPhase, setRevealPhase] = useState<'darkness' | 'title' | 'scores' | 'summary' | 'receipt'>('darkness');
const [showConfetti, setShowConfetti] = useState<boolean>(false);
```

### Reveal Sequence (Timed):
```typescript
useEffect(() => {
  const sequence = [
    { phase: 'title', delay: 1000 },       // 1s darkness, then title types in
    { phase: 'scores', delay: 3000 },       // 2s after title, scores reveal
    { phase: 'summary', delay: 6000 },      // 3s after scores, summary types
    { phase: 'receipt', delay: 9000 },       // 3s after summary, receipt prints
  ];
  sequence.forEach(({ phase, delay }) => {
    setTimeout(() => setRevealPhase(phase as any), delay);
  });
}, []);

// Trigger confetti for high scores
useEffect(() => {
  if (revealPhase === 'scores') {
    const hasHighScore = report.contributors.some(c => c.pramaan_score >= 85);
    if (hasHighScore) {
      setTimeout(() => {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#10B981', '#F59E0B', '#06B6D4'] });
        setShowConfetti(true);
      }, 2000); // After score animation completes
    }
  }
}, [revealPhase]);
```

### Component Composition:
```
<div className="min-h-screen bg-void flex flex-col items-center justify-center">
  {revealPhase !== 'darkness' && (
    <TypewriterText text="⚖️ THE VERDICT" className="font-display text-4xl" />
  )}

  {revealPhase >= 'scores' && (
    <div className="flex gap-16 mt-12">
      {report.contributors.map((c, i) => (
        <motion.div key={c.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.6, type: 'spring', stiffness: 200 }}>
          <ScoreRevealCircle
            score={c.pramaan_score}
            name={c.primary_name}
            verdict={c.verdict}
            color={c.pramaan_score >= 70 ? 'emerald' : c.pramaan_score >= 40 ? 'amber' : 'crimson'}
          />
          <SubScoreBreakdown scores={c.sub_scores} />
        </motion.div>
      ))}
    </div>
  )}

  {revealPhase >= 'summary' && (
    <ExecutiveSummary text={report.executive_summary} />
  )}

  {revealPhase >= 'receipt' && (
    <PrintAnimation>
      <ThermalReceipt report={report} />
    </PrintAnimation>
  )}

  <ExportActions analysisId={analysisId} />
</div>
```

---

## Key Reusable Hooks Implementation

### `useCountUp(target, duration)`
```typescript
export function useCountUp(target: number, duration: number = 1500) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out deceleration curve
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}
```

### `useTypewriter(text, speed)`
```typescript
export function useTypewriter(text: string, speed: number = 30) {
  const [displayed, setDisplayed] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  useEffect(() => {
    let i = 0;
    setDisplayed('');
    setIsComplete(false);
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return { displayed, isComplete };
}
```

---

## Summary: The 5-Page Route Map

| ACT | Route | Core Components | API Endpoint |
| :--- | :--- | :--- | :--- |
| 1. Briefing | `/` | GlitchLogo, TypewriterText, InvestigationInput | `POST /analyze/repo` |
| 2. Investigation | `/investigate/[id]` | PhaseProgress, LiveMetricCounters, RedFlagAlertCard, TerminalLog | `GET /analyze/{id}/status` (poll) |
| 3. Evidence Wall | `/evidence/[id]` | ContributorCard, CrimeTimeline, DnaRadarChart, FileHeatmap, RedFlagDossier | `GET /analyze/{id}/report` |
| 4. Interrogation | `/viva/[id]/[contributor]` | EvidencePanel, ExaminerPanel, AudioWaveform, AuthenticityMeter | `POST /viva/{id}/questions` + `POST /viva/evaluate` |
| 5. Verdict | `/verdict/[id]` | ScoreRevealCircle, ConfettiBurst, ExecutiveSummary, ThermalReceipt | `GET /analyze/{id}/report` |
