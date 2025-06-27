import { Thermometer, Wind, Info } from 'lucide-react';

interface ControlPanelProps {
  activeView: 'temperature' | 'air';
  onViewChange: (view: 'temperature' | 'air') => void;
  onDetailsToggle: () => void;
  showDetails: boolean;
}

export default function ControlPanel({
  activeView,
  onViewChange,
  onDetailsToggle,
  showDetails
}: ControlPanelProps) {
  return (
    <div className="absolute top-4 left-4 z-40 flex gap-2">
      {/* Кнопка температуры */}
      <button
        onClick={() => onViewChange('temperature')}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium
          transition-all duration-200 shadow-lg backdrop-blur-sm
          ${activeView === 'temperature' 
            ? 'bg-orange-500 text-white shadow-orange-500/25' 
            : 'bg-white/80 text-gray-700 hover:bg-white/90'
          }
        `}
      >
        <Thermometer size={18} />
        <span className="hidden sm:inline">Температура</span>
      </button>

      {/* Кнопка качества воздуха */}
      <button
        onClick={() => onViewChange('air')}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium
          transition-all duration-200 shadow-lg backdrop-blur-sm
          ${activeView === 'air' 
            ? 'bg-blue-500 text-white shadow-blue-500/25' 
            : 'bg-white/80 text-gray-700 hover:bg-white/90'
          }
        `}
      >
        <Wind size={18} />
        <span className="hidden sm:inline">Воздух</span>
      </button>

      {/* Кнопка детальной информации */}
      <button
        onClick={onDetailsToggle}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium
          transition-all duration-200 shadow-lg backdrop-blur-sm
          ${showDetails 
            ? 'bg-emerald-500 text-white shadow-emerald-500/25' 
            : 'bg-white/80 text-gray-700 hover:bg-white/90'
          }
        `}
      >
        <Info size={18} />
        <span className="hidden sm:inline">Подробно</span>
      </button>
    </div>
  );
}