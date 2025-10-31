# Vercel Deployment Guide for Sydney Events App

## Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)
- MongoDB Atlas account (for database)

## Step-by-Step Deployment Process

### Part 1: Prepare Your MongoDB Database

1. **Create MongoDB Atlas Account** (if you don't have one):
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for a free account
   - Create a new cluster (free tier is fine)

2. **Get Your Connection String**:
   - In MongoDB Atlas dashboard, click "Connect"
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
   - Replace `<password>` with your actual password
   - Add database name at the end: `/sydney-events`

3. **Whitelist All IPs** (for Vercel):
   - In MongoDB Atlas, go to Network Access
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

---

### Part 2: Push Code to GitHub

1. **Initialize Git Repository** (if not already done):
```bash
cd c:\Users\yraje\OneDrive\Desktop\Assignment3
git init
git add .
git commit -m "Initial commit - Sydney Events App"
```

2. **Create GitHub Repository**:
   - Go to https://github.com/new
   - Name it "sydney-events-app" (or any name)
   - Don't initialize with README
   - Click "Create repository"

3. **Push to GitHub**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/sydney-events-app.git
git branch -M main
git push -u origin main
```

---

### Part 3: Deploy Backend to Vercel

1. **Login to Vercel**:
   - Go to https://vercel.com
   - Sign in with GitHub

2. **Import Backend Project**:
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Backend**:
   - **Root Directory**: Set to `backend`
   - **Framework Preset**: Other
   - Click "Environment Variables"
   - Add these variables:
     ```
     MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/sydney-events?retryWrites=true&w=majority
     PORT = 5000
     NODE_ENV = production
     FRONTEND_URL = (leave blank for now, we'll update this after frontend deployment)
     ```

4. **Deploy Backend**:
   - Click "Deploy"
   - Wait for deployment to complete
   - **IMPORTANT**: Copy the deployment URL (e.g., `https://your-backend.vercel.app`)

---

### Part 4: Deploy Frontend to Vercel

1. **Import Frontend Project**:
   - In Vercel dashboard, click "Add New..." → "Project"
   - Select the SAME GitHub repository
   - Click "Import"

2. **Configure Frontend**:
   - **Root Directory**: Set to `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (should be auto-detected)
   - **Output Directory**: `dist` (should be auto-detected)
   - Click "Environment Variables"
   - Add this variable:
     ```
     VITE_API_URL = https://your-backend.vercel.app/api
     ```
     (Replace with the actual backend URL from Step 3.4)

3. **Deploy Frontend**:
   - Click "Deploy"
   - Wait for deployment to complete
   - **IMPORTANT**: Copy the frontend deployment URL (e.g., `https://your-frontend.vercel.app`)

---

### Part 5: Update Backend Environment Variables

1. **Go to Backend Project** in Vercel dashboard
2. Click "Settings" → "Environment Variables"
3. **Edit** the `FRONTEND_URL` variable
4. Set it to your frontend URL (e.g., `https://your-frontend.vercel.app`)
5. Click "Save"
6. **Redeploy Backend**:
   - Go to "Deployments" tab
   - Click the three dots on the latest deployment
   - Click "Redeploy"

---

### Part 6: Verify Deployment

1. **Test Frontend**:
   - Open your frontend URL
   - You should see the Sydney Events homepage
   - Events should load (might take a few seconds on first load)

2. **Test Backend**:
   - Open `https://your-backend.vercel.app/api/events`
   - You should see a JSON response with events

3. **Test Email Capture**:
   - Click "Get Tickets" on any event
   - Enter your email
   - Check if it redirects to the event website

---

## Common Issues & Solutions

### Issue 1: Events Not Loading
**Solution**: Check if MongoDB connection string is correct in backend environment variables.

### Issue 2: CORS Errors
**Solution**: Make sure `FRONTEND_URL` in backend matches your actual frontend URL (no trailing slash).

### Issue 3: Backend Not Responding
**Solution**: 
- Check Vercel function logs (in Vercel dashboard → Functions tab)
- Puppeteer might not work on Vercel's free tier - the scraper will use fallback methods

### Issue 4: Build Fails
**Frontend**: Make sure all dependencies are in `package.json`
**Backend**: Check for syntax errors in `server.js`

### Issue 5: Environment Variables Not Working
**Solution**: After adding/changing environment variables, you MUST redeploy the project.

---

## Important Notes

### About Puppeteer on Vercel:
Puppeteer (used for Eventbrite scraping) may not work on Vercel's serverless functions due to size limits. The scraper is designed with fallbacks:
1. Try Eventbrite with Puppeteer
2. If fails, use other sources (TimeOut Sydney, Eventfinda, Sydney.com)
3. If all fail, use sample events

### About Cron Jobs on Vercel:
Vercel doesn't support traditional cron jobs in serverless functions. Options:
1. Use Vercel Cron (requires Pro plan)
2. Use external service like cron-job.org to ping your backend endpoint
3. Events update when server starts/when endpoint is called

### Cost:
- Vercel Free Tier: Sufficient for this project
- MongoDB Atlas Free Tier: Sufficient for this project
- Both should work without any payment

---

## Alternative: Manual Deployment (Without GitHub)

If you don't want to use GitHub:

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy Backend**:
```bash
cd backend
vercel --prod
```
Follow prompts and add environment variables when asked.

3. **Deploy Frontend**:
```bash
cd frontend
vercel --prod
```
Add `VITE_API_URL` when prompted.

---

## Updating Your App After Changes

1. **Make your code changes**
2. **Commit and push to GitHub**:
```bash
git add .
git commit -m "Your changes description"
git push
```
3. **Vercel auto-deploys** from GitHub (no manual action needed!)

---

## Getting Help

- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- Check Vercel deployment logs for errors

---

## Summary Checklist

- [ ] MongoDB Atlas cluster created and connection string copied
- [ ] Code pushed to GitHub
- [ ] Backend deployed to Vercel with environment variables
- [ ] Frontend deployed to Vercel with VITE_API_URL
- [ ] Backend FRONTEND_URL updated with actual frontend URL
- [ ] Both deployments tested and working
- [ ] Email capture tested and working

**Your app is now live!** 🎉
