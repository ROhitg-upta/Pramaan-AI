@echo off
title Pramaan AI — One-Click Stage Demo Launcher
color 0A

echo =====================================================================
echo           ____  ____     _    __  __    _      _    _   _ 
echo          ^|  _ \^|  _ \   / \  ^|  \/  ^|  / \    / \  ^| \ ^| ^|
echo          ^| ^|_) ^| ^|_) ^| / _ \ ^| ^|\/^| ^| / _ \  / _ \ ^|  \^| ^|
echo          ^|  __/^|  _ ^< / ___ \^| ^|  ^| ^|/ ___ \/ ___ \^| ^|\  ^|
echo          ^|_^|   ^|_^| \_\_/   \_^|_^|  ^|_/_/   \_/_/   \_^|_^| \_^|
echo                           A I   E N G I N E
echo =====================================================================
echo  [ETHOS] Proof of Work ^> Degree • Har Code Ka Pramaan
echo  [INFO]  Starting Backend (FastAPI :8000) ^& Frontend (Next.js :3000)...
echo =====================================================================
echo.

REM 1. Start Backend in a dedicated window
echo [*] Launching Forensic Backend Engine on http://localhost:8000 ...
start "Pramaan AI — Backend (FastAPI)" cmd /k "cd backend && if exist venv\Scripts\activate.bat (call venv\Scripts\activate.bat) && python -m uvicorn app.main:app --reload --port 8000"

REM Wait 2 seconds
timeout /t 2 /nobreak >nul

REM 2. Start Frontend in a dedicated window
echo [*] Launching Cinematic Forensic UI on http://localhost:3000 ...
start "Pramaan AI — Frontend (Next.js)" cmd /k "cd frontend && npm run dev"

echo.
echo [*] Waiting for web servers to initialize...
timeout /t 5 /nobreak >nul

REM 3. Open Browser
echo [*] Opening Pramaan AI in default browser...
start http://localhost:3000

echo.
echo =====================================================================
echo  [SUCCESS] All systems operational!
echo  • Frontend:  http://localhost:3000
echo  • Backend:   http://localhost:8000/docs
echo  • Demo URL:  http://localhost:3000/investigate/demo-smart-campus
echo  • Press Ctrl+Shift+P in browser to toggle Stage Presentation Mode!
echo =====================================================================
echo.
pause
