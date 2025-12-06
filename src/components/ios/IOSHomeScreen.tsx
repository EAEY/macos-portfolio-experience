import { useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { useWallpaper } from "@/contexts/WallpaperContext";
import { useHomeScreen, AppIcon as AppIconType } from "@/contexts/HomeScreenContext";
import { DockItemId } from "@/components/macos/Dock";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import IOSStatusBar from "./IOSStatusBar";
import AppGrid from "./AppGrid";
import IOSDock from "./IOSDock";
import QuickActionsMenu from "./QuickActionsMenu";
import FullScreenApp from "./FullScreenApp";
import ControlCenter from "./ControlCenter";
import IOSWidgetPanel from "./widgets/IOSWidgetPanel";

interface IOSHomeScreenProps {
  onBootComplete?: () => void;
}

export const IOSHomeScreen = ({ onBootComplete }: IOSHomeScreenProps) => {
  const { effectiveWallpaper } = useWallpaper();
  const { setEditMode } = useHomeScreen();
  const reducedMotion = usePrefersReducedMotion();
  
  const [activeApp, setActiveApp] = useState<DockItemId | "settings" | null>(null);
  const [launchRect, setLaunchRect] = useState<DOMRect | undefined>();
  const [quickActionsMenu, setQuickActionsMenu] = useState<{
    app: AppIconType;
    position: { x: number; y: number };
  } | null>(null);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [showWidgets, setShowWidgets] = useState(true);

  // Store icon ref for close animation
  const iconRefs = useRef<Map<string, DOMRect>>(new Map());

  // Handle app tap
  const handleAppTap = useCallback((id: string, rect?: DOMRect) => {
    // Handle external links
    if (id === "github") {
      window.open("https://github.com", "_blank");
      return;
    }
    if (id === "linkedin") {
      window.open("https://linkedin.com", "_blank");
      return;
    }

    if (rect) {
      iconRefs.current.set(id, rect);
      setLaunchRect(rect);
    }
    setActiveApp(id as DockItemId | "settings");
  }, []);

  // Handle long press
  const handleLongPress = useCallback((app: AppIconType, rect: DOMRect) => {
    iconRefs.current.set(app.id, rect);
    setLaunchRect(rect);
    setQuickActionsMenu({
      app,
      position: { x: rect.left, y: rect.bottom + 8 },
    });
  }, []);

  // Handle quick action
  const handleQuickAction = useCallback((appId: string, actionId: string) => {
    const rect = iconRefs.current.get(appId);
    if (rect) setLaunchRect(rect);
    setActiveApp(appId as DockItemId | "settings");
    setQuickActionsMenu(null);
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

  // Control center
  const handleOpenControlCenter = useCallback(() => {
    setIsControlCenterOpen(true);
  }, []);

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
      className={cn("fixed inset-0 flex flex-col overflow-hidden ios-home-screen")}
      style={backgroundStyle}
    >
      {/* Frosted wallpaper overlay */}
      <div className="absolute inset-0 ios-wallpaper-blur pointer-events-none" />
      
      {/* Status Bar */}
      <IOSStatusBar onSwipeDown={handleOpenControlCenter} />

      {/* Widgets Panel */}
      {showWidgets && (
        <div className="pt-14">
          <IOSWidgetPanel onProjectsTap={() => handleAppTap("projects")} />
        </div>
      )}

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

      {/* Control Center */}
      <ControlCenter
        isOpen={isControlCenterOpen}
        onClose={() => setIsControlCenterOpen(false)}
      />

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
