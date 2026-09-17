# 🏛️ PRAMAAN AI (प्रमाण AI) — ENTERPRISE CLOUD DEPLOYMENT GUIDE

This document provides production deployment procedures for **Pramaan AI (प्रमाण AI)** across serverless, managed container, and self-hosted environments.

---

## 1. Architecture Overview

Pramaan AI is composed of three enterprise services:
1. **Next.js 14 Frontend (`frontend/`):** React 18, Tailwind CSS, Recharts, App Router, Standalone Node.js bundle.
2. **FastAPI Forensics Backend (`backend/`):** Python 3.11, SQLAlchemy, PyDriller, GitPython, Google Gemini LLM SDK, Uvicorn 4-worker runner.
3. **PostgreSQL Database:** PostgreSQL 16 (or Cloud Neon / Supabase serverless database with SSL TLS 1.3).

```
                      ┌───────────────────────────────────────┐
                      │        Vercel / Cloud CDN Edge        │
                      │       Next.js 14 Frontend (:3000)     │
                      └──────────────────┬────────────────────┘
                                         │
                                         ▼ REST / Webhooks / WS
                      ┌───────────────────────────────────────┐
                      │       FastAPI Forensics Backend       │
                      │        Uvicorn Workers (:8000)        │
                      └───────┬───────────────────────┬───────┘
                              │                       │
                              ▼                       ▼
            ┌───────────────────────────┐   ┌───────────────────────────┐
            │   PostgreSQL 16 Engine    │   │     GitHub Webhooks &     │
            │  (Neon / Supabase / RDS)  │   │     CI/CD Action APIs     │
            └───────────────────────────┘   └───────────────────────────┘
```

---

## 2. Option A: Self-Hosted Docker Compose (DigitalOcean / AWS EC2 / On-Premise)

This is the recommended strategy for university campus networks, air-gapped labs, and hackathon infrastructure servers.

### Prerequisites:
- Docker Engine 24.0+ and Docker Compose v2.20+
- Ubuntu 22.04 LTS or Amazon Linux 2023 with at least 2 vCPUs and 4GB RAM.

### Step 1: Clone Repository & Configure Environment
```bash
git clone https://github.com/ROhitg-upta/Pramaan-AI.git
cd Pramaan-AI

# Copy production environment configuration template
cp .env.production.example .env
```

Edit `.env` and set your production secrets:
```ini
POSTGRES_USER=pramaan_admin
POSTGRES_PASSWORD=generate_a_secure_password_here
POSTGRES_DB=pramaan_db

JWT_SECRET_KEY=generate_64_char_secret_key
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
GEMINI_API_KEY=AIzaSy...
GITHUB_TOKEN=ghp_...
```

### Step 2: Build and Launch Multi-Container Cluster
```bash
# Build all images and start in background
docker compose up -d --build

# Inspect container status and healthchecks
docker compose ps
```

You should see:
- `pramaan-postgres`: `Up (healthy)` on `5432`
- `pramaan-backend`: `Up (healthy)` on `8000`
- `pramaan-frontend`: `Up` on `3000`

### Step 3: Verify Healthcheck
```bash
curl -i http://localhost:8000/api/health
```
Expected output:
```json
{
  "status": "healthy",
  "database": "connected",
  "git_miner": "ready",
  "version": "1.0.0",
  "timestamp": "..."
}
```

### Step 4: Configure NGINX Reverse Proxy with HTTPS Let's Encrypt
```nginx
# /etc/nginx/sites-available/pramaan.conf
server {
    server_name pramaan.youruniversity.edu;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 3. Option B: Hybrid Cloud Deployment (Vercel + Railway / Render + Neon)

For hyper-scalable commercial SaaS operation with zero server maintenance.

### 1. Database Setup: Neon PostgreSQL
1. Create a serverless database at [Neon.tech](https://neon.tech).
2. Copy the connection string:
   ```
   postgresql://user:password@ep-cool-neon.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### 2. Backend Deployment: Railway or Render
1. Create a new service from your GitHub repo pointing to the `/backend` directory.
2. Select **Dockerfile** as the build configuration.
3. Configure Environment Variables in Railway/Render:
   - `DATABASE_URL`: Your Neon connection string.
   - `GEMINI_API_KEY`: Your Google AI API key.
   - `JWT_SECRET_KEY`: A random 64-character string.
   - `CORS_ORIGINS`: `https://your-frontend.vercel.app`
4. Healthcheck Path: `/api/health`.

### 3. Frontend Deployment: Vercel
1. Import your GitHub repository into [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Framework Preset: **Next.js**.
4. Configure Environment Variables:
   - `NEXT_PUBLIC_API_URL`: `https://your-backend.up.railway.app`
5. Click **Deploy**. Vercel will automatically build and deploy the application across its global Edge Network.

---

## 4. Production Environment Variables Reference

| Variable Name | Required | Service | Description | Example |
| :--- | :---: | :---: | :--- | :--- |
| `DATABASE_URL` | Yes | Backend | PostgreSQL connection string | `postgresql://user:pass@host:5432/db?sslmode=require` |
| `JWT_SECRET_KEY` | Yes | Backend | Salt for signing candidate session tokens | `9f82b7c4a10d8e29bc41d2f7e82a...` |
| `GEMINI_API_KEY` | Optional | Backend | Google Gemini LLM API key for viva interrogation | `AIzaSy...` |
| `GITHUB_TOKEN` | Optional | Backend & Action | GitHub PAT for PR bot comments & 5,000 req/hr limits | `ghp_...` |
| `NEXT_PUBLIC_API_URL` | Yes | Frontend | Public base URL of the FastAPI backend | `https://api.pramaan.ai` |
| `CORS_ORIGINS` | Yes | Backend | Allowed frontend domains for CORS | `https://pramaan.ai,http://localhost:3000` |

---

## 5. Maintenance & Disaster Recovery

### Database Backup
```bash
docker exec -t pramaan-postgres pg_dump -U pramaan_admin pramaan_db > backup_$(date +%Y%m%d).sql
```

### Database Restore
```bash
cat backup_20260917.sql | docker exec -i pramaan-postgres psql -U pramaan_admin -d pramaan_db
```

### Upgrading Backend & Frontend
```bash
git pull origin main
docker compose build --no-cache
docker compose up -d
```
