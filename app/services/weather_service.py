import httpx
from app.models.weather import Weather
from app.db.session import AsyncSessionLocal
from datetime import datetime

LAT, LON = 55.75, 37.62  # Москва

async def fetch_and_save_weather():
    async with httpx.AsyncClient() as client:
        url = (
            f"https://api.open-meteo.com/v1/forecast?"
            f"latitude={LAT}&longitude={LON}"
            f"&current=temperature_2m,relative_humidity_2m,wind_speed_10m"
        )
        response = await client.get(url)
        data = response.json().get("current", {})

        if not data:
            print("Нет данных от API")
            return

        async with AsyncSessionLocal() as session:
            weather = Weather(
                temperature=data.get("temperature_2m"),
                humidity=data.get("relative_humidity_2m"),
                wind_speed=data.get("wind_speed_10m"),
                description="Open-Meteo",
                timestamp=datetime.utcnow()
            )
            session.add(weather)
            await session.commit()
