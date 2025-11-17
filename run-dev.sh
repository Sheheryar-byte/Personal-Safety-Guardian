#!/bin/bash

# Script to run both backend and frontend services
# Usage: ./run-dev.sh

echo "🚀 Starting AI Personal Safety Guardian..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists in backend
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  Warning: backend/.env file not found!${NC}"
    echo "Please create backend/.env with your GEMINI_API_KEY"
    echo "Example:"
    echo "  GEMINI_API_KEY=your_api_key_here"
    echo "  PORT=8080"
    echo ""
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down services...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Start Backend
echo -e "${BLUE}📡 Starting Backend Server...${NC}"
cd backend
npm start > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 2

# Start Frontend
echo -e "${BLUE}🎨 Starting Frontend Server...${NC}"
cd Frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo ""
echo -e "${GREEN}✅ Services started!${NC}"
echo ""
echo "Backend:  http://localhost:8080"
echo "Frontend: http://localhost:3000"
echo ""
echo "Logs:"
echo "  Backend:  tail -f backend.log"
echo "  Frontend: tail -f frontend.log"
echo ""
echo "Press Ctrl+C to stop both services"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID



