# Quick Start - Free Deployment

## 3 Simple Steps to Deploy Your Academic Website for FREE:

### 1️⃣ MongoDB Atlas (Database)
- Sign up: https://www.mongodb.com/cloud/atlas/register
- Create FREE cluster (M0)
- Get connection string → Save it!

### 2️⃣ Render.com (Backend)
- Sign up: https://render.com
- Connect GitHub repo
- New Web Service → Select your repo
- Root Directory: `backend`
- Build: `pip install -r requirements.txt`
- Start: `uvicorn server:app --host 0.0.0.0 --port $PORT`
- Add env vars:
  - `MONGO_URL` = your MongoDB connection string
  - `DB_NAME` = academic_website
  - `CORS_ORIGINS` = *
- Deploy!
- After deployment: Open Shell → Run `python seed_data.py`
- Copy your backend URL: `https://yourapp.onrender.com`

### 3️⃣ Vercel (Frontend)
- Sign up: https://vercel.com
- Import GitHub repo
- Root Directory: `frontend`
- Add env var:
  - `REACT_APP_BACKEND_URL` = your Render backend URL
- Deploy!

**Your website is LIVE! 🎉**

---

## Full detailed guide: See DEPLOYMENT_GUIDE.md

## Important Notes:
- Render free tier sleeps after 15 min → First load takes 30 sec (normal)
- All services are FREE forever
- Total cost: $0/month

## Need help?
Check DEPLOYMENT_GUIDE.md for troubleshooting and detailed instructions.
