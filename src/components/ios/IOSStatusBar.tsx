import { useState, useEffect } from "react";
import { Signal, Wifi, Battery } from "lucide-react";
import { cn } from "@/lib/utils";

export const IOSStatusBar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-11 px-6",
        "flex items-center justify-between",
        "bg-transparent text-foreground"
      )}
      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
      aria-hidden="true"
    >
      {/* Time (left) */}
      <span className="font-semibold text-sm">{formattedTime}</span>

      {/* Notch spacer (center) */}
      <div className="flex-1" />

      {/* Status icons (right) */}
      <div className="flex items-center gap-1">
        <Signal className="w-4 h-4" />
        <Wifi className="w-4 h-4" />
        <Battery className="w-5 h-5" />
      </div>
    </header>
  );
};

export default IOSStatusBar;
