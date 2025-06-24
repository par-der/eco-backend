from fastapi import FastAPI
from app.api import weather
from app.api import pollution

app = FastAPI(title="Экомониторинг Москвы")

app.include_router(weather.router, prefix="/api/weather")
# app.include_router(pollution.router, prefix="/pollution")
# app.include_router(prediction.router, prefix="/prediction")
app.include_router(pollution.router, prefix="/api/air")

@app.get("/")
def root():
    return {"message": "Экомониторинг запущен"}

# добавить Авто-обновление раз в час