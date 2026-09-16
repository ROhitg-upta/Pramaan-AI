#!/usr/bin/env bash

echo "====================================================================="
echo "   P R A M A A N   A I   —   S T A G E   D E M O   L A U N C H E R   "
echo "====================================================================="
echo " [ETHOS] Proof of Work > Degree • Har Code Ka Pramaan"
echo " [INFO]  Launching FastAPI backend & Next.js frontend..."
echo "====================================================================="

# Trap exit to cleanup background jobs
trap 'kill $(jobs -p) 2>/dev/null' EXIT

# Start backend
cd backend || exit
if [ -d "venv" ]; then
  source venv/bin/activate
fi
python -m uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# Start frontend
cd frontend || exit
npm run dev &
FRONTEND_PID=$!
cd ..

echo "Waiting for servers to start..."
sleep 4

# Open browser
if which xdg-open > /dev/null; then
  xdg-open http://localhost:3000
elif which open > /dev/null; then
  open http://localhost:3000
fi

echo "====================================================================="
echo " Systems live at http://localhost:3000"
echo " Press Ctrl+C to terminate both servers."
echo "====================================================================="

wait
