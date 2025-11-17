# API Key Invalid Error - Troubleshooting Guide

## 🔴 Error: "API key not valid. Please pass a valid API key."

This means the API keys in Railway are either:
1. **Not set correctly** (wrong format, extra spaces, line breaks)
2. **Invalid/revoked** (keys were deleted or disabled)
3. **Not loaded** (environment variable not set)

---

## ✅ Step 1: Verify Keys in Railway

1. Go to [Railway Dashboard](https://railway.app)
2. Select your **backend service** (PSG1)
3. Click on **Variables** tab
4. Find `GEMINI_API_KEY`
5. **Click to view/edit** the value

### Check the Format

The value should be **exactly** this (all on one line, comma-separated, no quotes):

```
AIzaSyDstaFyeUm6hOh_0bx_iT_jlT0UpuYTMu4,AIzaSyCT5fPV3hHMLXOSK3EqFOr6RPbVcZKPiDw,AIzaSyA1tX5zgvby7dthDdxHMuiScImKG6bIYEw,AIzaSyDqkbW3HaVq5XutJ6wr28KOPVz0REen5Jk,AIzaSyBNzL0yojFx8Y-ryU7uS3pVx54ZcFfPaYE,AIzaSyC8sjwqfkuR1icB1XqOnywS5AvEhsKlOVY
```

### Common Issues:

❌ **Wrong**: Keys on separate lines
```
AIzaSyDstaFyeUm6hOh_0bx_iT_jlT0UpuYTMu4
AIzaSyCT5fPV3hHMLXOSK3EqFOr6RPbVcZKPiDw
```

✅ **Correct**: Keys on one line, comma-separated
```
AIzaSyDstaFyeUm6hOh_0bx_iT_jlT0UpuYTMu4,AIzaSyCT5fPV3hHMLXOSK3EqFOr6RPbVcZKPiDw,...
```

❌ **Wrong**: Extra quotes
```
"AIzaSyDstaFyeUm6hOh_0bx_iT_jlT0UpuYTMu4,AIzaSyCT5fPV3hHMLXOSK3EqFOr6RPbVcZKPiDw"
```

✅ **Correct**: No quotes
```
AIzaSyDstaFyeUm6hOh_0bx_iT_jlT0UpuYTMu4,AIzaSyCT5fPV3hHMLXOSK3EqFOr6RPbVcZKPiDw
```

❌ **Wrong**: Extra spaces around commas
```
AIzaSyDstaFyeUm6hOh_0bx_iT_jlT0UpuYTMu4 , AIzaSyCT5fPV3hHMLXOSK3EqFOr6RPbVcZKPiDw
```

✅ **Correct**: No spaces (or spaces are fine, code trims them)
```
AIzaSyDstaFyeUm6hOh_0bx_iT_jlT0UpuYTMu4,AIzaSyCT5fPV3hHMLXOSK3EqFOr6RPbVcZKPiDw
```

---

## ✅ Step 2: Update the Keys in Railway

If the format is wrong:

1. **Delete** the existing `GEMINI_API_KEY` variable
2. **Add a new one** with:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Paste all 6 keys comma-separated (see format above)
3. **Save**
4. Railway will **auto-redeploy**

---

## ✅ Step 3: Check Railway Logs After Redeploy

After Railway redeploys, check the logs. You should see:

```
✅ Initialized GeminiClient with 6 API key(s)
   Key 1: AIzaSy...TMu4 (length: 39)
   Key 2: AIzaSy...PiDw (length: 39)
   Key 3: AIzaSy...YEw (length: 39)
   Key 4: AIzaSy...en5Jk (length: 39)
   Key 5: AIzaSy...PaYE (length: 39)
   Key 6: AIzaSy...KlOVY (length: 39)
```

**If you see:**
- `Initialized GeminiClient with 1 API key(s)` → Only one key is being loaded
- `Initialized GeminiClient with 0 API key(s)` → No keys found
- Different lengths → Keys might be corrupted

---

## ✅ Step 4: Test with a Request

After redeploying, try a request from your Vercel frontend. Check Railway logs - you should see:

```
🔑 Attempting with key 1/6: AIzaSy...TMu4
❌ Key 1 failed: Status 400 - API key not valid...
🚫 Key 1 is INVALID (400 Bad Request) - API key not valid. Trying next key...
🔑 Attempting with key 2/6: AIzaSy...PiDw
```

The system will now **automatically try all 6 keys** if one is invalid.

---

## 🔍 Verify API Keys Are Valid

### Option 1: Test Keys Manually

You can test if a key is valid using curl:

```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=YOUR_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Say hello"}]}]}'
```

Replace `YOUR_API_KEY` with one of your keys. If it returns JSON, the key is valid. If it returns an error about invalid key, the key is bad.

### Option 2: Check in Google Cloud Console

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Check if your API keys are listed
3. Verify they're **enabled** and **not revoked**

---

## 🆘 If All Keys Are Invalid

If all 6 keys show as invalid:

1. **Check if keys were revoked** in Google Cloud Console
2. **Verify you copied the keys correctly** (no extra characters)
3. **Create new API keys** if needed:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create new API keys
   - Update Railway with the new keys

---

## 📝 Your Current Keys

Make sure these exact keys are in Railway (comma-separated, one line):

```
AIzaSyDstaFyeUm6hOh_0bx_iT_jlT0UpuYTMu4,AIzaSyCT5fPV3hHMLXOSK3EqFOr6RPbVcZKPiDw,AIzaSyA1tX5zgvby7dthDdxHMuiScImKG6bIYEw,AIzaSyDqkbW3HaVq5XutJ6wr28KOPVz0REen5Jk,AIzaSyBNzL0yojFx8Y-ryU7uS3pVx54ZcFfPaYE,AIzaSyC8sjwqfkuR1icB1XqOnywS5AvEhsKlOVY
```

---

## ✅ After Fixing

1. **Push the updated code** (with better error handling):
   ```bash
   git add backend/utils/geminiClient.js
   git commit -m "Add API key validation and better error handling"
   git push origin main
   ```

2. **Update Railway environment variable** (if needed)

3. **Wait for Railway to redeploy**

4. **Test from Vercel frontend**

5. **Check Railway logs** - you should see which keys are being tried and which ones work

---

## 🎯 Expected Behavior After Fix

- System tries all 6 keys automatically
- Invalid keys are skipped
- Valid keys are used
- Better error messages in logs
- Frontend shows user-friendly errors instead of crashing

