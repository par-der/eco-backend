from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from app.models.weather import Weather
from app.services.weather_service import fetch_and_save_weather
from pydantic import BaseModel

router = APIRouter()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

class WeatherOut(BaseModel):
    temperature: float
    wind_speed: float
    description: str | None = None
    humidity: int
    timestamp: datetime

    model_config = {"from_attributes": True}

@router.get("/get", response_model=WeatherOut | None)
async def get_latest_weather(db: AsyncSession = Depends(get_db)):
    stmt = select(Weather).order_by(Weather.timestamp.desc()).limit(1)
    result = await db.execute(stmt)
    weather: Weather | None = result.scalars().first()
    return weather

@router.post("/update")
async def update_weather(db: AsyncSession = Depends(get_db)):
    await fetch_and_save_weather(db)
    await db.commit()
    return {"status": "updated"}