import {useEffect, useState} from 'react';
import {InfoCard} from '../components/InfoCard';
import {getWeather, type Weather} from '../api/weather';
import {getAir, type Air} from '../api/air';
import {useTelegram} from '../hooks/useTelegram';
import Map2gis from '../components/Map2gis';
import DataBadge from "../components/DataBadge.tsx";
import DetailedInfo from "../components/DetailedInfo.tsx";
import ControlPanel from "../components/ControlPanel";

export default function Home() {
    const [w, setW] = useState<Weather>();
    const [a, setA] = useState<Air>();
    const [activeView, setActiveView] = useState<'temperature' | 'air'>('temperature');
    const [showDetails, setShowDetails] = useState(false);
    useTelegram();

    useEffect(() => {
        const load = () => {
            getWeather().then(setW);
            getAir().then(setA);
        };
        load();                         // первый вызов
        const id = setInterval(load, 5 * 60_000);   // далее каждые 5 мин
        return () => clearInterval(id);
    }, []);

    const handleViewChange = (view: 'temperature' | 'air') => {
        setActiveView(view);
        setShowDetails(false); // закрываем детали при переключении
    };

    const handleDetailsToggle = () => {
        setShowDetails(!showDetails);
    };

    return (
        <div className="relative h-screen w-screen overflow-hidden">
            {/* Карта во всю площадь */}
            <Map2gis
                temperature={w?.temperature}
                aqi={a?.aqi}
                activeView={activeView}
            />

            <ControlPanel
                activeView={activeView}
                onViewChange={handleViewChange}
                onDetailsToggle={handleDetailsToggle}
                showDetails={showDetails}
            />

            {/* Плашка-бейдж в правом верхнем углу */}
            <DataBadge temp={w?.temperature} aqi={a?.aqi}/>

            {/* Информационная карточка — «плавающая» у нижнего края */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <InfoCard w={w} a={a}/>
            </div>

            {showDetails && (
                <DetailedInfo
                    weather={w}
                    air={a}
                    activeView={activeView}
                    onClose={() => setShowDetails(false)}
                />
            )}
        </div>
    );
}