import { useState, useEffect } from "react";
import { Signal, Wifi, Battery } from "lucide-react";
import { cn } from "@/lib/utils";

interface IOSStatusBarProps {
  variant?: "light" | "dark" | "auto";
  onSwipeDown?: () => void;
}

export const IOSStatusBar = ({ variant = "auto", onSwipeDown }: IOSStatusBarProps) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  // Handle swipe down for control center
  const handleTouchStart = (e: React.TouchEvent) => {
    const startY = e.touches[0].clientY;
    
    const handleTouchMove = (moveEvent: TouchEvent) => {
      const currentY = moveEvent.touches[0].clientY;
      if (currentY - startY > 50) {
        onSwipeDown?.();
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      }
    };
    
    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
    
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-12 px-6",
        "flex items-center justify-between",
        "ios-status-bar"
      )}
      onTouchStart={handleTouchStart}
      aria-hidden="true"
    >
      {/* Time (left) */}
      <span className="font-semibold text-sm ios-status-text">{formattedTime}</span>

      {/* Dynamic Island / Notch spacer (center) */}
      <div className="flex-1 flex justify-center">
        <div className="w-28 h-7 bg-black rounded-full" />
      </div>

      {/* Status icons (right) */}
      <div className="flex items-center gap-1.5 ios-status-text">
        <Signal className="w-4 h-4" strokeWidth={2.5} />
        <Wifi className="w-4 h-4" strokeWidth={2.5} />
        <div className="relative">
          <Battery className="w-6 h-6" strokeWidth={1.5} />
          <div className="absolute top-[5px] left-[3px] w-[14px] h-[10px] bg-current rounded-sm opacity-80" />
        </div>
      </div>
    </header>
  );
};

export default IOSStatusBar;
