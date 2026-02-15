from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class Publication(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    title: str
    authors: str
    journal: Optional[str] = None
    year: int
    type: str  # journal, conference, book_chapter, submitted
    link: Optional[str] = None
    status: Optional[str] = None

class NewsItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    title: str
    content: str
    date: str
    category: str

class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ProfileData(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    name: str
    title: str
    affiliation: str
    email: str
    phone: str
    address: str
    bio: str
    research_interests: List[str]


# Routes
@api_router.get("/")
async def root():
    return {"message": "Academic Website API"}

@api_router.get("/profile")
async def get_profile():
    profile = await db.profile.find_one({}, {"_id": 0})
    if not profile:
        # Return default profile
        return {
            "name": "Dr. Sanjeev Kumar Ghai",
            "title": "Research Associate",
            "affiliation": "Department of Engineering, University of Cambridge, UK",
            "email": "snjv.ghai@gmail.com",
            "phone": "+44-7587921560",
            "address": "#23 Cranesbill close, Cambridge, UK-CB4 2YQ",
            "bio": "Research Associate at the University of Cambridge with expertise in Computational Fluid Dynamics, turbulent reacting flows, and advanced combustion modeling. PhD from IIT Kanpur with extensive experience in numerical simulations and data-driven approaches for flame dynamics optimization.",
            "research_interests": [
                "Computational Fluid Dynamics",
                "Turbulent Reacting Flows",
                "Chemical Kinetics",
                "Spray Combustion",
                "Flame Wall Interaction",
                "Advanced Turbulent Combustion Modelling",
                "Flame Dynamics",
                "MILD and Premixed Combustion",
                "Heat Transfer",
                "Turbulence"
            ]
        }
    return profile

@api_router.get("/publications", response_model=List[Publication])
async def get_publications(year: Optional[int] = None, type: Optional[str] = None):
    query = {}
    if year:
        query["year"] = year
    if type:
        query["type"] = type
    
    publications = await db.publications.find(query, {"_id": 0}).to_list(1000)
    return publications

@api_router.get("/news", response_model=List[NewsItem])
async def get_news():
    news_items = await db.news.find({}, {"_id": 0}).sort("date", -1).to_list(100)
    return news_items

@api_router.post("/contact")
async def submit_contact(message: ContactMessage):
    message_dict = message.model_dump()
    await db.contact_messages.insert_one(message_dict)
    return {"success": True, "message": "Thank you for your message. I'll get back to you soon!"}

@api_router.get("/cv")
async def download_cv():
    cv_path = ROOT_DIR / "CV_Sanjeev_Latest.pdf"
    if cv_path.exists():
        return FileResponse(
            path=cv_path,
            filename="CV_Sanjeev_Kumar_Ghai.pdf",
            media_type="application/pdf"
        )
    raise HTTPException(status_code=404, detail="CV not found")


# Add CORS middleware BEFORE including router
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the router in the main app
app.include_router(api_router)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
