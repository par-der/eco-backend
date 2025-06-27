import { useEffect, useRef } from 'react';
import { load } from '@2gis/mapgl';

type Props = {
  temperature?: number;
  aqi?: number;
  activeView: 'temperature' | 'air';
};

// Функция для получения цвета на основе температуры
const getTemperatureColor = (temp: number): string => {
  if (temp < 0) return 'rgba(59, 130, 246, 0.3)'; // синий для морозов
  if (temp < 10) return 'rgba(147, 197, 253, 0.3)'; // светло-синий для холода
  if (temp < 20) return 'rgba(251, 146, 60, 0.3)'; // прозрачно-оранжевый 10-20°C
  if (temp < 30) return 'rgba(239, 68, 68, 0.3)'; // красно-прозрачный 20-30°C
  return 'rgba(220, 38, 38, 0.5)'; // более насыщенный красный для жары
};

// Функция для получения цвета на основе AQI
const getAirQualityColor = (aqi: number): string => {
  if (aqi <= 50) return 'rgba(34, 197, 94, 0.3)'; // зеленый
  if (aqi <= 100) return 'rgba(251, 191, 36, 0.3)'; // желтый
  if (aqi <= 150) return 'rgba(251, 146, 60, 0.3)'; // оранжевый
  if (aqi <= 200) return 'rgba(239, 68, 68, 0.3)'; // красный
  if (aqi <= 300) return 'rgba(147, 51, 234, 0.3)'; // фиолетовый
  return 'rgba(127, 29, 29, 0.4)'; // темно-красный
};

export default function Map2gis({ temperature, aqi, activeView }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const circleRef = useRef<any>(null);

  useEffect(() => {
    if (!ref.current) return;

    load().then(({ Map, CircleMarker }) => {
      mapRef.current = new Map(ref.current!, {
        key: import.meta.env.VITE_2GIS_KEY,
        center: [37.6208, 55.7547], // Москва
        zoom: 11,
        style: 'c080bb6a-8134-4993-93a1-5b4d8c36a59b', // можно использовать разные стили
      });

      // Создаем круговой маркер для визуализации данных
      const createCircleOverlay = () => {
        if (circleRef.current) {
          mapRef.current.removeMarker(circleRef.current);
        }

        let color = 'rgba(100, 100, 100, 0.2)';
        let radius = 15000; // базовый радиус в метрах

        if (activeView === 'temperature' && temperature !== undefined) {
          color = getTemperatureColor(temperature);
          radius = Math.max(10000, Math.min(25000, 15000 + Math.abs(temperature - 15) * 500));
        } else if (activeView === 'air' && aqi !== undefined) {
          color = getAirQualityColor(aqi);
          radius = Math.max(10000, Math.min(25000, 10000 + aqi * 100));
        }

        circleRef.current = new CircleMarker(mapRef.current, {
          coordinates: [37.6208, 55.7547],
          radius: radius,
          color: color,
          strokeColor: color.replace('0.3', '0.6').replace('0.4', '0.7').replace('0.5', '0.8'),
          strokeWidth: 2,
        });
      };

      createCircleOverlay();

      // Обработчик клика по карте
      mapRef.current.on('click', (event: any) => {
        console.log('Клик по карте:', event.lngLat);
        // Здесь можно добавить логику для добавления новых точек мониторинга
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
        circleRef.current = null;
      }
    };
  }, []);

  // Обновляем цветовую индикацию при изменении данных или активного вида
  useEffect(() => {
    if (!mapRef.current) return;

    const updateOverlay = () => {
      if (circleRef.current) {
        circleRef.current.destroy();
      }

      let color = 'rgba(100, 100, 100, 0.2)';
      let radius = 15000;

      if (activeView === 'temperature' && temperature !== undefined) {
        color = getTemperatureColor(temperature);
        radius = Math.max(10000, Math.min(25000, 15000 + Math.abs(temperature - 15) * 500));
      } else if (activeView === 'air' && aqi !== undefined) {
        color = getAirQualityColor(aqi);
        radius = Math.max(10000, Math.min(25000, 10000 + aqi * 100));
      }

      // Создаем новый CircleMarker через динамический импорт
      load().then(({ CircleMarker }) => {
        circleRef.current = new CircleMarker(mapRef.current, {
          coordinates: [37.6208, 55.7547],
          radius: radius,
          color: color,
          strokeColor: color.replace('0.3', '0.6').replace('0.4', '0.7').replace('0.5', '0.8'),
          strokeWidth: 2,
        });
      });
    };

    updateOverlay();
  }, [temperature, aqi, activeView]);

  return (
    <div className="relative h-full w-full">
      <div ref={ref} className="h-full w-full" />

      {/* Легенда для цветов */}
      <div className="absolute bottom-20 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg text-xs max-w-48">
        <h4 className="font-semibold mb-2">
          {activeView === 'temperature' ? 'Температура' : 'Качество воздуха'}
        </h4>

        {activeView === 'temperature' ? (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(59, 130, 246, 0.6)' }}></div>
              <span>&lt; 0°C</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(147, 197, 253, 0.6)' }}></div>
              <span>0-10°C</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(251, 146, 60, 0.6)' }}></div>
              <span>10-20°C</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(239, 68, 68, 0.6)' }}></div>
              <span>20-30°C</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(220, 38, 38, 0.8)' }}></div>
              <span>&gt; 30°C</span>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(34, 197, 94, 0.6)' }}></div>
              <span>Хорошо (0-50)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(251, 191, 36, 0.6)' }}></div>
              <span>Умеренно (51-100)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(251, 146, 60, 0.6)' }}></div>
              <span>Нездорово (101-150)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(239, 68, 68, 0.6)' }}></div>
              <span>Вредно (151-200)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(147, 51, 234, 0.6)' }}></div>
              <span>Опасно (201+)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}