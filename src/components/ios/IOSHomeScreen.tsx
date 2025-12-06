import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useWallpaper } from "@/contexts/WallpaperContext";
import { useHomeScreen, AppIcon as AppIconType } from "@/contexts/HomeScreenContext";
import { DockItemId } from "@/components/macos/Dock";
import IOSStatusBar from "./IOSStatusBar";
import AppGrid from "./AppGrid";
import IOSDock from "./IOSDock";
import QuickActionsMenu from "./QuickActionsMenu";
import FullScreenApp from "./FullScreenApp";

interface IOSHomeScreenProps {
  onBootComplete?: () => void;
}

export const IOSHomeScreen = ({ onBootComplete }: IOSHomeScreenProps) => {
  const { effectiveWallpaper } = useWallpaper();
  const { setEditMode } = useHomeScreen();
  
  const [activeApp, setActiveApp] = useState<DockItemId | "settings" | null>(null);
  const [launchRect, setLaunchRect] = useState<DOMRect | undefined>();
  const [quickActionsMenu, setQuickActionsMenu] = useState<{
    app: AppIconType;
    position: { x: number; y: number };
  } | null>(null);

  // Handle app tap
  const handleAppTap = useCallback((id: string) => {
    // Handle external links
    if (id === "github") {
      window.open("https://github.com", "_blank");
      return;
    }
    if (id === "linkedin") {
      window.open("https://linkedin.com", "_blank");
      return;
    }

    setActiveApp(id as DockItemId | "settings");
  }, []);

  // Handle long press
  const handleLongPress = useCallback((app: AppIconType, rect: DOMRect) => {
    // Haptic feedback would go here on real device
    setLaunchRect(rect);
    setQuickActionsMenu({
      app,
      position: { x: rect.left, y: rect.bottom + 8 },
    });
  }, []);

  // Handle quick action
  const handleQuickAction = useCallback((appId: string, actionId: string) => {
    // Open the app - in a real app you'd handle specific actions
    setActiveApp(appId as DockItemId | "settings");
  }, []);

  // Close active app
  const handleCloseApp = useCallback(() => {
    setActiveApp(null);
    setLaunchRect(undefined);
  }, []);

  // Enter edit mode
  const handleEnterEditMode = useCallback(() => {
    setEditMode(true);
    setQuickActionsMenu(null);
  }, [setEditMode]);

  // Wallpaper background style
  const backgroundStyle =
    effectiveWallpaper.type === "image"
      ? {
          backgroundImage: `url(${effectiveWallpaper.value})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : {
          background: effectiveWallpaper.value,
        };

  return (
    <div
      className={cn("fixed inset-0 flex flex-col overflow-hidden")}
      style={backgroundStyle}
    >
      {/* Status Bar */}
      <IOSStatusBar />

      {/* App Grid */}
      <AppGrid onAppTap={handleAppTap} onLongPress={handleLongPress} />

      {/* Dock */}
      <IOSDock onAppTap={handleAppTap} onLongPress={handleLongPress} />

      {/* Quick Actions Menu */}
      {quickActionsMenu && (
        <QuickActionsMenu
          app={quickActionsMenu.app}
          position={quickActionsMenu.position}
          onAction={handleQuickAction}
          onClose={() => setQuickActionsMenu(null)}
          onEnterEditMode={handleEnterEditMode}
        />
      )}

      {/* Full Screen App */}
      {activeApp && (
        <FullScreenApp
          appId={activeApp}
          onClose={handleCloseApp}
          launchRect={launchRect}
        />
      )}
    </div>
  );
};

export default IOSHomeScreen;
