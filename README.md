# Academic Website - Dr. Sanjeev Kumar Ghai

Professional academic portfolio website built with FastAPI, React, and MongoDB.

## 🌐 Live Website
Deploy for FREE using the guides below!

## 🚀 Quick Deploy (100% FREE)

**Total Time: ~20 minutes**

Follow **QUICK_DEPLOY.md** for the fastest setup, or see **DEPLOYMENT_GUIDE.md** for detailed instructions.

### Free Hosting Stack:
- **Frontend**: Vercel (Free forever)
- **Backend**: Render.com (Free tier)
- **Database**: MongoDB Atlas (512MB free)

**Total Cost: $0/month**

## 📋 Features

- ✅ Hero section with professional layout
- ✅ About & biography section
- ✅ Research interests showcase
- ✅ Publications with search & filter (17 papers)
- ✅ Teaching experience
- ✅ Awards & recognition
- ✅ News updates
- ✅ Contact form
- ✅ Downloadable CV
- ✅ Fully responsive design
- ✅ Cambridge blue theme

## 🛠 Tech Stack

**Frontend:**
- React 19
- Tailwind CSS
- Shadcn UI Components
- Framer Motion (animations)
- Axios

**Backend:**
- FastAPI
- Motor (async MongoDB driver)
- Pydantic
- Python 3.x

**Database:**
- MongoDB

## 📁 Project Structure

```
/app
├── backend/
│   ├── server.py           # FastAPI application
│   ├── seed_data.py        # Database seeding
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Backend environment variables
├── frontend/
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── index.css      # Global styles
│   │   └── components/    # UI components
│   ├── package.json       # Node dependencies
│   ├── vercel.json        # Vercel config
│   └── .env              # Frontend environment variables
├── render.yaml            # Render deployment config
├── DEPLOYMENT_GUIDE.md    # Detailed deployment guide
└── QUICK_DEPLOY.md        # Quick start guide
```

## 🏃 Local Development

### Prerequisites
- Python 3.8+
- Node.js 18+
- MongoDB

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python seed_data.py  # Seed database
uvicorn server:app --reload
```

### Frontend Setup
```bash
cd frontend
yarn install
yarn start
```

## 🌍 Deployment

See **DEPLOYMENT_GUIDE.md** for complete FREE deployment instructions.

## 📝 Environment Variables

### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=academic_website
CORS_ORIGINS=*
```

### Frontend (.env)
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

## 📚 API Endpoints

- `GET /api/` - Health check
- `GET /api/profile` - Get profile data
- `GET /api/publications` - Get all publications (with filters)
- `GET /api/news` - Get news items
- `POST /api/contact` - Submit contact form
- `GET /api/cv` - Download CV

## 🎨 Design

- **Theme**: Cambridge Blue (#8EE8D8)
- **Typography**: Playfair Display (headings), Manrope (body)
- **Style**: Clean, academic, professional
- **Layout**: Split-screen, bento grid

## 📄 License

Personal academic website for Dr. Sanjeev Kumar Ghai.

## 🤝 Support

For deployment help, see DEPLOYMENT_GUIDE.md or check:
- Render docs: https://render.com/docs
- Vercel docs: https://vercel.com/docs
- MongoDB Atlas docs: https://docs.atlas.mongodb.com

---

Built with ❤️ using Emergent
