import { useState, useEffect } from "react";

interface ClockWidgetProps {
  showAnalog?: boolean;
}

export const ClockWidget = ({ showAnalog = true }: ClockWidgetProps) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // Analog clock hand rotations
  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-3">
      {showAnalog && (
        <div className="relative w-28 h-28 rounded-full border-2 border-foreground/20 bg-background/30">
          {/* Clock face markers */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-2 bg-foreground/40 left-1/2 -translate-x-1/2"
              style={{
                transform: `translateX(-50%) rotate(${i * 30}deg)`,
                transformOrigin: "50% 56px",
              }}
            />
          ))}
          
          {/* Hour hand */}
          <div
            className="absolute w-1 h-8 bg-foreground rounded-full left-1/2 bottom-1/2 origin-bottom"
            style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)` }}
          />
          
          {/* Minute hand */}
          <div
            className="absolute w-0.5 h-10 bg-foreground rounded-full left-1/2 bottom-1/2 origin-bottom"
            style={{ transform: `translateX(-50%) rotate(${minuteDeg}deg)` }}
          />
          
          {/* Second hand */}
          <div
            className="absolute w-px h-11 bg-destructive rounded-full left-1/2 bottom-1/2 origin-bottom"
            style={{ transform: `translateX(-50%) rotate(${secondDeg}deg)` }}
          />
          
          {/* Center dot */}
          <div className="absolute w-2 h-2 bg-foreground rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      )}

      <div className="text-center">
        <div className="text-xl font-semibold tabular-nums">{formatTime(time)}</div>
        <div className="text-xs text-muted-foreground mt-1">{formatDate(time)}</div>
      </div>
    </div>
  );
};

export default ClockWidget;
