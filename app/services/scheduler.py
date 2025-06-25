from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.jobstores.memory import MemoryJobStore
from apscheduler.triggers.cron import CronTrigger
from app.services.weather_service import fetch_and_save_weather
from app.services.nebo_service import fetch_city_air

def start_scheduler() -> AsyncIOScheduler:
    scheduler = AsyncIOScheduler(
        jobstores={"default": MemoryJobStore()},
        timezone="Europe/Moscow",
    )

    # Запуск каждый час — 03-й и 08-й минуты, чтобы API не попадали в одну секунду
    scheduler.add_job(
        fetch_and_save_weather,
        CronTrigger(minute=3),
        id="weather_job",
        replace_existing=True,
    )
    scheduler.add_job(
        fetch_city_air,
        CronTrigger(minute=8),
        id="air_job",
        replace_existing=True,
    )

    scheduler.start()
    return scheduler
