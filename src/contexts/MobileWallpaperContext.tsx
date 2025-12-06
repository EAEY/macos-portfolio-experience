import { createContext, useContext, useState, ReactNode } from "react";

// Mobile-specific wallpapers (separate from desktop)
export interface MobileWallpaper {
  id: string;
  name: string;
  lockscreen: string;
  homescreen: string;
}

export const MOBILE_WALLPAPERS: MobileWallpaper[] = [
  {
    id: "default",
    name: "Default",
    lockscreen: "/mobile/wallpapers/lockscreen.jpg",
    homescreen: "/mobile/wallpapers/homescreen.jpg",
  },
];

interface MobileWallpaperContextType {
  currentWallpaper: MobileWallpaper;
  setWallpaper: (id: string) => void;
  wallpapers: MobileWallpaper[];
}

const MobileWallpaperContext = createContext<MobileWallpaperContextType | undefined>(undefined);

const MOBILE_WALLPAPER_STORAGE_KEY = "ios_portfolio.mobile_wallpaper";

export function MobileWallpaperProvider({ children }: { children: ReactNode }) {
  const [currentWallpaper, setCurrentWallpaper] = useState<MobileWallpaper>(() => {
    const savedId = localStorage.getItem(MOBILE_WALLPAPER_STORAGE_KEY);
    return MOBILE_WALLPAPERS.find((w) => w.id === savedId) || MOBILE_WALLPAPERS[0];
  });

  const setWallpaper = (id: string) => {
    const wallpaper = MOBILE_WALLPAPERS.find((w) => w.id === id);
    if (wallpaper) {
      setCurrentWallpaper(wallpaper);
      localStorage.setItem(MOBILE_WALLPAPER_STORAGE_KEY, id);
    }
  };

  return (
    <MobileWallpaperContext.Provider value={{ 
      currentWallpaper, 
      setWallpaper, 
      wallpapers: MOBILE_WALLPAPERS 
    }}>
      {children}
    </MobileWallpaperContext.Provider>
  );
}

export function useMobileWallpaper() {
  const context = useContext(MobileWallpaperContext);
  if (!context) {
    throw new Error("useMobileWallpaper must be used within a MobileWallpaperProvider");
  }
  return context;
}
