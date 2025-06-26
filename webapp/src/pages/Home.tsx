import { useEffect, useState } from 'react';
import { MapView } from '../components/MapView';
import { InfoCard } from '../components/InfoCard';
import { getWeather, type Weather } from '../api/weather';
import { getAir, type Air } from '../api/air';
import { useTelegram } from '../hooks/useTelegram';

export default function Home() {
  const [w, setW] = useState<Weather>();
  const [a, setA] = useState<Air>();
  useTelegram();

  useEffect(() => {
    getWeather().then(setW);
    getAir().then(setA);
  }, []);

  return (
    <div className="flex flex-col gap-4 p-2">
      <MapView />
      <InfoCard w={w} a={a} />
    </div>
  );
}