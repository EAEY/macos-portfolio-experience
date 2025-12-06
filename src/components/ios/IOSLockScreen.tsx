import { useState, useRef, useCallback, useEffect } from "react";
import { Signal, Wifi, Battery, Flashlight, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

interface IOSLockScreenProps {
  onUnlock: () => void;
}

export const IOSLockScreen = ({ onUnlock }: IOSLockScreenProps) => {
  const [time, setTime] = useState(new Date());
  const [swipeY, setSwipeY] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const startY = useRef(0);
  const reducedMotion = usePrefersReducedMotion();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  const formattedDate = time.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    setIsSwiping(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isSwiping) return;
    const currentY = e.touches[0].clientY;
    const diff = startY.current - currentY;
    // Only allow upward swipe
    if (diff > 0) {
      setSwipeY(Math.min(diff, window.innerHeight));
    }
  }, [isSwiping]);

  const handleTouchEnd = useCallback(() => {
    setIsSwiping(false);
    // If swiped more than 30% of screen height, unlock
    if (swipeY > window.innerHeight * 0.3) {
      setIsUnlocking(true);
      setTimeout(onUnlock, 300);
    } else {
      setSwipeY(0);
    }
  }, [swipeY, onUnlock]);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        setIsUnlocking(true);
        setTimeout(onUnlock, 300);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onUnlock]);

  const opacity = Math.max(0, 1 - swipeY / (window.innerHeight * 0.5));
  const translateY = isUnlocking ? -window.innerHeight : -swipeY;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col overflow-hidden touch-manipulation",
        !reducedMotion && "transition-transform duration-300 ease-out"
      )}
      style={{
        transform: `translateY(${translateY}px)`,
        backgroundImage: "url('/mobile/wallpapers/lockscreen.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="dialog"
      aria-label="Lock screen. Swipe up or press Enter to unlock."
      tabIndex={0}
    >
      {/* Status Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-12 px-6 flex items-center justify-between">
        {/* Time (left) */}
        <span className="font-semibold text-sm text-white drop-shadow-md">{formattedTime.split(":")[0]}:{formattedTime.split(":")[1].split(" ")[0]}</span>

        {/* Dynamic Island (center) */}
        <div className="flex-1 flex justify-center">
          <div className="w-28 h-7 bg-black rounded-full" />
        </div>

        {/* Status icons (right) */}
        <div className="flex items-center gap-1.5 text-white drop-shadow-md">
          <Signal className="w-4 h-4" strokeWidth={2.5} />
          <Wifi className="w-4 h-4" strokeWidth={2.5} />
          <div className="relative">
            <Battery className="w-6 h-6" strokeWidth={1.5} />
            <div className="absolute top-[5px] left-[3px] w-[14px] h-[10px] bg-current rounded-sm opacity-80" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div 
        className="flex-1 flex flex-col items-center pt-24"
        style={{ opacity }}
      >
        {/* Date */}
        <span className="text-white/90 text-lg font-medium tracking-wide drop-shadow-lg">
          {formattedDate}
        </span>

        {/* Large Time - iOS style with depth effect */}
        <div className="relative mt-2">
          {/* Background glow layer */}
          <span 
            className="absolute inset-0 text-[86px] font-bold tracking-tight text-white/20 blur-md"
            aria-hidden="true"
          >
            {formattedTime.split(" ")[0]}
          </span>
          {/* Main time with glass effect */}
          <span 
            className="relative text-[86px] font-bold tracking-tight"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 4px 30px rgba(0,0,0,0.15)",
            }}
          >
            {formattedTime.split(" ")[0]}
          </span>
        </div>
      </div>

      {/* Bottom Quick Actions */}
      <div className="absolute bottom-8 left-0 right-0 px-8">
        <div className="flex justify-between items-center">
          {/* Flashlight button */}
          <button 
            className="w-14 h-14 rounded-full bg-black/30 backdrop-blur-xl flex items-center justify-center border border-white/10"
            aria-label="Flashlight"
          >
            <Flashlight className="w-6 h-6 text-white" />
          </button>

          {/* Camera button */}
          <button 
            className="w-14 h-14 rounded-full bg-black/30 backdrop-blur-xl flex items-center justify-center border border-white/10"
            aria-label="Camera"
          >
            <Camera className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Home indicator */}
        <div className="mt-6 flex justify-center">
          <div className="w-36 h-1.5 bg-white/60 rounded-full" />
        </div>
      </div>

      {/* Swipe hint */}
      <div 
        className={cn(
          "absolute bottom-24 left-0 right-0 text-center",
          !reducedMotion && "animate-pulse"
        )}
        style={{ opacity: opacity * 0.6 }}
      >
        <span className="text-white/60 text-sm font-medium">Swipe up to unlock</span>
      </div>
    </div>
  );
};

export default IOSLockScreen;
