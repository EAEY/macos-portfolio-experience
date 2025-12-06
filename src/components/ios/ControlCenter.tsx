import { useState, useEffect, useCallback, useRef } from "react";
import {
  Wifi,
  Bluetooth,
  Moon,
  Plane,
  Sun,
  Volume2,
  Camera,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Toggle {
  id: string;
  icon: React.ElementType;
  label: string;
  defaultActive?: boolean;
}

const TOGGLES: Toggle[] = [
  { id: "wifi", icon: Wifi, label: "Wi-Fi", defaultActive: true },
  { id: "bluetooth", icon: Bluetooth, label: "Bluetooth", defaultActive: true },
  { id: "dnd", icon: Moon, label: "Do Not Disturb" },
  { id: "airplane", icon: Plane, label: "Airplane Mode" },
];

export const ControlCenter = ({ isOpen, onClose }: ControlCenterProps) => {
  const { theme, setTheme } = useTheme();
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [toggles, setToggles] = useState<Record<string, boolean>>(() => ({
    wifi: true,
    bluetooth: true,
    dnd: false,
    airplane: false,
  }));
  
  const [brightness, setBrightness] = useState(75);
  const [volume, setVolume] = useState(50);
  const [isClosing, setIsClosing] = useState(false);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus trap
  useEffect(() => {
    if (isOpen && containerRef.current) {
      containerRef.current.focus();
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (reducedMotion) {
      onClose();
    } else {
      setIsClosing(true);
      setTimeout(() => {
        setIsClosing(false);
        onClose();
      }, 280);
    }
  }, [onClose, reducedMotion]);

  const handleToggle = useCallback((id: string) => {
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleThemeToggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  if (!isOpen && !isClosing) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm",
          !reducedMotion && (isClosing ? "animate-fade-out" : "animate-fade-in")
        )}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Control Center Panel */}
      <div
        ref={containerRef}
        tabIndex={-1}
        className={cn(
          "fixed top-0 left-0 right-0 z-[65] max-h-[55vh] overflow-y-auto",
          "ios-liquid-glass rounded-b-3xl",
          "px-4 pt-12 pb-6",
          !reducedMotion && (isClosing ? "animate-cc-slide-up" : "animate-cc-slide-down")
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Control Center"
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className={cn(
            "absolute top-14 right-4 p-2 rounded-full",
            "bg-secondary/50 hover:bg-secondary transition-colors",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
          aria-label="Close Control Center"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Quick Toggles Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {TOGGLES.map((toggle) => (
            <button
              key={toggle.id}
              onClick={() => handleToggle(toggle.id)}
              className={cn(
                "ios-control-tile p-4 flex items-center gap-3",
                toggles[toggle.id] && "active"
              )}
              aria-pressed={toggles[toggle.id]}
              aria-label={toggle.label}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  toggles[toggle.id]
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary"
                )}
              >
                <toggle.icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">{toggle.label}</span>
            </button>
          ))}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={handleThemeToggle}
          className="ios-control-tile p-4 flex items-center gap-3 w-full mb-4"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <Sun className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium">
            {theme === "dark" ? "Dark Mode" : "Light Mode"}
          </span>
        </button>

        {/* Sliders */}
        <div className="space-y-4">
          {/* Brightness */}
          <div className="ios-control-tile p-4">
            <div className="flex items-center gap-3 mb-3">
              <Sun className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium">Brightness</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="ios-slider w-full"
              aria-label="Brightness"
            />
          </div>

          {/* Volume */}
          <div className="ios-control-tile p-4">
            <div className="flex items-center gap-3 mb-3">
              <Volume2 className="w-5 h-5" />
              <span className="text-sm font-medium">Volume</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="ios-slider w-full"
              aria-label="Volume"
            />
          </div>
        </div>

        {/* Quick Actions Row */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          <button
            className="ios-control-tile aspect-square flex flex-col items-center justify-center gap-1"
            aria-label="Take Screenshot"
          >
            <Camera className="w-6 h-6" />
            <span className="text-[10px]">Screenshot</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ControlCenter;
