# Deployment Guide for contesthub.dev

## 1. Deploy on Render

### Deploy Backend:
1. Go to https://dashboard.render.com → "New +" → "Web Service"
2. Connect your GitHub repo (Finalized_DB)
3. Configure:
   - **Name**: `contesthub-backend`
   - **Branch**: `main`
   - **Root Directory**: `Finalized_DB/Backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
4. Click "Deploy"
5. **Wait for it to finish** and copy the URL (looks like: `https://contesthub-backend.onrender.com`)

### Deploy Frontend:
1. Go to https://dashboard.render.com → "New +" → "Web Service"
2. Connect your GitHub repo again
3. Configure:
   - **Name**: `contesthub-frontend`
   - **Branch**: `main`
   - **Root Directory**: `Finalized_DB/frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm install -g serve && serve -s dist -l 3000`
   - **Instance Type**: Free
   - **Environment Variables**:
     ```
     VITE_API_URL = https://contesthub-backend.onrender.com
     ```
4. Click "Deploy"

**Note**: Render free tier takes 50 seconds to spin up after inactivity. Plan accordingly.

---

## 2. Connect contesthub.dev to Frontend

### On Render:
1. Go to your **Frontend** service dashboard
2. Scroll down to "Custom Domain"
3. Enter: `contesthub.dev`
4. Click "Add Custom Domain"
5. You'll see a CNAME record like: `onrender.com`
6. **Copy this - you'll need it next**

### At Your Domain Registrar (Where you registered contesthub.dev):

#### Option A: Root Domain (contesthub.dev)
1. Go to your DNS settings
2. Add a CNAME record:
   - **Type**: CNAME
   - **Name**: `@` (or leave blank)
   - **Value**: `onrender.com` (or whatever Render gave you)
   - **TTL**: 3600 or default

#### Option B: Subdomain (app.contesthub.dev) - Alternative
If root domain doesn't work:
   - **Name**: `app`
   - **Value**: Same CNAME value

3. **Save** and wait 5-30 minutes for DNS to update

---

## 3. Verify Everything Works

1. Visit: `https://contesthub.dev`
2. Try to sign up
3. Check browser console for errors (F12)
4. If you see API errors, verify:
   - Backend is running on Render
   - `VITE_API_URL` is set correctly in Frontend

---

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Cannot reach contesthub.dev" | Wait 5-30 min for DNS, then clear browser cache |
| API calls fail | Check `VITE_API_URL` environment variable in Frontend settings |
| Blank page | Check browser console (F12) for errors |
| Backend taking time to respond | Free tier takes 50s to wake up after inactivity |

---

## Redeploy After Code Changes

After you push new code to GitHub:
1. Render auto-deploys within 1-2 minutes
2. Check deployment status in Render dashboard
3. Frontend may need 50s to load after inactivity

---

## Next Steps
- Monitor your app at: https://contesthub.dev
- Check logs: Render Dashboard → Service → Logs
- Scale up to paid tier if needed
