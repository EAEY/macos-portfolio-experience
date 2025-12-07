import { useState, useRef, useCallback, useEffect } from "react";
import { Signal, Wifi, Battery, Flashlight, Camera, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { useMobileWallpaper } from "@/contexts/MobileWallpaperContext";

interface IOSLockScreenProps {
  onUnlock: () => void;
}

export const IOSLockScreen = ({ onUnlock }: IOSLockScreenProps) => {
  const { currentWallpaper } = useMobileWallpaper();
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

  const hours = time.toLocaleTimeString([], { hour: "numeric", hour12: false });
  const minutes = time.toLocaleTimeString([], { minute: "2-digit" });
  
  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
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
    if (diff > 0) {
      setSwipeY(Math.min(diff, window.innerHeight));
    }
  }, [isSwiping]);

  const handleTouchEnd = useCallback(() => {
    setIsSwiping(false);
    if (swipeY > window.innerHeight * 0.25) {
      setIsUnlocking(true);
      setTimeout(onUnlock, reducedMotion ? 0 : 400);
    } else {
      setSwipeY(0);
    }
  }, [swipeY, onUnlock, reducedMotion]);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        setIsUnlocking(true);
        setTimeout(onUnlock, reducedMotion ? 0 : 400);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onUnlock, reducedMotion]);

  const swipeProgress = Math.min(swipeY / (window.innerHeight * 0.4), 1);
  const contentOpacity = 1 - swipeProgress * 0.8;
  const contentScale = 1 - swipeProgress * 0.1;
  const translateY = isUnlocking ? -window.innerHeight : -swipeY * 0.6;
  const blurAmount = swipeProgress * 20;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col overflow-hidden touch-manipulation select-none",
        !reducedMotion && "transition-transform duration-[400ms] ease-out"
      )}
      style={{
        transform: `translateY(${translateY}px)`,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="dialog"
      aria-label="Lock screen. Swipe up or press Enter to unlock."
      tabIndex={0}
    >
      {/* Wallpaper with blur effect on swipe */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${currentWallpaper.lockscreen}')`,
          filter: `blur(${blurAmount}px)`,
          transform: `scale(${1 + blurAmount * 0.01})`,
        }}
      />

      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

      {/* Status Bar */}
      <header className="relative z-50 h-14 px-8 flex items-center justify-between">
        {/* Time (left) - iOS style */}
        <span className="font-semibold text-[15px] text-white tracking-tight">
          {time.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
        </span>

        {/* Dynamic Island (center) */}
        <div className="absolute left-1/2 -translate-x-1/2 top-3">
          <div className="w-[126px] h-[37px] bg-black rounded-[20px]" />
        </div>

        {/* Status icons (right) */}
        <div className="flex items-center gap-1 text-white">
          <Signal className="w-[18px] h-[18px]" strokeWidth={2} />
          <Wifi className="w-[18px] h-[18px]" strokeWidth={2} />
          <div className="flex items-center gap-0.5">
            <span className="text-[12px] font-medium">100</span>
            <Battery className="w-[25px] h-[13px]" strokeWidth={1.5} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div 
        className="relative flex-1 flex flex-col items-center pt-20"
        style={{ 
          opacity: contentOpacity,
          transform: `scale(${contentScale})`,
          transition: !isSwiping ? "opacity 0.3s, transform 0.3s" : "none",
        }}
      >
        {/* Lock Icon */}
        <div className="mb-2">
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
            <Lock className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Date */}
        <span className="text-white/90 text-[20px] font-normal tracking-wide">
          {formattedDate}
        </span>

        {/* Large Time - iOS 17 style with depth layers */}
        <div className="relative mt-0 flex items-baseline justify-center">
          <span 
            className="text-[96px] font-bold tracking-[-4px] leading-none"
            style={{
              color: "white",
              textShadow: "0 2px 20px rgba(0,0,0,0.3)",
            }}
          >
            {hours}
          </span>
          <span 
            className="text-[96px] font-bold tracking-[-4px] leading-none mx-1"
            style={{
              color: "white",
              textShadow: "0 2px 20px rgba(0,0,0,0.3)",
            }}
          >
            :
          </span>
          <span 
            className="text-[96px] font-bold tracking-[-4px] leading-none"
            style={{
              color: "white",
              textShadow: "0 2px 20px rgba(0,0,0,0.3)",
            }}
          >
            {minutes}
          </span>
        </div>

        {/* Notification placeholder area */}
        <div className="mt-8 w-full px-6 flex-1">
          {/* Notifications would go here */}
        </div>
      </div>

      {/* Bottom Section */}
      <div 
        className="relative pb-2 px-6"
        style={{ 
          opacity: contentOpacity,
          transition: !isSwiping ? "opacity 0.3s" : "none",
        }}
      >
        {/* Quick Action Buttons */}
        <div className="flex justify-between items-center mb-4">
          {/* Flashlight */}
          <button 
            className="w-[50px] h-[50px] rounded-full bg-black/30 backdrop-blur-xl flex items-center justify-center active:scale-95 transition-transform"
            style={{ boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.2)" }}
            aria-label="Flashlight"
          >
            <Flashlight className="w-6 h-6 text-white" />
          </button>

          {/* Camera */}
          <button 
            className="w-[50px] h-[50px] rounded-full bg-black/30 backdrop-blur-xl flex items-center justify-center active:scale-95 transition-transform"
            style={{ boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.2)" }}
            aria-label="Camera"
          >
            <Camera className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Swipe hint text */}
        <p 
          className={cn(
            "text-center text-white/70 text-[13px] font-medium mb-2",
            !reducedMotion && "animate-pulse"
          )}
          style={{ opacity: 1 - swipeProgress }}
        >
          Swipe up to unlock
        </p>

        {/* Home Indicator */}
        <div className="flex justify-center pb-2">
          <div className="w-[134px] h-[5px] bg-white rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default IOSLockScreen;
