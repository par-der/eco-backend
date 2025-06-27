import { X } from 'lucide-react';
import type { Weather } from '../api/weather';
import type { Air } from '../api/air';

type Props = {
  weather?: Weather;
  air?: Air;
  activeView: 'temperature' | 'air';
  onClose: () => void;
};

const getAQIStatus = (aqi: number) => {
  if (aqi <= 50) return { text: 'Хорошо', color: 'text-green-600', bg: 'bg-green-100' };
  if (aqi <= 100) return { text: 'Умеренно', color: 'text-yellow-600', bg: 'bg-yellow-100' };
  if (aqi <= 150) return { text: 'Нездорово для чувствительных', color: 'text-orange-600', bg: 'bg-orange-100' };
  if (aqi <= 200) return { text: 'Нездорово', color: 'text-red-600', bg: 'bg-red-100' };
  if (aqi <= 300) return { text: 'Очень нездорово', color: 'text-purple-600', bg: 'bg-purple-100' };
  return { text: 'Опасно', color: 'text-red-800', bg: 'bg-red-200' };
};

const getTempStatus = (temp: number) => {
  if (temp < 0) return { text: 'Очень холодно', color: 'text-blue-800', bg: 'bg-blue-100' };
  if (temp < 10) return { text: 'Холодно', color: 'text-blue-600', bg: 'bg-blue-100' };
  if (temp < 20) return { text: 'Прохладно', color: 'text-cyan-600', bg: 'bg-cyan-100' };
  if (temp < 25) return { text: 'Комфортно', color: 'text-green-600', bg: 'bg-green-100' };
  if (temp < 30) return { text: 'Тепло', color: 'text-orange-600', bg: 'bg-orange-100' };
  return { text: 'Жарко', color: 'text-red-600', bg: 'bg-red-100' };
};

export default function DetailedInfo({ weather, air, activeView, onClose }: Props) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[60vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
      {/* Заголовок с кнопкой закрытия */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          {activeView === 'temperature' ? 'Детали погоды' : 'Детали качества воздуха'}
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-4">
        {activeView === 'temperature' && weather && (
          <div className="space-y-4">
            {/* Основная температура */}
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800 mb-2">
                {weather.temperature.toFixed(1)}°C
              </div>
              <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getTempStatus(weather.temperature).bg} ${getTempStatus(weather.temperature).color}`}>
                {getTempStatus(weather.temperature).text}
              </div>
            </div>

            {/* Дополнительные данные */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Влажность</div>
                <div className="text-xl font-semibold">{weather.humidity}%</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Скорость ветра</div>
                <div className="text-xl font-semibold">{weather.wind_speed} м/с</div>
              </div>
            </div>

            {/* Рекомендации */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Рекомендации</h3>
              <p className="text-sm text-blue-700">
                {weather.temperature < 0 ? 'Одевайтесь теплее, высокий риск обморожения' :
                 weather.temperature < 10 ? 'Рекомендуется теплая одежда' :
                 weather.temperature < 25 ? 'Комфортная температура для прогулок' :
                 weather.temperature < 30 ? 'Легкая одежда, не забывайте пить воду' :
                 'Избегайте длительного пребывания на солнце, пейте больше воды'}
              </p>
            </div>
          </div>
        )}

        {activeView === 'air' && air && (
          <div className="space-y-4">
            {/* Основной AQI */}
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800 mb-2">
                AQI {air.aqi}
              </div>
              <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getAQIStatus(air.aqi).bg} ${getAQIStatus(air.aqi).color}`}>
                {getAQIStatus(air.aqi).text}
              </div>
            </div>

            {/* Подробные показатели */}
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">PM2.5</div>
                  <div className="text-sm text-gray-600">Мелкие частицы</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{air.pm25.toFixed(1)} μg/m³</div>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">PM10</div>
                  <div className="text-sm text-gray-600">Крупные частицы</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{air.pm10.toFixed(1)} μg/m³</div>
                </div>
              </div>
            </div>

            {/* Рекомендации по воздуху */}
            <div className={`p-3 rounded-lg ${getAQIStatus(air.aqi).bg}`}>
              <h3 className={`font-semibold mb-2 ${getAQIStatus(air.aqi).color}`}>Рекомендации</h3>
              <p className={`text-sm ${getAQIStatus(air.aqi).color}`}>
                {air.aqi <= 50 ? 'Качество воздуха хорошее. Можно заниматься активностями на улице.' :
                 air.aqi <= 100 ? 'Умеренное качество воздуха. Чувствительные люди могут испытывать легкий дискомфорт.' :
                 air.aqi <= 150 ? 'Нездорово для чувствительных групп. Ограничьте длительные активности на улице.' :
                 air.aqi <= 200 ? 'Нездоровый воздух. Избегайте длительного пребывания на улице.' :
                 'Очень нездоровый воздух. Минимизируйте выходы на улицу.'}
              </p>
            </div>
          </div>
        )}

        {/* Время обновления */}
        <div className="mt-4 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
          Данные обновляются каждые 5 минут
        </div>
      </div>
    </div>
  );
}