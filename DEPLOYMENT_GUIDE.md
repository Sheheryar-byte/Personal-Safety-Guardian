# Deployment Guide - Multiple Gemini API Keys

## ✅ Code Changes Completed

The `backend/utils/geminiClient.js` has been updated to support:
- **Multiple API keys** (comma-separated)
- **Automatic key rotation** when rate limits (503/429) are hit
- **Smart error handling** - Differentiates between:
  - **429 Quota Exceeded**: Skips key for 24 hours (daily reset)
  - **503 Overloaded**: Retries after 5 minutes (temporary)
- **Retry logic** with exponential backoff
- **Key health tracking** with separate handling for quota vs overload errors

All analysis methods (image, video, audio, text, safe route) now automatically use the retry mechanism.

---

## 🚂 Railway Backend Deployment

### Step 1: Push Code Changes to Git

First, commit and push your code changes:

```bash
git add .
git commit -m "Add multiple API key support with smart quota handling"
git push origin main
```

Railway will automatically detect the push and redeploy.

### Step 2: Update Environment Variable in Railway

1. Go to [Railway Dashboard](https://railway.app)
2. Select your **backend service**
3. Click on the **Variables** tab
4. Find the `GEMINI_API_KEY` variable
5. **Edit** it (or delete and recreate if needed)
6. **Paste all 6 keys separated by commas** (no spaces needed):

```
AIzaSyDstaFyeUm6hOh_0bx_iT_jlT0UpuYTMu4,AIzaSyCT5fPV3hHMLXOSK3EqFOr6RPbVcZKPiDw,AIzaSyA1tX5zgvby7dthDdxHMuiScImKG6bIYEw,AIzaSyDqkbW3HaVq5XutJ6wr28KOPVz0REen5Jk,AIzaSyBNzL0yojFx8Y-ryU7uS3pVx54ZcFfPaYE,AIzaSyC8sjwqfkuR1icB1XqOnywS5AvEhsKlOVY
```

**OR** (with spaces after commas for readability - both work):

```
AIzaSyDstaFyeUm6hOh_0bx_iT_jlT0UpuYTMu4, AIzaSyCT5fPV3hHMLXOSK3EqFOr6RPbVcZKPiDw, AIzaSyA1tX5zgvby7dthDdxHMuiScImKG6bIYEw, AIzaSyDqkbW3HaVq5XutJ6wr28KOPVz0REen5Jk, AIzaSyBNzL0yojFx8Y-ryU7uS3pVx54ZcFfPaYE, AIzaSyC8sjwqfkuR1icB1XqOnywS5AvEhsKlOVY
```

7. **Save** the variable

### Step 3: Verify Other Environment Variables

Make sure these variables are set in Railway:
- `PORT` - Usually auto-set by Railway (or `8080`)
- `NODE_ENV=production`
- `FRONTEND_URL` - Your Vercel frontend URL (e.g., `https://your-app.vercel.app`)

### Step 4: Redeploy (if needed)

Railway should automatically redeploy when you:
- Push code to Git (if connected)
- Update environment variables

If not, click **"Redeploy"** in the Railway dashboard.

### Step 5: Verify Deployment

Check Railway logs. You should see:
```
✅ Initialized GeminiClient with 6 API key(s)
🚀 Server running on port 8080
```

When errors occur, you'll see smart handling:
```
🚫 Key 1 marked as QUOTA EXCEEDED (429) - will skip until daily reset
⏸️ Key 5 marked as rate-limited (503), will retry after 5 minutes
```

---

## ▲ Vercel Frontend Deployment

### Important: Frontend Does NOT Need API Keys

The frontend **does not use Gemini API keys directly**. It only needs:
- `NEXT_PUBLIC_API_BASE_URL` - Points to your Railway backend

### Step 1: Push Code Changes to Git

```bash
cd Frontend
git add .
git commit -m "Update error handling for backend API"
git push origin main
```

Vercel will automatically detect and redeploy.

### Step 2: Verify Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your **frontend project**
3. Go to **Settings** → **Environment Variables**
4. Check that `NEXT_PUBLIC_API_BASE_URL` is set to your Railway backend URL:
   ```
   https://your-backend-name.up.railway.app
   ```
   Or whatever your Railway backend URL is.

### Step 3: Remove Gemini API Key (if present)

If you previously added a `GEMINI_API_KEY` in Vercel:
1. **Delete it** - The frontend doesn't need it
2. The backend handles all Gemini API calls

### Step 4: Redeploy (if needed)

Vercel should auto-deploy on Git push. If not:
1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment

---

## 🧪 Testing After Deployment

### Test Backend (Railway)

1. Check Railway logs for initialization:
   ```
   ✅ Initialized GeminiClient with 6 API key(s)
   ```

2. Test the health endpoint:
   ```bash
   curl https://your-backend.up.railway.app/api/health
   ```
   Should return: `{"status":"ok","message":"AI Personal Safety Guardian API is running"}`

3. Test with a text analysis request (watch logs for key rotation)

### Test Frontend (Vercel)

1. Visit your Vercel URL
2. Try sending a message in the chat
3. Try uploading an image
4. Check that errors are handled gracefully (no crashes)

---

## 📝 How It Works

### Key Rotation Logic

1. **Initialization**: All 6 keys are loaded at startup
2. **Request**: Uses the current key (rotates round-robin)
3. **429 Quota Exceeded**: 
   - Key is marked as quota-exceeded
   - **Skipped for 24 hours** (until daily reset)
   - Automatically switches to next available key
4. **503 Overloaded**: 
   - Key is marked as temporarily rate-limited
   - **Retries after 5 minutes**
   - Automatically switches to next available key
5. **Success**: If a key works, it's used for subsequent requests

### Error Handling

- **429 errors**: Keys are skipped entirely until daily quota reset
- **503 errors**: Keys are retried after 5-minute cooldown
- **Other errors**: Logged but don't trigger key rotation

---

## 🔍 Monitoring

### Railway Logs - What to Look For

**Good signs:**
- `✅ Initialized GeminiClient with 6 API key(s)` - All keys loaded
- `✅ Key X is working again` - A previously rate-limited key recovered
- `🔄 Key X is now available again` - Cooldown expired

**Expected behavior:**
- `🚫 Key X marked as QUOTA EXCEEDED (429)` - Will skip for 24 hours
- `⏸️ Key X marked as rate-limited (503)` - Will retry in 5 minutes
- `⚠️ All keys unavailable: X quota-exceeded, Y rate-limited` - System is handling overload

**Problems:**
- `❌ Non-rate-limit error on key X` - Auth or invalid request (check API key)
- `All API keys have exceeded their quota` - Need more keys or wait for reset

---

## ⚠️ Important Notes

### Security
- **Never commit API keys to Git** - Always use environment variables
- **Railway**: API keys are encrypted at rest
- **Vercel**: Only needs backend URL, not API keys

### Quota Management
- Each key has its own quota (usually 15 req/min, 1500/day for free tier)
- This system helps distribute load but doesn't increase total quota
- **429 errors** mean the key's daily quota is exhausted
- **503 errors** are temporary server overload (retry works)

### Cooldown Times
- **503 Overload**: 5 minutes (adjustable in `geminiClient.js`)
- **429 Quota**: 24 hours (until daily reset, usually midnight Pacific)

### Adding More Keys
To add more keys in the future:
1. Add them to Railway `GEMINI_API_KEY` variable (comma-separated)
2. Redeploy backend
3. No frontend changes needed

---

## 🚀 Quick Reference

### Railway Backend
- **Dashboard**: https://railway.app
- **Variable to update**: `GEMINI_API_KEY`
- **Format**: `key1,key2,key3,key4,key5,key6` (comma-separated)
- **Auto-redeploy**: Yes (on env var change or Git push)

### Vercel Frontend
- **Dashboard**: https://vercel.com
- **Variable needed**: `NEXT_PUBLIC_API_BASE_URL` (Railway backend URL)
- **API keys needed**: None (frontend doesn't use Gemini directly)
- **Auto-redeploy**: Yes (on Git push)

### Your Current Keys
```
1. AIzaSyDstaFyeUm6hOh_0bx_iT_jlT0UpuYTMu4
2. AIzaSyCT5fPV3hHMLXOSK3EqFOr6RPbVcZKPiDw
3. AIzaSyA1tX5zgvby7dthDdxHMuiScImKG6bIYEw
4. AIzaSyDqkbW3HaVq5XutJ6wr28KOPVz0REen5Jk
5. AIzaSyBNzL0yojFx8Y-ryU7uS3pVx54ZcFfPaYE
6. AIzaSyC8sjwqfkuR1icB1XqOnywS5AvEhsKlOVY
```

---

## 🆘 Troubleshooting

### Backend shows "1 API key(s)" instead of 6
- Check Railway environment variable is set correctly
- Make sure keys are comma-separated (no line breaks)
- Redeploy after updating variable

### All keys showing quota exceeded
- Wait for daily quota reset (usually midnight Pacific)
- Check quota status: https://ai.dev/usage?tab=rate-limit
- Consider getting new API keys or upgrading to paid tier

### Frontend can't connect to backend
- Verify `NEXT_PUBLIC_API_BASE_URL` in Vercel points to Railway URL
- Check Railway backend is running (check logs)
- Verify CORS settings in backend allow Vercel domain

### 503 errors persisting
- This is normal - Google's servers are temporarily overloaded
- System will automatically retry with different keys
- Wait a few minutes and try again
