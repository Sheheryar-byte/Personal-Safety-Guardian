# Deployment Guide - Multiple Gemini API Keys

## ✅ Code Changes Completed

The `backend/utils/geminiClient.js` has been updated to support:
- **Multiple API keys** (comma-separated)
- **Automatic key rotation** when rate limits (503/429) are hit
- **Retry logic** with exponential backoff
- **Key health tracking** (temporary blacklist for rate-limited keys with 5-minute cooldown)

All analysis methods (image, video, audio, text, safe route) now automatically use the retry mechanism.

---

## 🔧 Railway Backend Configuration

### Step 1: Update Environment Variable

In your Railway dashboard:

1. Go to your backend service → **Variables** tab
2. **Delete** the existing `GEMINI_API_KEY` variable (if it exists)
3. **Add a new variable** with:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: All 6 keys separated by commas (no spaces, or with spaces - both work):
     ```
     AIzaSyDstaFyeUm6hOh_0bx_iT_jlT0UpuYTMu4,AIzaSyCT5fPV3hHMLXOSK3EqFOr6RPbVcZKPiDw,AIzaSyA1tX5zgvby7dthDdxHMuiScImKG6bIYEw,AIzaSyDqkbW3HaVq5XutJ6wr28KOPVz0REen5Jk,AIzaSyBNzL0yojFx8Y-ryU7uS3pVx54ZcFfPaYE,AIzaSyC8sjwqfkuR1icB1XqOnywS5AvEhsKlOVY
     ```

   **OR** (with spaces after commas for readability):
   ```
   AIzaSyDstaFyeUm6hOh_0bx_iT_jlT0UpuYTMu4, AIzaSyCT5fPV3hHMLXOSK3EqFOr6RPbVcZKPiDw, AIzaSyA1tX5zgvby7dthDdxHMuiScImKG6bIYEw, AIzaSyDqkbW3HaVq5XutJ6wr28KOPVz0REen5Jk, AIzaSyBNzL0yojFx8Y-ryU7uS3pVx54ZcFfPaYE, AIzaSyC8sjwqfkuR1icB1XqOnywS5AvEhsKlOVY
   ```

4. **Keep other variables** as they were:
   - `PORT=8080` (or Railway's auto-assigned port)
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://personal-safety-guardian.vercel.app`

### Step 2: Redeploy

After updating the environment variable:
- Railway will automatically redeploy, OR
- Click **"Redeploy"** in the Railway dashboard

### Step 3: Verify

Check the Railway logs. You should see:
```
✅ Initialized GeminiClient with 6 API key(s)
```

When a rate limit is hit, you'll see:
```
⚠️ Rate limit hit on key 1 (attempt 1/6): [503 Service Unavailable]...
⏸️ Key 1 marked as rate-limited, will retry after cooldown
```

Then it will automatically try the next key.

---

## 🌐 Vercel Frontend Configuration

**No changes needed!** This is a backend-only change. Your frontend doesn't need any updates.

Just make sure your `NEXT_PUBLIC_API_BASE_URL` in Vercel points to your Railway backend:
```
https://psg1-production.up.railway.app
```

---

## 🧪 Testing

1. **Test with a single request** - should work normally
2. **Test with rapid requests** - when one key hits rate limit, it should automatically switch to the next
3. **Check Railway logs** - you'll see key rotation messages

---

## 📝 How It Works

1. **Initialization**: All 6 keys are loaded at startup
2. **Request**: Uses the current key (rotates round-robin)
3. **Rate Limit Hit (503/429)**: 
   - Current key is marked as rate-limited
   - Automatically switches to next available key
   - Retries the request
4. **Cooldown**: Rate-limited keys are blacklisted for 5 minutes, then automatically re-enabled
5. **Success**: If a key works, it's used for subsequent requests

---

## 🔍 Monitoring

Watch Railway logs for:
- `✅ Key X is working again` - A previously rate-limited key recovered
- `🔄 Key X is now available again` - Cooldown expired
- `⚠️ Rate limit hit on key X` - Automatic rotation happening
- `❌ Non-rate-limit error on key X` - Auth or other error (won't retry)

---

## ⚠️ Important Notes

- **Security**: Never commit API keys to Git. Always use environment variables.
- **Quota**: Each key still has its own quota. This system helps distribute load but doesn't increase total quota.
- **Cooldown**: Rate-limited keys are blacklisted for 5 minutes. Adjust `rateLimitCooldown` in `geminiClient.js` if needed.

---

## 🚀 Quick Command Reference

If using Railway CLI to set the variable:

```bash
# Note: Railway CLI doesn't support setting variables directly
# Use the dashboard instead, or use Railway's API
```

**Use the Railway Dashboard** (easiest method) to update the `GEMINI_API_KEY` variable.

