import { useState, useCallback, useRef } from "react";
import BootScreen from "@/components/macos/BootScreen";
import Desktop from "@/components/macos/Desktop";
import MenuBar from "@/components/macos/MenuBar";
import Dock, { DockItemId } from "@/components/macos/Dock";
import SpotlightSearch from "@/components/macos/SpotlightSearch";
import WindowManager from "@/components/macos/WindowManager";

const windowTitles: Record<DockItemId, string> = {
  about: "About",
  skills: "Skills",
  projects: "Projects",
  experiences: "Experiences",
  contact: "Contact",
  cv: "CV",
  github: "GitHub",
  linkedin: "LinkedIn",
};

const Index = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [openWindows, setOpenWindows] = useState<DockItemId[]>([]);
  const [minimizedWindows, setMinimizedWindows] = useState<DockItemId[]>([]);
  const [activeWindow, setActiveWindow] = useState<DockItemId | null>(null);

  // Refs for dock icons (for minimize animation)
  const dockIconRefs = useRef<Record<DockItemId, React.RefObject<HTMLButtonElement>>>({
    about: { current: null },
    skills: { current: null },
    projects: { current: null },
    experiences: { current: null },
    contact: { current: null },
    cv: { current: null },
    github: { current: null },
    linkedin: { current: null },
  });

  const handleBootComplete = useCallback(() => {
    setIsBooting(false);
  }, []);

  const handleOpenWindow = useCallback((id: DockItemId) => {
    // External links - open in new tab
    if (id === "github") {
      window.open("https://github.com", "_blank");
      return;
    }
    if (id === "linkedin") {
      window.open("https://linkedin.com", "_blank");
      return;
    }

    // If minimized, restore it
    if (minimizedWindows.includes(id)) {
      setMinimizedWindows((prev) => prev.filter((w) => w !== id));
    }

    // Add to open windows if not already open
    if (!openWindows.includes(id)) {
      setOpenWindows((prev) => [...prev, id]);
    }

    // Set as active window
    setActiveWindow(id);
  }, [openWindows, minimizedWindows]);

  const handleCloseWindow = useCallback((id: DockItemId) => {
    setOpenWindows((prev) => prev.filter((w) => w !== id));
    setMinimizedWindows((prev) => prev.filter((w) => w !== id));
    
    // Clear active window if it was the closed one
    setActiveWindow((prev) => (prev === id ? null : prev));
    
    // Clear localStorage for this window
    localStorage.removeItem(`window_${id}`);
  }, []);

  const handleMinimizeWindow = useCallback((id: DockItemId) => {
    setMinimizedWindows((prev) => [...prev, id]);
    setActiveWindow((prev) => (prev === id ? null : prev));
  }, []);

  const handleFocusWindow = useCallback((id: DockItemId) => {
    setActiveWindow(id);
  }, []);

  const handleSpotlightOpen = useCallback(() => {
    setIsSpotlightOpen(true);
  }, []);

  const handleSpotlightClose = useCallback(() => {
    setIsSpotlightOpen(false);
  }, []);

  const activeWindowTitle = activeWindow ? windowTitles[activeWindow] : undefined;

  return (
    <>
      {/* Boot Screen */}
      {isBooting && <BootScreen onComplete={handleBootComplete} />}

      {/* Desktop Environment */}
      <Desktop>
        {/* Empty state */}
        {openWindows.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-lg animate-fade-in">
              Click an icon in the dock to get started
            </p>
          </div>
        )}

        {/* Window Manager */}
        <WindowManager
          openWindows={openWindows}
          minimizedWindows={minimizedWindows}
          activeWindow={activeWindow}
          onCloseWindow={handleCloseWindow}
          onMinimizeWindow={handleMinimizeWindow}
          onFocusWindow={handleFocusWindow}
          dockIconRefs={dockIconRefs.current}
        />
      </Desktop>

      {/* Menu Bar */}
      <MenuBar
        activeWindowTitle={activeWindowTitle}
        onSpotlightOpen={handleSpotlightOpen}
      />

      {/* Dock */}
      <Dock
        onItemClick={handleOpenWindow}
        activeWindows={openWindows}
        minimizedWindows={minimizedWindows}
      />

      {/* Spotlight Search */}
      <SpotlightSearch
        isOpen={isSpotlightOpen}
        onClose={handleSpotlightClose}
        onOpenWindow={handleOpenWindow}
      />
    </>
  );
};

export default Index;
