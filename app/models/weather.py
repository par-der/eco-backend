from sqlalchemy import Column, Integer, Float, DateTime, String
from app.models.base import Base
from datetime import datetime

class Weather(Base):
    __tablename__ = "weather"

    id          = Column(Integer, primary_key=True)
    temperature = Column(Float)
    humidity    = Column(Float)
    wind_speed  = Column(Float)
    description = Column(String(255))
    timestamp   = Column(DateTime, default=datetime.utcnow)
