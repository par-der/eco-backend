import type {Weather} from '../api/weather';
import type {Air} from '../api/air';

export const InfoCard = ({ w, a }: { w: Weather | undefined; a: Air | undefined }) => (
  <div className="rounded-xl p-4 shadow bg-white/80 backdrop-blur">
    {w && (
      <>
        <h2 className="font-semibold">Погода</h2>
        <p>🌡 {w.temperature} °C</p>
        <p>💧 {w.humidity}%</p>
        <p>💨 {w.wind_speed} м/с</p>
      </>
    )}
    {a && (
      <>
        <h2 className="font-semibold mt-2">Воздух</h2>
        <p>AQI {a.aqi}</p>
        <p>PM2.5 {a.pm25.toFixed(1)}</p>
        <p>PM10 {a.pm10.toFixed(1)}</p>
      </>
    )}
  </div>
);