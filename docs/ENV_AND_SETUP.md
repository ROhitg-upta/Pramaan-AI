# 🔧 Pramaan AI — Environment, Setup & Deployment Guide

> **Purpose:** Any developer or AI agent should be able to go from a fresh clone to a fully running local dev environment in under 5 minutes using ONLY this file.

---

## 1. Prerequisites

| Tool | Version | Check Command | Install |
| :--- | :--- | :--- | :--- |
| **Python** | 3.11+ | `python --version` | [python.org](https://python.org) |
| **Node.js** | 18+ LTS | `node --version` | [nodejs.org](https://nodejs.org) |
| **npm** | 9+ | `npm --version` | Comes with Node.js |
| **Git** | 2.40+ | `git --version` | [git-scm.com](https://git-scm.com) |
| **Google Gemini API Key** | — | — | [ai.google.dev](https://ai.google.dev) |

---

## 2. Environment Variables

### Backend (`backend/.env`)
```env
# ═══════════════════════════════════════════
# PRAMAAN AI — Backend Environment Variables
# ═══════════════════════════════════════════

# ── App Config ──
APP_NAME=Pramaan AI
APP_ENV=development                    # development | production
APP_DEBUG=true
APP_PORT=8000
APP_HOST=0.0.0.0

# ── Google Gemini API ──
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL_QUESTION=gemini-2.5-flash  # For viva question generation
GEMINI_MODEL_EVALUATE=gemini-2.5-flash  # For answer evaluation
GEMINI_MODEL_SUMMARY=gemini-2.5-flash   # For executive summary generation
GEMINI_TEMPERATURE_QUESTION=0.4         # Lower = more deterministic questions
GEMINI_TEMPERATURE_EVALUATE=0.2         # Very low = strict factual grading
GEMINI_MAX_TOKENS=4096

# ── Database ──
DATABASE_URL=sqlite:///./pramaan.db     # SQLite for dev, PostgreSQL for prod
# DATABASE_URL=postgresql://user:pass@localhost:5432/pramaan_db  # Production

# ── Repository Processing ──
REPO_CLONE_DIR=./tmp/repos              # Temporary directory for cloned repos
REPO_MAX_COMMITS=1000                   # Max commits to analyze (performance guard)
REPO_MAX_FILE_SIZE_KB=500               # Skip files larger than this
REPO_CLONE_TIMEOUT_SECONDS=60           # Max time allowed for git clone

# ── Analysis Config ──
ANALYSIS_WORKER_TIMEOUT=120             # Max seconds for full analysis pipeline
BIG_BANG_THRESHOLD_LINES=1500           # Lines added in single commit to trigger flag
BIG_BANG_THRESHOLD_COMMITS=3            # Max commits for Big Bang detection
GHOST_CONTRIBUTOR_DOC_RATIO=0.80        # Documentation-only ratio to flag ghost
PANIC_BURST_WINDOW_HOURS=8              # Hours before deadline for panic detection

# ── CORS (Frontend Origin) ──
CORS_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000"]

# ── Logging ──
LOG_LEVEL=INFO                          # DEBUG | INFO | WARNING | ERROR
```

### Frontend (`frontend/.env.local`)
```env
# ═══════════════════════════════════════════
# PRAMAAN AI — Frontend Environment Variables
# ═══════════════════════════════════════════

NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=Pramaan AI
NEXT_PUBLIC_APP_TAGLINE=Har Code Ka Pramaan
```

---

## 3. Backend Setup (Step-by-Step)

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create Python virtual environment
python -m venv venv

# 3. Activate virtual environment
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Copy environment file and fill in your Gemini API key
copy .env.example .env          # Windows
# cp .env.example .env          # macOS/Linux

# 6. Initialize database
python -c "from app.core.database import init_db; init_db()"

# 7. Run the FastAPI development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Server will be live at:
#   API:     http://localhost:8000
#   Docs:    http://localhost:8000/docs     (Swagger UI)
#   ReDoc:   http://localhost:8000/redoc
```

### Backend `requirements.txt`
```txt
fastapi==0.115.0
uvicorn[standard]==0.30.0
pydantic==2.9.0
pydantic-settings==2.5.0
sqlalchemy==2.0.35
python-dotenv==1.0.1
pydriller==2.6
gitpython==3.1.43
google-genai==1.0.0
httpx==0.27.0
python-multipart==0.0.9
aiofiles==24.1.0
```

---

## 4. Frontend Setup (Step-by-Step)

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install Node.js dependencies
npm install

# 3. Copy environment file
copy .env.example .env.local    # Windows
# cp .env.example .env.local    # macOS/Linux

# 4. Run the Next.js development server
npm run dev

# Frontend will be live at:
#   App:     http://localhost:3000
```

---

## 5. Deployment Guide

### Option A: Vercel (Frontend) + Railway (Backend) — RECOMMENDED for Hackathon

#### Frontend → Vercel
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy from frontend directory
cd frontend
vercel

# 3. Set environment variables in Vercel Dashboard:
#    NEXT_PUBLIC_API_URL = https://your-backend.railway.app
```

#### Backend → Railway
```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login and deploy
cd backend
railway login
railway init
railway up

# 3. Set environment variables in Railway Dashboard:
#    GEMINI_API_KEY, DATABASE_URL (Railway provides PostgreSQL), CORS_ORIGINS
```

### Option B: Single Machine (Demo Day Fallback)
```bash
# Terminal 1: Backend
cd backend && .\venv\Scripts\activate && uvicorn app.main:app --port 8000

# Terminal 2: Frontend
cd frontend && npm run dev
```

### Option C: Docker Compose (Advanced)
```yaml
# docker-compose.yml (root of project)
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    env_file:
      - ./backend/.env
    volumes:
      - ./tmp/repos:/app/tmp/repos
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on:
      - backend
```

---

## 6. Troubleshooting

| Issue | Cause | Fix |
| :--- | :--- | :--- |
| `ModuleNotFoundError: pydriller` | venv not activated | `.\venv\Scripts\activate` then `pip install -r requirements.txt` |
| `CORS error` in browser console | Backend CORS not configured | Verify `CORS_ORIGINS` in `.env` includes `http://localhost:3000` |
| `Gemini API 403 Forbidden` | Invalid or missing API key | Get key from [ai.google.dev](https://ai.google.dev), update `.env` |
| `git clone timeout` | Large repo or slow network | Increase `REPO_CLONE_TIMEOUT_SECONDS` or use `--depth 1` shallow clone |
| `sqlite3.OperationalError: database is locked` | Concurrent write attempts | Switch to PostgreSQL for production or reduce polling frequency |
| Frontend shows blank page | API URL mismatch | Check `NEXT_PUBLIC_API_URL` matches running backend port |
