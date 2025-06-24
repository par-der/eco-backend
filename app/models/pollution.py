from sqlalchemy import Column, Integer, Float, DateTime, String
from datetime import datetime
from app.models.base import Base

class Pollution(Base):
    __tablename__ = "pollution"

    id          = Column(Integer, primary_key=True)
    city_slug   = Column(String(64), index=True)
    pm25        = Column(Float)
    pm10        = Column(Float)
    co          = Column(Float)
    so2         = Column(Float)
    aqi         = Column(Integer)
    timestamp   = Column(DateTime, default=datetime.utcnow)
