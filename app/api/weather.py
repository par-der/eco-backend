from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import AsyncSessionLocal
from app.models.weather import Weather
from app.services.weather_service import fetch_and_save_weather

router = APIRouter()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

@router.get("/get")
async def get_latest_weather(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        Weather.__table__.select().order_by(Weather.timestamp.desc()).limit(1)
    )
    return result.scalar_one_or_none()

@router.post("/update")
async def update_weather():
    await fetch_and_save_weather()
    return {"status": "updated"}