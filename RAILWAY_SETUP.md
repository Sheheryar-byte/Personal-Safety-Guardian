# Railway Setup - Multiple API Keys

## ✅ Solution: Use Individual Environment Variables

Since Railway's UI doesn't handle comma-separated values well, we now support **individual environment variables**.

---

## 📝 Step-by-Step Setup in Railway

### Step 1: Go to Railway Variables

1. Open [Railway Dashboard](https://railway.app)
2. Select your **PSG1** service
3. Click on **Variables** tab

### Step 2: Delete Old Variable (if exists)

1. If you have `GEMINI_API_KEY` with comma-separated values, **delete it**
2. We'll use individual variables instead

### Step 3: Add Individual Variables

Add these **6 separate variables**:

| Variable Name | Value |
|--------------|-------|
| `GEMINI_API_KEY_1` | `AIzaSyDstaFyeUm6hOh_0bx_iT_jlT0UpuYTMu4` |
| `GEMINI_API_KEY_2` | `AIzaSyCT5fPV3hHMLXOSK3EqFOr6RPbVcZKPiDw` |
| `GEMINI_API_KEY_3` | `AIzaSyA1tX5zgvby7dthDdxHMuiScImKG6bIYEw` |
| `GEMINI_API_KEY_4` | `AIzaSyDqkbW3HaVq5XutJ6wr28KOPVz0REen5Jk` |
| `GEMINI_API_KEY_5` | `AIzaSyBNzL0yojFx8Y-ryU7uS3pVx54ZcFfPaYE` |
| `GEMINI_API_KEY_6` | `AIzaSyC8sjwqfkuR1icB1XqOnywS5AvEhsKlOVY` |

**How to add each:**
1. Click **"New Variable"** or **"Add Variable"**
2. **Key**: `GEMINI_API_KEY_1`
3. **Value**: `AIzaSyDstaFyeUm6hOh_0bx_iT_jlT0UpuYTMu4`
4. Click **Save**
5. Repeat for keys 2-6

### Step 4: Verify

After adding all 6 variables, Railway will auto-redeploy. Check the logs - you should see:

```
🔧 GeminiClient constructor called
   Individual keys (GEMINI_API_KEY_1, _2, etc.): 6
   Comma-separated keys (GEMINI_API_KEY): 0
   Total unique keys: 6
✅ Initialized GeminiClient with 6 API key(s)
   Key 1: AIzaSy...TMu4 (length: 39)
   Key 2: AIzaSy...PiDw (length: 39)
   ...
```

---

## 🔄 How It Works

The code now supports **both methods**:

### Method 1: Individual Variables (Railway) ✅
```
GEMINI_API_KEY_1=key1
GEMINI_API_KEY_2=key2
GEMINI_API_KEY_3=key3
...
```

### Method 2: Comma-Separated (Local .env) ✅
```
GEMINI_API_KEY=key1,key2,key3,key4,key5,key6
```

**Priority:** Individual variables are checked first, then comma-separated. This means:
- **Railway**: Use individual variables (GEMINI_API_KEY_1, _2, etc.)
- **Local**: Keep using comma-separated in `.env` file (works fine)

---

## ✅ Your Local Setup (No Changes Needed)

Your local `.env` file can stay the same:
```env
GEMINI_API_KEY=AIzaSyDstaFyeUm6hOh_0bx_iT_jlT0UpuYTMu4,AIzaSyCT5fPV3hHMLXOSK3EqFOr6RPbVcZKPiDw,AIzaSyA1tX5zgvby7dthDdxHMuiScImKG6bIYEw,AIzaSyDqkbW3HaVq5XutJ6wr28KOPVz0REen5Jk,AIzaSyBNzL0yojFx8Y-ryU7uS3pVx54ZcFfPaYE,AIzaSyC8sjwqfkuR1icB1XqOnywS5AvEhsKlOVY
```

This will continue to work because the code supports both methods!

---

## 🚀 After Setup

1. **Push the updated code:**
   ```bash
   git add backend/utils/geminiClient.js
   git commit -m "Support individual environment variables for Railway"
   git push origin main
   ```

2. **Add the 6 variables in Railway** (as shown above)

3. **Wait for Railway to redeploy**

4. **Check logs** - should show 6 keys loaded

5. **Test** - Make a request from Vercel, should work!

---

## 🧪 Testing

After setup, test the health endpoint:
```
https://psg1-production.up.railway.app/api/health
```

Should show:
```json
{
  "status": "ok",
  "environment": {
    "geminiKeysConfigured": 6,
    "geminiKeySet": true
  }
}
```

---

## 📋 Quick Checklist

- [ ] Delete old `GEMINI_API_KEY` variable in Railway (if it exists)
- [ ] Add `GEMINI_API_KEY_1` with first key
- [ ] Add `GEMINI_API_KEY_2` with second key
- [ ] Add `GEMINI_API_KEY_3` with third key
- [ ] Add `GEMINI_API_KEY_4` with fourth key
- [ ] Add `GEMINI_API_KEY_5` with fifth key
- [ ] Add `GEMINI_API_KEY_6` with sixth key
- [ ] Push updated code to Git
- [ ] Wait for Railway to redeploy
- [ ] Check logs show 6 keys loaded
- [ ] Test from Vercel frontend

---

## 🎯 Why This Works

Railway's UI has issues with:
- ❌ Comma-separated values in a single variable
- ❌ Multi-line values
- ✅ Individual variables (works perfectly!)

By using individual variables, we avoid Railway's parsing issues while keeping compatibility with local `.env` files.

