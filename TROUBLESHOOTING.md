# Troubleshooting: Frontend Not Connecting to Backend

## Problem: Frontend shows errors but backend has no request logs

This means requests aren't reaching your backend. Here's how to fix it:

---

## ✅ Step 1: Verify Vercel Environment Variable

Your frontend needs to know where your backend is located.

1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your **frontend project**
3. Go to **Settings** → **Environment Variables**
4. Check if `NEXT_PUBLIC_API_BASE_URL` exists
5. **It should be set to your Railway backend URL:**
   ```
   https://psg1-production.up.railway.app
   ```
   (Replace with your actual Railway URL)

### If it's missing or wrong:
1. Click **"Add New"**
2. **Key**: `NEXT_PUBLIC_API_BASE_URL`
3. **Value**: Your Railway backend URL (from Railway dashboard)
4. **Environment**: Production, Preview, Development (select all)
5. Click **"Save"**
6. **Redeploy** your frontend

---

## ✅ Step 2: Find Your Railway Backend URL

1. Go to [Railway Dashboard](https://railway.app)
2. Select your **backend service** (PSG1)
3. Click on the service card
4. You'll see the URL like: `psg1-production.up.railway.app`
5. Copy the **full URL** including `https://`

---

## ✅ Step 3: Test Backend Connection

After updating the environment variable, test if the backend is reachable:

### Option A: Test in Browser
Open this URL in your browser:
```
https://your-railway-url.up.railway.app/api/health
```

You should see:
```json
{
  "status": "ok",
  "message": "AI Personal Safety Guardian API is running",
  "timestamp": "...",
  "environment": "production"
}
```

### Option B: Test from Vercel
After redeploying Vercel with the correct `NEXT_PUBLIC_API_BASE_URL`, check the browser console (F12) for errors.

---

## ✅ Step 4: Push Updated Backend Code

I've added request logging to help debug. Push these changes:

```bash
git add backend/server.js
git commit -m "Add request logging and improved CORS handling"
git push origin main
```

Railway will auto-deploy. After deployment, you should see request logs like:
```
📥 POST /api/text-analysis - 2025-11-18T...
   Origin: https://your-app.vercel.app
   User-Agent: Mozilla/5.0...
```

---

## ✅ Step 5: Check Railway Logs

After pushing the code and testing from Vercel:

1. Go to Railway → Your Service → **Logs** tab
2. Try an action in your Vercel frontend
3. You should now see:
   - `📥 POST /api/text-analysis` (or whatever endpoint)
   - `   Origin: https://your-vercel-url.vercel.app`
   - Any errors that occur

**If you still don't see any logs:**
- The frontend is not sending requests to the backend
- Check browser console (F12) for errors
- Verify `NEXT_PUBLIC_API_BASE_URL` is set correctly in Vercel

---

## 🔍 Common Issues

### Issue 1: "Failed to analyze image" / "Sorry, I encountered an error"

**Cause**: Frontend can't reach backend

**Fix**:
1. Check `NEXT_PUBLIC_API_BASE_URL` in Vercel
2. Make sure it's `https://your-railway-url.up.railway.app` (not `http://localhost:8080`)
3. Redeploy Vercel after updating

### Issue 2: CORS errors in browser console

**Cause**: Backend not allowing Vercel domain

**Fix**: 
- I've updated the CORS configuration to allow all Vercel domains
- Push the updated `server.js` to Railway
- The new code automatically allows `*.vercel.app` domains

### Issue 3: Backend shows no logs

**Cause**: Requests not reaching backend

**Possible reasons**:
- Wrong `NEXT_PUBLIC_API_BASE_URL` in Vercel
- Network/firewall blocking
- Frontend using wrong API endpoint

**Fix**:
1. Verify Railway URL is correct
2. Test health endpoint directly in browser
3. Check browser console for network errors
4. Verify frontend code is using the environment variable

---

## 🧪 Quick Test Checklist

- [ ] Railway backend is running (check logs show "Server running")
- [ ] Railway backend URL is accessible (test `/api/health` in browser)
- [ ] Vercel has `NEXT_PUBLIC_API_BASE_URL` set to Railway URL
- [ ] Vercel has been redeployed after setting environment variable
- [ ] Browser console (F12) shows no CORS errors
- [ ] Railway logs show incoming requests (after code update)

---

## 📝 Your Current Setup

Based on the images:

**Railway Backend:**
- Service: PSG1
- URL: `psg1-production.up.railway.app`
- Status: Running ✅

**Vercel Frontend:**
- URL: `personal-safety-guardian-git-main-sheheryar-ahmads-projects.vercel.app`
- Status: Deployed but showing errors ❌

**Action Needed:**
1. Set `NEXT_PUBLIC_API_BASE_URL` in Vercel to: `https://psg1-production.up.railway.app`
2. Redeploy Vercel
3. Push updated backend code with logging
4. Test again

---

## 🆘 Still Not Working?

If requests still don't appear in Railway logs:

1. **Check browser Network tab (F12)**:
   - Open DevTools → Network tab
   - Try an action in the frontend
   - Look for failed requests
   - Check the request URL - is it pointing to Railway?

2. **Check Vercel Function Logs**:
   - Vercel uses Next.js API routes (`/app/api/*`)
   - These routes proxy to your backend
   - Check Vercel logs for errors in these routes

3. **Verify Environment Variable is Loaded**:
   - In Vercel, the variable must start with `NEXT_PUBLIC_` to be available in the browser
   - Make sure it's set for the correct environment (Production)

4. **Test Direct Connection**:
   ```bash
   curl https://psg1-production.up.railway.app/api/health
   ```
   Should return JSON response

