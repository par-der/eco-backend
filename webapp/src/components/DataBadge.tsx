type Props = { temp?: number; aqi?: number };

export default function DataBadge({ temp, aqi }: Props) {
  if (temp == null && aqi == null) return null;

  return (
    <button
      className="
        fixed top-3 right-3 z-50
        rounded-full bg-emerald-600/90 px-4 py-2
        text-sm font-medium text-white shadow-lg
      "
    >
      {temp != null && `${temp.toFixed(1)}°C`}{" "}
      {aqi != null && `· AQI ${aqi}`}
    </button>
  );
}