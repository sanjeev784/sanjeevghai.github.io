import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def seed_database():
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
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
    
    # Seed publications (subset from CV)
    publications = [
        {
            "title": "Numerical simulations of turbulent lifted jet diffusion flames in a vitiated coflow using stochastic multiple mapping conditioning approach",
            "authors": "S. K. Ghai, S. De",
            "journal": "Proceedings of the Combustion Institute",
            "year": 2021,
            "type": "journal",
            "status": "published"
        },
        {
            "title": "Numerical modelling of turbulent premixed combustion using RANS based stochastic multiple mapping conditioning approach",
            "authors": "S. K. Ghai, S. De",
            "journal": "Combustion Science and Technology",
            "year": 2020,
            "type": "journal",
            "status": "published"
        },
        {
            "title": "Entropy Generation during Head-On Interaction of Premixed Flames with Inert Walls within Turbulent Boundary Layers",
            "authors": "S. K. Ghai, N. Chakraborty",
            "journal": "Physics of Fluids",
            "year": 2023,
            "type": "journal",
            "status": "published"
        },
        {
            "title": "Energy integral equation for premixed flame-wall interaction in turbulent boundary layers",
            "authors": "S. K. Ghai, N. Chakraborty",
            "journal": "Flow, Turbulence and Combustion",
            "year": 2023,
            "type": "journal",
            "status": "published"
        },
        {
            "title": "Enstrophy evolution during head-on wall interaction of premixed flames within turbulent boundary layers",
            "authors": "S. K. Ghai, N. Chakraborty",
            "journal": "Journal of Fluid Mechanics",
            "year": 2022,
            "type": "journal",
            "status": "published"
        },
        {
            "title": "Turbulent kinetic energy evolution in turbulent boundary layers during head-on interaction of premixed flames with inert walls",
            "authors": "S. K. Ghai, N. Chakraborty",
            "journal": "International Journal of Heat and Fluid Flow",
            "year": 2022,
            "type": "journal",
            "status": "published"
        },
        {
            "title": "Effects of fuel Lewis number on wall heat transfer during oblique flame-wall interaction",
            "authors": "S. K. Ghai, N. Chakraborty",
            "journal": "Combustion and Flame",
            "year": 2023,
            "type": "journal",
            "status": "published"
        },
        {
            "title": "Statistical behaviour and modelling of variances of reaction progress variable and temperature during flame-wall interaction",
            "authors": "S. K. Ghai, N. Chakraborty",
            "journal": "Combustion Theory and Modelling",
            "year": 2022,
            "type": "journal",
            "status": "published"
        },
        {
            "title": "Modelling of Flame Surface Density during flame-wall interaction of premixed flames within turbulent boundary layers",
            "authors": "S. K. Ghai, N. Chakraborty",
            "journal": "Flow, Turbulence and Combustion",
            "year": 2022,
            "type": "journal",
            "status": "published"
        },
        {
            "title": "Assessment of laws of the wall during flame-wall interaction of premixed flames within turbulent boundary layers",
            "authors": "S. K. Ghai, N. Chakraborty",
            "journal": "Physics of Fluids",
            "year": 2021,
            "type": "journal",
            "status": "published"
        },
        {
            "title": "Relations between Reynolds stresses and their dissipation rates during premixed flame-wall interaction",
            "authors": "S. K. Ghai, N. Chakraborty",
            "journal": "International Journal of Heat and Fluid Flow",
            "year": 2021,
            "type": "journal",
            "status": "published"
        },
        {
            "title": "Direct Numerical Simulation Analysis of the Closure of Turbulent Scalar Flux during Flame-Wall Interaction",
            "authors": "S. K. Ghai, N. Chakraborty",
            "journal": "Combustion Science and Technology",
            "year": 2021,
            "type": "journal",
            "status": "published"
        },
        {
            "title": "Multiscale analysis of Reynolds stresses and dissipation during premixed flame wall interaction",
            "authors": "S. K. Ghai, N. Chakraborty",
            "journal": "Physics of Fluids",
            "year": 2020,
            "type": "journal",
            "status": "published"
        },
        {
            "title": "Anisotropy of Reynolds stresses in lean H2-air flames in different regimes of turbulent premixed combustion",
            "authors": "S. K. Ghai, N. Chakraborty",
            "journal": "Combustion and Flame",
            "year": 2020,
            "type": "journal",
            "status": "published"
        },
        {
            "title": "Stabilization of lifted dimethyl ether jet diffusion flames in vitiated coflow using MMC-LES",
            "authors": "S. K. Ghai, S. De",
            "journal": "Under submission",
            "year": 2024,
            "type": "submitted",
            "status": "under_review"
        },
        {
            "title": "A Review on Autoignition in Laminar and Turbulent Nonpremixed Flames",
            "authors": "S. K. Ghai, S. De",
            "journal": "Book Chapter in Combustion Science",
            "year": 2019,
            "type": "book_chapter",
            "status": "published"
        },
        {
            "title": "Theory and Application of Multiple Mapping Conditioning for Turbulent Reactive Flows",
            "authors": "S. K. Ghai, S. De",
            "journal": "Book Chapter in Advanced Combustion Modeling",
            "year": 2020,
            "type": "book_chapter",
            "status": "published"
        }
    ]
    
    await db.publications.insert_many(publications)
    
    # Seed news
    news = [
        {
            "title": "Joined University of Cambridge",
            "content": "Started as Research Associate at the Department of Engineering, University of Cambridge, working on analyzing large-scale CFD datasets for Rolls-Royce.",
            "date": "2024-04-01",
            "category": "career"
        },
        {
            "title": "Award at UKCTRF 2022",
            "content": "Won 2nd Prize in audio-visual category at the UK Combustion and Turbulent Reacting Flow Conference.",
            "date": "2022-09-15",
            "category": "award"
        },
        {
            "title": "Global Talent Endorsement",
            "content": "Received Global Talent Endorsement from UKRI, recognizing exceptional promise in research and innovation.",
            "date": "2021-11-20",
            "category": "award"
        },
        {
            "title": "New Publication in Physics of Fluids",
            "content": "Published research on entropy generation during head-on interaction of premixed flames with inert walls.",
            "date": "2023-06-10",
            "category": "publication"
        }
    ]
    
    await db.news.insert_many(news)
    
    print("Database seeded successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
