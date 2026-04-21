# Render Deployment Guide

## Prerequisites
- Render account (https://render.com)
- Your custom domain
- This GitHub repository

## Deployment Steps

### Option 1: Using render.yaml (Recommended)
If you want to deploy both services together:

1. Push the `render.yaml` file to your repository
2. Go to https://dashboard.render.com and click "New +" > "Web Service"
3. Connect your GitHub repository
4. Choose the root directory as the build context
5. Render will automatically use the `render.yaml` configuration
6. Click "Deploy"

### Option 2: Manual Deployment (Two Services)

#### Deploy Backend First:
1. Go to https://dashboard.render.com and click "New +" > "Web Service"
2. Connect your GitHub repository
3. Configure as follows:
   - **Name**: `competition-backend` (or your choice)
   - **Branch**: `main`
   - **Root Directory**: `Finalized_DB/Backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**: 
     - Add any sensitive vars here (if needed in future)

4. Click "Deploy" and wait for the build to complete
5. Copy the backend URL (e.g., `https://competition-backend.onrender.com`)

#### Deploy Frontend Second:
1. Click "New +" > "Web Service" again
2. Configure as follows:
   - **Name**: `competition-frontend` (or your choice)
   - **Branch**: `main`
   - **Root Directory**: `Finalized_DB/frontend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm install -g serve && serve -s dist -l 3000`
   - **Environment Variables**:
     - **VITE_API_URL**: `https://competition-backend.onrender.com` (use your backend URL)

3. Click "Deploy"

## Connect Your Custom Domain

### On Render:
1. Go to your Frontend service settings
2. Scroll to "Custom Domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Click "Add Custom Domain"
5. Render will show you DNS records to add

### At Your Domain Registrar (GoDaddy, Namecheap, etc.):
1. Go to DNS settings
2. Add a CNAME record:
   - **Type**: CNAME
   - **Name**: `@` or leave empty (for root domain)
   - **Value**: The URL Render provided (e.g., `onrender.com`)
3. Wait 24-48 hours for DNS to propagate

### OR For Subdomain:
If using `app.yourdomain.com`:
- **Type**: CNAME
- **Name**: `app`
- **Value**: Render's URL

## Update Frontend API Configuration

The frontend needs to know where the backend is. You have two options:

### Option A: Update Code (Quick for testing)
Edit `frontend/src/App.jsx` and change:
```javascript
// From:
const res = await fetch('http://localhost:3000/signup', {

// To:
const res = await fetch(import.meta.env.VITE_API_URL + '/signup', {
```

### Option B: Use Environment Variables (Recommended)
1. In `frontend/.env` on production (Render sets this):
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

2. Update your frontend code to use:
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
   const res = await fetch(API_URL + '/signup', {
   ```

## Verify Deployment

1. Visit `https://yourdomain.com`
2. Try signing up and logging in
3. Test profile picture upload
4. Check the browser console for any API errors

## Troubleshooting

**Frontend shows "Cannot reach backend"**
- Check that VITE_API_URL environment variable is set correctly
- Ensure backend service is running (check Render dashboard)

**Domain not resolving**
- Wait 24-48 hours for DNS propagation
- Use `nslookup yourdomain.com` to check DNS records

**Backend 500 errors**
- Check backend logs on Render dashboard
- Verify MongoDB connection string is correct

## Next Steps
- Enable SSL (Render does this automatically)
- Set up auto-deploy from GitHub
- Monitor logs in Render dashboard
