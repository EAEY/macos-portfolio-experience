import { createContext, useContext, useState, ReactNode } from "react";

// Wallpaper definitions - easily extendable
export interface Wallpaper {
  id: string;
  name: string;
  type: "gradient" | "image";
  value: string; // CSS gradient or image URL
  thumbnail?: string;
}

export const WALLPAPERS: Wallpaper[] = [
  {
    id: "default",
    name: "Aurora",
    type: "gradient",
    value: "linear-gradient(135deg, hsl(220, 60%, 12%) 0%, hsl(260, 40%, 15%) 50%, hsl(200, 50%, 10%) 100%)",
  },
  {
    id: "ocean",
    name: "Ocean",
    type: "gradient",
    value: "linear-gradient(135deg, hsl(200, 70%, 15%) 0%, hsl(180, 60%, 12%) 50%, hsl(220, 50%, 18%) 100%)",
  },
  {
    id: "sunset",
    name: "Sunset",
    type: "gradient",
    value: "linear-gradient(135deg, hsl(350, 60%, 18%) 0%, hsl(30, 50%, 15%) 50%, hsl(280, 40%, 12%) 100%)",
  },
  {
    id: "forest",
    name: "Forest",
    type: "gradient",
    value: "linear-gradient(135deg, hsl(140, 50%, 12%) 0%, hsl(160, 40%, 15%) 50%, hsl(180, 30%, 10%) 100%)",
  },
  {
    id: "midnight",
    name: "Midnight",
    type: "gradient",
    value: "linear-gradient(135deg, hsl(240, 50%, 8%) 0%, hsl(260, 40%, 12%) 50%, hsl(220, 60%, 6%) 100%)",
  },
  {
    id: "cosmic",
    name: "Cosmic",
    type: "gradient",
    value: "linear-gradient(135deg, hsl(280, 60%, 15%) 0%, hsl(320, 50%, 12%) 50%, hsl(260, 40%, 18%) 100%)",
  },
];

interface WallpaperContextType {
  currentWallpaper: Wallpaper;
  setWallpaper: (id: string) => void;
  wallpapers: Wallpaper[];
}

const WallpaperContext = createContext<WallpaperContextType | undefined>(undefined);

const WALLPAPER_STORAGE_KEY = "mac_portfolio.wallpaper";

export function WallpaperProvider({ children }: { children: ReactNode }) {
  const [currentWallpaper, setCurrentWallpaper] = useState<Wallpaper>(() => {
    const savedId = localStorage.getItem(WALLPAPER_STORAGE_KEY);
    return WALLPAPERS.find((w) => w.id === savedId) || WALLPAPERS[0];
  });

  const setWallpaper = (id: string) => {
    const wallpaper = WALLPAPERS.find((w) => w.id === id);
    if (wallpaper) {
      setCurrentWallpaper(wallpaper);
      localStorage.setItem(WALLPAPER_STORAGE_KEY, id);
    }
  };

  return (
    <WallpaperContext.Provider value={{ currentWallpaper, setWallpaper, wallpapers: WALLPAPERS }}>
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
