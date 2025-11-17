# Force Railway to Use Latest Code

## 🔴 Problem
Railway is still running old code that throws: `"GEMINI_API_KEY is not set in environment variables"`

The new code should throw: `"No API keys found. Set GEMINI_API_KEY_1, GEMINI_API_KEY_2, etc."`

## ✅ Solution: Force Redeploy

### Method 1: Trigger via Git (Recommended)

Make a small change to trigger Railway to redeploy:

```bash
# Make a tiny change to trigger redeploy
echo "# Railway redeploy trigger" >> backend/README.md
git add backend/README.md
git commit -m "Trigger Railway redeploy"
git push origin main
```

Railway should automatically detect the push and redeploy.

### Method 2: Manual Redeploy in Railway Dashboard

1. Go to [Railway Dashboard](https://railway.app)
2. Select your **PSG1** service
3. Go to **Deployments** tab
4. Find the latest deployment
5. Click the **three dots (⋯)** menu
6. Click **"Redeploy"**

### Method 3: Check Railway Git Connection

1. Railway Dashboard → PSG1 → **Settings**
2. Check **"Source"** section
3. Verify it's connected to the correct:
   - Repository
   - Branch (should be `main`)
   - Auto-deploy is enabled

### Method 4: Clear Railway Build Cache

Sometimes Railway caches old builds:

1. Railway Dashboard → PSG1 → **Settings**
2. Look for **"Clear Build Cache"** or similar option
3. Clear cache, then redeploy

---

## ✅ Verify New Code is Running

After redeploy, check Railway logs. You should see:

**✅ New code (correct):**
```
🔧 GeminiClient constructor called
   Individual keys (GEMINI_API_KEY_1, _2, etc.): 6
   Total unique keys: 6
✅ Initialized GeminiClient with 6 API key(s)
```

**❌ Old code (wrong - still crashing):**
```
Error: GEMINI_API_KEY is not set in environment variables
```

---

## 🔍 If Still Not Working

### Check 1: Verify Environment Variables Are Set

1. Railway → PSG1 → **Variables** tab
2. Verify you have:
   - `GEMINI_API_KEY_1`
   - `GEMINI_API_KEY_2`
   - `GEMINI_API_KEY_3`
   - `GEMINI_API_KEY_4`
   - `GEMINI_API_KEY_5`
   - `GEMINI_API_KEY_6`

3. **Click on each one** to verify the value is correct (not empty)

### Check 2: Verify Git Branch

Railway might be watching a different branch:

1. Railway → Settings → Source
2. Make sure branch is `main` (or `master`)
3. If wrong, update it

### Check 3: Check Railway Build Logs

1. Railway → Deployments → Latest deployment
2. Click on it to see build logs
3. Check if it's pulling from the correct commit
4. Look for: `git clone` or `Checking out commit`

---

## 🚀 Quick Fix: Make a Commit to Trigger Deploy

Run this to force Railway to redeploy:

```bash
cd /home/sheheryar/Downloads/AI_PSG/AI-Personal-Safety-Guardian-main
echo "" >> backend/server.js
git add backend/server.js
git commit -m "Trigger Railway redeploy - force update"
git push origin main
```

This will trigger Railway to pull the latest code.

---

## 📝 After Redeploy

Once Railway redeploys with new code:

1. **Check logs** - should show new error message format
2. **Verify keys** - should show "Individual keys: 6"
3. **Test** - Make a request, should work!

---

## 🆘 Still Crashing?

If it's still showing the old error after redeploy:

1. **Wait 2-3 minutes** - Railway might be building
2. **Check build status** - Is it still building or failed?
3. **Check Railway logs** - Look for the actual error
4. **Verify variables** - Double-check all 6 variables are set correctly

