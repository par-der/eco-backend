from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.nebo_service import fetch_city_air
from app.models.pollution import Pollution
from app.db.session import AsyncSessionLocal, async_sessionmaker
from sqlalchemy import select

router = APIRouter()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

@router.post("/update")
async def update_air(db: AsyncSession = Depends(get_db)):
    await fetch_city_air(db)
    return {"status": "updated"}

@router.get("/latest")
async def get_latest():
    async with AsyncSessionLocal() as session:
        stmt = select(Pollution).order_by(Pollution.timestamp.desc()).limit(1)
        result = await session.execute(stmt)
        return result.scalar_one_or_none()
