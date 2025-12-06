import { Cloud, Sun, CloudRain, CloudSnow, Wind } from "lucide-react";

// Mock weather data - in production, connect to a weather API
const MOCK_WEATHER = {
  current: {
    temp: 22,
    condition: "sunny" as const,
    humidity: 45,
    wind: 12,
    location: "San Francisco",
  },
  forecast: [
    { day: "Mon", temp: 24, condition: "sunny" as const },
    { day: "Tue", temp: 21, condition: "cloudy" as const },
    { day: "Wed", temp: 19, condition: "rainy" as const },
  ],
};

const CONDITION_ICONS = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: CloudSnow,
  windy: Wind,
};

const CONDITION_COLORS = {
  sunny: "text-yellow-500",
  cloudy: "text-gray-400",
  rainy: "text-blue-400",
  snowy: "text-blue-200",
  windy: "text-gray-500",
};

export const WeatherWidget = () => {
  const { current, forecast } = MOCK_WEATHER;
  const CurrentIcon = CONDITION_ICONS[current.condition];

  return (
    <div className="flex flex-col h-full">
      {/* Current weather */}
      <div className="flex items-center gap-3 mb-4">
        <CurrentIcon className={`w-10 h-10 ${CONDITION_COLORS[current.condition]}`} />
        <div>
          <div className="text-3xl font-light">{current.temp}°</div>
          <div className="text-xs text-muted-foreground">{current.location}</div>
        </div>
      </div>

      {/* Details */}
      <div className="flex gap-4 mb-4 text-xs text-muted-foreground">
        <span>Humidity: {current.humidity}%</span>
        <span>Wind: {current.wind} km/h</span>
      </div>

      {/* Forecast */}
      <div className="flex-1 flex items-end">
        <div className="flex gap-3 w-full">
          {forecast.map((day) => {
            const DayIcon = CONDITION_ICONS[day.condition];
            return (
              <div
                key={day.day}
                className="flex-1 text-center p-2 rounded-lg bg-foreground/5"
              >
                <div className="text-[10px] text-muted-foreground mb-1">{day.day}</div>
                <DayIcon className={`w-5 h-5 mx-auto ${CONDITION_COLORS[day.condition]}`} />
                <div className="text-xs font-medium mt-1">{day.temp}°</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
