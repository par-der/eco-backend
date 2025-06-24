from fastapi import APIRouter
from app.services.nebo_service import fetch_city_air
from app.models.pollution import Pollution
from app.db.session import AsyncSessionLocal, async_sessionmaker
from sqlalchemy import select

router = APIRouter()

@router.post("/update")
async def update_air():
    await fetch_city_air()
    return {"status": "updated"}

@router.get("/latest")
async def get_latest():
    async with AsyncSessionLocal() as session:
        stmt = select(Pollution).order_by(Pollution.timestamp.desc()).limit(1)
        result = await session.execute(stmt)
        return result.scalar_one_or_none()
