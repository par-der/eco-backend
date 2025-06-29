from fastapi import FastAPI
from app.api import weather
from app.api import pollution
from app.services.scheduler import start_scheduler
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Экомониторинг Москвы")

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(weather.router, prefix="/api/weather")
# app.include_router(pollution.router, prefix="/pollution")
# app.include_router(prediction.router, prefix="/prediction")
app.include_router(pollution.router, prefix="/api/air")
app.mount("/webapp", StaticFiles(directory="webapp/dist", html=True), name="webapp")

@app.get("/")
def root():
    return {"message": "Экомониторинг запущен"}

@app.on_event("startup")
async def on_startup():
    start_scheduler()

@app.on_event("shutdown")
async def on_shutdown():
    pass