# Free Deployment Guide - Academic Website

## Complete FREE hosting for your academic website using:
- **Render.com** (Backend - FastAPI)
- **Vercel.com** (Frontend - React)
- **MongoDB Atlas** (Database)

Total Cost: **$0/month Forever**

---

## STEP 1: Setup MongoDB Atlas (Database) - 5 minutes

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create a **FREE account** (no credit card needed)
3. Click **"Build a Database"**
4. Choose **"M0 FREE"** tier (512MB storage)
5. Select a cloud provider & region (closest to you)
6. Click **"Create Cluster"** (takes 3-5 minutes)

### Get Connection String:
1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string (looks like): 
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. **SAVE THIS** - you'll need it for Render

---

## STEP 2: Deploy Backend to Render.com - 10 minutes

1. Go to: https://render.com/
2. Click **"Get Started for Free"**
3. Sign up with your **GitHub account**
4. Click **"New +"** → **"Web Service"**
5. Connect your GitHub repository (the one you just pushed to)
6. Configure:
   - **Name**: `academic-website-backend` (or any name)
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: **Free**

### Add Environment Variables:
Click **"Advanced"** → **"Add Environment Variable"**

Add these 3 variables:
```
MONGO_URL = mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DB_NAME = academic_website
CORS_ORIGINS = *
```
(Use YOUR MongoDB connection string from Step 1)

7. Click **"Create Web Service"**
8. Wait 5-10 minutes for deployment
9. **COPY YOUR BACKEND URL** (looks like): `https://academic-website-backend.onrender.com`

### Seed Your Database:
After deployment completes, go to Render dashboard:
1. Click your service → **"Shell"** tab
2. Run: `python seed_data.py`
3. This loads all your publications and data

---

## STEP 3: Deploy Frontend to Vercel - 5 minutes

### First, Update Frontend Environment Variable:
Before deploying, we need to tell the frontend where the backend is.

1. In your GitHub repository, edit `/frontend/.env`
2. Change `REACT_APP_BACKEND_URL` to your Render backend URL:
   ```
   REACT_APP_BACKEND_URL=https://academic-website-backend.onrender.com
   ```
3. Commit and push this change to GitHub

### Now Deploy to Vercel:
1. Go to: https://vercel.com/
2. Click **"Sign Up"** (use your GitHub account)
3. Click **"Add New Project"**
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `frontend`
   - **Build Command**: `yarn build`
   - **Output Directory**: `build`

### Add Environment Variable:
Under **"Environment Variables"**:
```
REACT_APP_BACKEND_URL = https://academic-website-backend.onrender.com
```
(Use YOUR Render backend URL from Step 2)

6. Click **"Deploy"**
7. Wait 2-3 minutes
8. **YOUR WEBSITE IS LIVE!** 🎉

Vercel will give you a URL like: `https://your-site.vercel.app`

---

## STEP 4: Test Your Live Website

1. Visit your Vercel URL: `https://your-site.vercel.app`
2. Check all sections load correctly
3. Test the contact form
4. Try downloading the CV
5. Test publication filters

---

## Important Notes:

### Render Free Tier Limitations:
- **Spins down after 15 minutes of inactivity**
- First request after sleep takes ~30 seconds to wake up
- This is NORMAL for free tier
- Keep it active by visiting regularly

### To Keep Backend Always Active (Optional):
Use a free service like **UptimeRobot** or **Cron-job.org** to ping your backend every 10 minutes.

### Custom Domain (Optional):
Both Vercel and Render support custom domains for FREE:
- Buy domain from Namecheap/GoDaddy (~$10/year)
- Add to Vercel: Settings → Domains
- Update DNS records as instructed

---

## Troubleshooting:

### Backend not working?
- Check Render logs: Dashboard → Your Service → Logs
- Verify MongoDB connection string is correct
- Ensure you ran `seed_data.py` to populate database

### Frontend not connecting to backend?
- Check REACT_APP_BACKEND_URL is correct in Vercel environment variables
- Make sure backend URL has no trailing slash
- Check CORS settings in backend

### MongoDB connection issues?
- Whitelist all IP addresses: MongoDB Atlas → Network Access → Add IP Address → Allow from Anywhere (0.0.0.0/0)
- Verify username/password in connection string
- Check cluster is not paused

---

## Cost Breakdown:
- MongoDB Atlas: **$0/month** (512MB free forever)
- Render.com: **$0/month** (Free tier)
- Vercel.com: **$0/month** (Free tier)
- **TOTAL: $0/month** ✅

---

## Need Help?

If you run into issues during deployment, check:
1. Render deployment logs
2. Vercel deployment logs
3. Browser console for frontend errors
4. Make sure all environment variables are set correctly

Your academic website will be live and accessible to the world completely FREE! 🚀
