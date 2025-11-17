# Quick Fix: API Key Invalid Error

## 🔴 Current Issue
Railway is showing "API key not valid" error. The updated code with better error handling hasn't been deployed yet.

## ✅ Step-by-Step Fix

### Step 1: Verify Code is Committed

```bash
cd /home/sheheryar/Downloads/AI_PSG/AI-Personal-Safety-Guardian-main
git status
```

If you see modified files, commit them:
```bash
git add backend/utils/geminiClient.js
git commit -m "Add API key validation and debugging"
git push origin main
```

### Step 2: Verify Railway Environment Variable

1. Go to [Railway Dashboard](https://railway.app)
2. Select **PSG1** service
3. Click **Variables** tab
4. Check `GEMINI_API_KEY` exists
5. **Click to view** the value

**It should be exactly this (one line, comma-separated):**

```
AIzaSyDstaFyeUm6hOh_0bx_iT_jlT0UpuYTMu4,AIzaSyCT5fPV3hHMLXOSK3EqFOr6RPbVcZKPiDw,AIzaSyA1tX5zgvby7dthDdxHMuiScImKG6bIYEw,AIzaSyDqkbW3HaVq5XutJ6wr28KOPVz0REen5Jk,AIzaSyBNzL0yojFx8Y-ryU7uS3pVx54ZcFfPaYE,AIzaSyC8sjwqfkuR1icB1XqOnywS5AvEhsKlOVY
```

**If it's wrong:**
1. Delete the variable
2. Add new one with the exact value above
3. Save (Railway will auto-redeploy)

### Step 3: Check Railway Logs After Deployment

After Railway redeploys, check the **Deploy Logs** or **HTTP Logs**. You should see:

```
✅ Initialized GeminiClient with 6 API key(s)
   Key 1: AIzaSy...TMu4 (length: 39)
   Key 2: AIzaSy...PiDw (length: 39)
   Key 3: AIzaSy...YEw (length: 39)
   Key 4: AIzaSy...en5Jk (length: 39)
   Key 5: AIzaSy...PaYE (length: 39)
   Key 6: AIzaSy...KlOVY (length: 39)
```

**If you DON'T see this:**
- Environment variable is not set
- Keys are not being parsed correctly
- Check the variable format again

### Step 4: Test and Check Logs

1. Make a request from your Vercel frontend
2. Check Railway logs - you should now see:

```
🔑 Attempting with key 1/6: AIzaSy...TMu4
❌ Key 1 failed: Status 400 - API key not valid...
🚫 Key 1 is INVALID (400 Bad Request) - API key not valid. Trying next key...
🔑 Attempting with key 2/6: AIzaSy...PiDw
```

### Step 5: If All Keys Are Invalid

If all 6 keys show as invalid:

1. **Verify keys are valid** in [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Check if keys were revoked** or disabled
3. **Create new keys** if needed:
   - Go to Google AI Studio
   - Create new API keys
   - Update Railway with new keys

---

## 🔍 What to Check in Railway Logs

### ✅ Good Signs:
- `✅ Initialized GeminiClient with 6 API key(s)` - Keys loaded
- `🔑 Attempting with key X/6` - System trying keys
- `✅ Request succeeded with key X` - A key worked!

### ❌ Bad Signs:
- `Initialized GeminiClient with 0 API key(s)` - No keys found
- `Initialized GeminiClient with 1 API key(s)` - Only one key loaded
- `All API keys are invalid` - All keys rejected by Google
- No initialization message at all - Environment variable not set

---

## 🎯 Most Common Issues

### Issue 1: Keys on Separate Lines
**Wrong:**
```
AIzaSyDstaFyeUm6hOh_0bx_iT_jlT0UpuYTMu4
AIzaSyCT5fPV3hHMLXOSK3EqFOr6RPbVcZKPiDw
```

**Correct:**
```
AIzaSyDstaFyeUm6hOh_0bx_iT_jlT0UpuYTMu4,AIzaSyCT5fPV3hHMLXOSK3EqFOr6RPbVcZKPiDw,...
```

### Issue 2: Variable Not Set
- Check Railway Variables tab
- Make sure `GEMINI_API_KEY` exists (not `GEMINI_API_KEYS`)

### Issue 3: Keys Are Actually Invalid
- Keys might have been revoked
- Keys might not be activated
- Check in Google Cloud Console

---

## 📝 Quick Checklist

- [ ] Code is committed and pushed to Git
- [ ] Railway has `GEMINI_API_KEY` variable set
- [ ] Variable value is all 6 keys comma-separated on one line
- [ ] Railway has redeployed after variable update
- [ ] Railway logs show "Initialized GeminiClient with 6 API key(s)"
- [ ] Test request from Vercel
- [ ] Check Railway logs show key attempts

---

## 🆘 Still Not Working?

1. **Check Railway Deploy Logs** - Look for initialization message
2. **Check Railway HTTP Logs** - Look for incoming requests
3. **Verify keys manually** - Test one key with curl (see API_KEY_TROUBLESHOOTING.md)
4. **Check Google Cloud Console** - Verify keys are enabled

