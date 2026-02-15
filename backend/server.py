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

# MongoDB connection with SSL parameters for Python 3.14 compatibility
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(
    mongo_url,
    tls=True,
    tlsAllowInvalidCertificates=True,
    serverSelectionTimeoutMS=5000
)
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

@api_router.get("/seed-database")
async def seed_database():
    """Endpoint to seed the database with initial data"""
    try:
        # Clear existing data
        await db.publications.delete_many({})
        await db.news.delete_many({})
        await db.profile.delete_many({})
        
        # Seed profile
        profile = {
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
        await db.profile.insert_one(profile)
        
        # Seed publications
        publications = [
{
    "title": "Numerical simulations of turbulent lifted jet diffusion flames in a vitiated coflow using stochastic multiple mapping conditioning approach",
    "authors": "S. K. Ghai, S. De, A. Kronenburg",
    "journal": "Proceedings of the Combustion Institute",
    "year": 2019,
    "type": "journal",
    "status": "published"
},
{
    "title": "Numerical modelling of turbulent premixed combustion using RANS based stochastic multiple mapping conditioning approach",
    "authors": "S. K. Ghai, S. De",
    "journal": "Proceedings of the Combustion Institute",
    "year": 2019,
    "type": "journal",
    "status": "published"
},
{
    "title": "Numerical investigation of auto-igniting turbulent lifted CH4/Air jet diffusion flames in a vitiated co-flow using a RANS based stochastic multiple mapping conditioning approach",
    "authors": "S. K. Ghai, S. De",
    "journal": "Combustion and Flame",
    "year": 2019,
    "type": "journal",
    "status": "published"
},
{
    "title": "Numerical investigation of flow and scalar fields of piloted, partially-premixed dimethyl ether/air jet flames using stochastic multiple mapping conditioning approach",
    "authors": "S. K. Ghai, S. De",
    "journal": "Combustion and Flame",
    "year": 2019,
    "type": "journal",
    "status": "published"
},
{
    "title": "Entropy Generation during Head-On Interaction of Premixed Flames with Inert Walls within Turbulent Boundary Layers",
    "authors": "S. K. Ghai, U. Ahmed, N. Chakraborty, M. Klein",
    "journal": "Entropy",
    "year": 2022,
    "type": "journal",
    "status": "published"
},
{
    "title": "Energy integral equation for premixed flame-wall interaction in turbulent boundary layers and its application to turbulent burning velocity and wall flux evaluations",
    "authors": "S. K. Ghai, U. Ahmed, N. Chakraborty, M. Klein",
    "journal": "International Journal of Heat and Mass Transfer",
    "year": 2022,
    "type": "journal",
    "status": "published"
},
{
    "title": "Enstrophy evolution during head-on wall interaction of premixed flames within turbulent boundary layers",
    "authors": "S. K. Ghai, U. Ahmed, N. Chakraborty, M. Klein",
    "journal": "Physics of Fluids",
    "year": 2022,
    "type": "journal",
    "status": "published"
},
{
    "title": "Turbulent kinetic energy evolution in turbulent boundary layers during head-on interaction of premixed flames with inert walls for different thermal boundary conditions",
    "authors": "S. K. Ghai, U. Ahmed, N. Chakraborty, M. Klein",
    "journal": "Proceedings of the Combustion Institute",
    "year": 2023,
    "type": "journal",
    "status": "published"
},
{
    "title": "Effects of fuel Lewis number on wall heat transfer during oblique flame-wall interaction of premixed flames within turbulent boundary layers",
    "authors": "S. K. Ghai, U. Ahmed, N. Chakraborty",
    "journal": "Flow Turbulence and Combustion",
    "year": 2023,
    "type": "journal",
    "status": "published"
},
{
    "title": "Statistical behaviour and modelling of variances of reaction progress variable and temperature during flame-wall interaction of premixed flames within turbulent boundary layers",
    "authors": "S. K. Ghai, U. Ahmed, N. Chakraborty",
    "journal": "Flow Turbulence and Combustion",
    "year": 2024,
    "type": "journal",
    "status": "published"
},
{
    "title": "Modelling of Flame Surface Density during flame-wall interaction of premixed flames within turbulent boundary layers",
    "authors": "S. K. Ghai, U. Ahmed, N. Chakraborty",
    "journal": "Combustion Science and Technology",
    "year": 2024,
    "type": "journal",
    "status": "in press"
},
{
    "title": "Effects of Partial Premixing and coflow temperature on flame stabilization of lifted jet flames of dimethyl ether in a vitiated coflow based on stochastic MMC approach",
    "authors": "S. K. Ghai, R. Gupta, S. De",
    "journal": "Fluids",
    "year": 2024,
    "type": "journal",
    "status": "published"
},
{
    "title": "Assessment of laws of the wall during flame-wall interaction of premixed flames within turbulent boundary layers",
    "authors": "U. Ahmed, S. K. Ghai, N. Chakraborty",
    "journal": "Flow Turbulence and Combustion",
    "year": 2024,
    "type": "journal",
    "status": "published"
},
{
    "title": "Relations between Reynolds stresses and their dissipation rates during premixed flame-wall interaction within turbulent boundary layers",
    "authors": "U. Ahmed, S. K. Ghai, N. Chakraborty",
    "journal": "Physics of Fluids",
    "year": 2024,
    "type": "journal",
    "status": "published"
},
{
    "title": "Direct Numerical Simulation Analysis of the Closure of Turbulent Scalar Flux during Flame–Wall Interaction of Premixed Flames within Turbulent Boundary Layers",
    "authors": "U. Ahmed, S. K. Ghai, N. Chakraborty",
    "journal": "Energies",
    "year": 2024,
    "type": "journal",
    "status": "published"
},
{
    "title": "Multiscale analysis of Reynolds stresses and dissipation during premixed flame wall interaction",
    "authors": "S. K. Ghai, U. Ahmed, N. Chakraborty, M. Klein",
    "journal": "Physics of Fluids",
    "year": 2024,
    "type": "journal",
    "status": "in press"
},
{
    "title": "Anisotropy of Reynolds stresses and their dissipation rates in lean H2-air flames in different regimes of turbulent premixed combustion",
    "authors": "N. Chakraborty, S. K. Ghai, H. Im",
    "journal": "Energies",
    "year": 2024,
    "type": "journal",
    "status": "published"
},
{
    "title": "Effects of thermal boundary conditions on scalar and turbulence statistics during premixed flame-wall interaction within turbulent boundary layers",
    "authors": "S. K. Ghai, U. Ahmed, N. Chakraborty",
    "journal": "Flow Turbulence and Combustion",
    "year": 2024,
    "type": "journal",
    "status": "in press"
},
{
    "title": "Stabilization of lifted dimethyl ether jet diffusion flames in vitiated coflow using MMC-LES",
    "authors": "P. Nahak, S. K. Ghai, E. Sharma, S. De, M. J. Cleary",
    "journal": "Fuel",
    "year": 2025,
    "type": "journal",
    "status": "under submission"
},
{
    "title": "Effects of fuel Lewis number on turbulent flow statistics in oblique-wall quenching of premixed V-shaped flames within turbulent channel flows",
    "authors": "N. Chakraborty, S. K. Ghai, U. Ahmed",
    "journal": "To be submitted",
    "year": 2025,
    "type": "journal",
    "status": "in preparation"
}
]

        
        await db.publications.insert_many(publications)
        
        # Seed news
        news = [
            {
                "title": "Joined University of Cambridge",
                "content": "Started as Research Associate at the Department of Engineering, University of Cambridge.",
                "date": "2024-04-01",
                "category": "career"
            }
        ]
        
        await db.news.insert_many(news)
        
        return {"success": True, "message": "Database seeded successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error seeding database: {str(e)}")


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
