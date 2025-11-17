# Railway vs Local - What's Different?

## ✅ Local (Working)
Your local setup shows:
- ✅ 6 keys loaded correctly
- ✅ Keys 1-4: Quota exceeded (429) - normal, will reset daily
- ✅ Key 5: **WORKING** ✅
- ✅ System automatically rotates to working keys

## ❌ Railway (Not Working)
The issue is likely one of these:

---

## 🔍 Issue 1: Environment Variable Not Set in Railway

**Check:**
1. Go to Railway Dashboard → PSG1 → **Variables** tab
2. Look for `GEMINI_API_KEY`
3. **Is it there?** If not, that's the problem!

**Fix:**
- Add `GEMINI_API_KEY` with all 6 keys comma-separated (same as your local `.env`)

---

## 🔍 Issue 2: Environment Variable Format Wrong in Railway

**Check:**
1. Railway → Variables → Click on `GEMINI_API_KEY` to view
2. **Is it on one line?** (should be comma-separated, not multiple lines)
3. **Does it have all 6 keys?** (should match your local `.env`)

**Common mistakes:**
- ❌ Keys on separate lines
- ❌ Missing commas
- ❌ Extra quotes around the value
- ❌ Only 1 key instead of 6

**Fix:**
Copy the exact value from your local `.env` file and paste it into Railway.

---

## 🔍 Issue 3: Railway Has Old Code

**Check Railway Deploy Logs:**
Look for these messages:
```
🔍 Checking environment variables...
   GEMINI_API_KEY: Found (6 key(s))
🔧 GeminiClient constructor called
✅ Initialized GeminiClient with 6 API key(s)
```

**If you DON'T see these:**
- Railway is running old code
- Force a redeploy: Railway → Deployments → Redeploy

---

## 🔍 Issue 4: Keys Are Actually Invalid on Railway

Even if the variable is set, the keys might be:
- Revoked in Google Cloud Console
- Different keys than your local (if you updated local but not Railway)
- Expired or disabled

**Check:**
- Visit `/api/test-keys` endpoint on Railway (after deploying the new code)
- This will test each key individually

---

## ✅ Quick Fix Steps

### Step 1: Verify Railway Environment Variable

1. Railway Dashboard → PSG1 → **Variables**
2. Check `GEMINI_API_KEY` exists
3. **Copy the exact value** from your local `.env` file:
   ```
   AIzaSyDstaFyeUm6hOh_0bx_iT_jlT0UpuYTMu4,AIzaSyCT5fPV3hHMLXOSK3EqFOr6RPbVcZKPiDw,AIzaSyA1tX5zgvby7dthDdxHMuiScImKG6bIYEw,AIzaSyDqkbW3HaVq5XutJ6wr28KOPVz0REen5Jk,AIzaSyBNzL0yojFx8Y-ryU7uS3pVx54ZcFfPaYE,AIzaSyC8sjwqfkuR1icB1XqOnywS5AvEhsKlOVY
   ```
4. Paste it into Railway (one line, no quotes)
5. Save

### Step 2: Push Latest Code

```bash
git add backend/server.js backend/utils/geminiClient.js
git commit -m "Add API key test endpoint and enhanced debugging"
git push origin main
```

### Step 3: Check Railway Logs After Deploy

After Railway redeploys, check logs. You should see:
```
🔍 Checking environment variables...
   GEMINI_API_KEY: Found (6 key(s))
🔧 GeminiClient constructor called
✅ Initialized GeminiClient with 6 API key(s)
   Key 1: AIzaSy...TMu4 (length: 39)
   ...
```

### Step 4: Test the Keys

After deploying, visit:
```
https://your-railway-url.up.railway.app/api/test-keys
```

This will show you which keys are valid/invalid.

---

## 🎯 Most Likely Issue

Based on your local working setup, the most likely issue is:

**Railway doesn't have the `GEMINI_API_KEY` environment variable set, OR it's set incorrectly.**

**Solution:**
1. Copy the exact value from your local `.env` file
2. Paste it into Railway Variables
3. Make sure it's on ONE line, comma-separated
4. Save and wait for auto-redeploy

---

## 📊 Expected Behavior After Fix

Once Railway has the correct environment variable:

1. **On startup:** You'll see all 6 keys loaded
2. **On request:** System tries keys 1-4 (quota exceeded), then uses key 5 (working)
3. **In logs:** You'll see the same rotation behavior as local

---

## 🧪 Test Endpoints

After deploying the new code, you can test:

1. **Health Check:**
   ```
   https://your-railway-url.up.railway.app/api/health
   ```
   Shows: Key count, environment info

2. **Test Keys:**
   ```
   https://your-railway-url.up.railway.app/api/test-keys
   ```
   Shows: Which keys are valid/invalid

---

## 🔑 Key Points

- **Local works** = Your keys are valid, code is correct
- **Railway doesn't work** = Environment variable issue
- **Solution** = Copy exact `.env` value to Railway Variables

The code is the same, the only difference is the environment variable configuration!

