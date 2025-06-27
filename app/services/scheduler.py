from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.jobstores.memory import MemoryJobStore
from apscheduler.triggers.cron import CronTrigger
from app.services.weather_service import fetch_and_save_weather
from app.services.nebo_service import fetch_city_air
from app.db.session import AsyncSessionLocal
from app.db.session import async_sessionmaker

scheduler = AsyncIOScheduler(timezone="Europe/Moscow")

async def update_weather_job():
    async with async_sessionmaker()() as session:
        await fetch_and_save_weather(session)
        await session.commit()

async def update_air_job():
    async with async_sessionmaker()() as session:
        await fetch_city_air(session)
        await session.commit()

def start_scheduler() -> AsyncIOScheduler:
    scheduler.add_job(update_weather_job, CronTrigger(minute="5"))
    scheduler.add_job(update_air_job, CronTrigger(minute="7"))
    scheduler.start()