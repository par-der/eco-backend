import os, time, hashlib, httpx
from datetime import datetime
from app.db.session import AsyncSessionLocal
from app.models.pollution import Pollution
from sqlalchemy.ext.asyncio import AsyncSession

BASE_URL     = "https://nebo.live/api/v2"
TOKEN        = os.getenv("NEBO_TOKEN")
CODE         = os.getenv("NEBO_CODE")
CITY_SLUG    = os.getenv("NEBO_CITY_SLUG", "moscow")

def _auth_params() -> dict:
    """Считает time + hash по правилам Nebo."""
    ts   = int(time.time())
    full = hashlib.sha1(f"{ts}{CODE}".encode()).hexdigest()
    hash_ = full[5:16]      # символы с 5 по 15 включительно
    return {"time": ts, "hash": hash_}

async def fetch_city_air(session: AsyncSession):
    url     = f"{BASE_URL}/cities/{CITY_SLUG}"
    headers = {"X-Auth-Nebo": TOKEN}
    params  = _auth_params()

    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(url, headers=headers, params=params)
        print("NEBO ERROR:", r.status_code, r.text)
        sensors = r.json()          # список всех датчиков города

    # берём мгновенные значения каждого сенсора → усредняем
    if not sensors:
        return

    pm25 = pm10 = co = so2 = aqi = 0
    n    = len(sensors)

    for s in sensors:
        inst = s.get("instant") or {}
        pm25 += inst.get("pm25", 0) or 0
        pm10 += inst.get("pm10", 0) or 0
        co   += inst.get("co",   0) or 0
        so2  += inst.get("so2",  0) or 0
        aqi  += inst.get("aqi",  0) or 0

    # средние цифры по городу
    pm25 /= n; pm10 /= n; co /= n; so2 /= n; aqi //= n

    async with AsyncSessionLocal() as session:
        obj = Pollution(
            city_slug=CITY_SLUG,
            pm25=pm25, pm10=pm10, co=co, so2=so2, aqi=aqi,
            timestamp=datetime.utcnow()
        )
        session.add(obj)
        await session.commit()
