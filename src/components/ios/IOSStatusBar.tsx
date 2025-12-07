import { useState, useEffect, useRef } from "react";
import { Signal, Wifi, Battery } from "lucide-react";
import { cn } from "@/lib/utils";

interface IOSStatusBarProps {
  variant?: "light" | "dark" | "auto";
  onSwipeDown?: () => void;
}

export const IOSStatusBar = ({ variant = "auto", onSwipeDown }: IOSStatusBarProps) => {
  const [time, setTime] = useState(new Date());
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    
    const currentY = e.touches[0].clientY;
    if (currentY - touchStartY.current > 50) {
      onSwipeDown?.();
      touchStartY.current = null;
    }
  };

  const handleTouchEnd = () => {
    touchStartY.current = null;
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-14 px-8",
        "flex items-center justify-between"
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-hidden="true"
    >
      {/* Time (left) */}
      <span 
        className="font-semibold text-[15px] text-white tracking-tight"
        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
      >
        {formattedTime}
      </span>

      {/* Dynamic Island (center) */}
      <div className="absolute left-1/2 -translate-x-1/2 top-3">
        <div 
          className="w-[126px] h-[37px] bg-black rounded-[20px]"
          style={{ boxShadow: "0 0 0 0.5px rgba(255,255,255,0.05)" }}
        />
      </div>

      {/* Status icons (right) */}
      <div className="flex items-center gap-1 text-white">
        <Signal className="w-[17px] h-[17px]" strokeWidth={2.5} />
        <Wifi className="w-[17px] h-[17px]" strokeWidth={2.5} />
        <div className="flex items-center">
          <span 
            className="text-[12px] font-medium mr-0.5"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
          >
            100
          </span>
          <Battery className="w-[25px] h-[12px]" strokeWidth={1.5} />
        </div>
      </div>
    </header>
  );
};

export default IOSStatusBar;
