import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useTheme } from "./ThemeContext";

// Wallpaper definitions - easily extendable
export interface Wallpaper {
  id: string;
  name: string;
  type: "gradient" | "image";
  value: string; // CSS gradient or image URL
  thumbnail?: string;
  forTheme?: "light" | "dark" | "both"; // Which theme this wallpaper is for
}

// Theme-specific wallpapers (the uploaded images)
export const THEME_WALLPAPERS: Record<"light" | "dark", Wallpaper> = {
  dark: {
    id: "theme-dark",
    name: "Eyad Dark",
    type: "image",
    value: "/wallpapers/wallpaper-dark.png",
    forTheme: "dark",
  },
  light: {
    id: "theme-light",
    name: "Eyad Light",
    type: "image",
    value: "/wallpapers/wallpaper-light.png",
    forTheme: "light",
  },
};

export const WALLPAPERS: Wallpaper[] = [
  // Theme-matching wallpapers (auto-switch with theme)
  {
    id: "auto",
    name: "Auto (Theme)",
    type: "image",
    value: "", // Will be determined by theme
    forTheme: "both",
  },
  // Dark wallpapers
  THEME_WALLPAPERS.dark,
  {
    id: "aurora",
    name: "Aurora",
    type: "gradient",
    value: "linear-gradient(135deg, hsl(220, 60%, 12%) 0%, hsl(260, 40%, 15%) 50%, hsl(200, 50%, 10%) 100%)",
    forTheme: "dark",
  },
  {
    id: "ocean",
    name: "Ocean",
    type: "gradient",
    value: "linear-gradient(135deg, hsl(200, 70%, 15%) 0%, hsl(180, 60%, 12%) 50%, hsl(220, 50%, 18%) 100%)",
    forTheme: "dark",
  },
  {
    id: "midnight",
    name: "Midnight",
    type: "gradient",
    value: "linear-gradient(135deg, hsl(240, 50%, 8%) 0%, hsl(260, 40%, 12%) 50%, hsl(220, 60%, 6%) 100%)",
    forTheme: "dark",
  },
  {
    id: "cosmic",
    name: "Cosmic",
    type: "gradient",
    value: "linear-gradient(135deg, hsl(280, 60%, 15%) 0%, hsl(320, 50%, 12%) 50%, hsl(260, 40%, 18%) 100%)",
    forTheme: "dark",
  },
  // Light wallpapers
  THEME_WALLPAPERS.light,
  {
    id: "daylight",
    name: "Daylight",
    type: "gradient",
    value: "linear-gradient(135deg, hsl(200, 80%, 85%) 0%, hsl(220, 70%, 90%) 50%, hsl(180, 60%, 88%) 100%)",
    forTheme: "light",
  },
  {
    id: "morning",
    name: "Morning",
    type: "gradient",
    value: "linear-gradient(135deg, hsl(40, 70%, 90%) 0%, hsl(200, 60%, 88%) 50%, hsl(220, 50%, 92%) 100%)",
    forTheme: "light",
  },
  {
    id: "cloud",
    name: "Cloud",
    type: "gradient",
    value: "linear-gradient(135deg, hsl(210, 40%, 96%) 0%, hsl(220, 30%, 92%) 50%, hsl(200, 35%, 94%) 100%)",
    forTheme: "light",
  },
];

interface WallpaperContextType {
  currentWallpaper: Wallpaper;
  effectiveWallpaper: Wallpaper; // The actual wallpaper being displayed (resolves "auto")
  setWallpaper: (id: string) => void;
  wallpapers: Wallpaper[];
}

const WallpaperContext = createContext<WallpaperContextType | undefined>(undefined);

const WALLPAPER_STORAGE_KEY = "mac_portfolio.wallpaper";

export function WallpaperProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  
  const [currentWallpaper, setCurrentWallpaper] = useState<Wallpaper>(() => {
    const savedId = localStorage.getItem(WALLPAPER_STORAGE_KEY);
    return WALLPAPERS.find((w) => w.id === savedId) || WALLPAPERS[0]; // Default to "auto"
  });

  // Compute the effective wallpaper (resolves "auto" based on theme)
  const effectiveWallpaper: Wallpaper = currentWallpaper.id === "auto"
    ? THEME_WALLPAPERS[theme]
    : currentWallpaper;

  // Auto-switch wallpaper when theme changes if "auto" is selected
  useEffect(() => {
    // This effect just triggers a re-render when theme changes
    // The effectiveWallpaper computed value handles the switch
  }, [theme]);

  const setWallpaper = (id: string) => {
    const wallpaper = WALLPAPERS.find((w) => w.id === id);
    if (wallpaper) {
      setCurrentWallpaper(wallpaper);
      localStorage.setItem(WALLPAPER_STORAGE_KEY, id);
    }
  };

  return (
    <WallpaperContext.Provider value={{ 
      currentWallpaper, 
      effectiveWallpaper,
      setWallpaper, 
      wallpapers: WALLPAPERS 
    }}>
      {children}
    </WallpaperContext.Provider>
  );
}

export function useWallpaper() {
  const context = useContext(WallpaperContext);
  if (!context) {
    throw new Error("useWallpaper must be used within a WallpaperProvider");
  }
  return context;
}
