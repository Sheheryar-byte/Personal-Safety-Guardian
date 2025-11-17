# Setup Guide - AI Personal Safety Guardian

## Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- Google Gemini API Key (get it from https://makersuite.google.com/app/apikey)

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
```

### 2. Create Backend Environment File

Create a `.env` file in the `backend/` directory:

```bash
cd backend
nano .env  # or use your preferred editor
```

Add the following content:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=8080
FRONTEND_URL=http://localhost:3000
```

**Important:** Replace `your_gemini_api_key_here` with your actual Gemini API key.

### 3. Frontend Setup

```bash
cd Frontend
npm install
```

### 4. Run Both Services

#### Option A: Using the provided script (Recommended)

From the project root:

```bash
./run-dev.sh
```

#### Option B: Manual (Two Terminal Windows)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```

## Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **Health Check:** http://localhost:8080/api/health

## Troubleshooting

### Backend won't start
- Check if port 8080 is already in use
- Verify `.env` file exists and has `GEMINI_API_KEY` set
- Check `backend.log` for errors

### Frontend won't start
- Check if port 3000 is already in use
- Verify all dependencies are installed (`npm install` in Frontend directory)
- Check `frontend.log` for errors

### API Connection Issues
- Ensure backend is running on port 8080
- Check CORS settings in `backend/server.js`
- Verify `NEXT_PUBLIC_API_BASE_URL` in frontend (defaults to http://localhost:8080)

## Development Mode

- Backend uses `nodemon` for auto-reload (use `npm run dev` instead of `npm start`)
- Frontend uses Next.js hot-reload by default




