import { useState, useCallback } from "react";
import BootScreen from "@/components/macos/BootScreen";
import Desktop from "@/components/macos/Desktop";
import MenuBar from "@/components/macos/MenuBar";
import Dock, { DockItemId } from "@/components/macos/Dock";
import SpotlightSearch from "@/components/macos/SpotlightSearch";

const Index = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [activeWindows, setActiveWindows] = useState<DockItemId[]>([]);
  const [minimizedWindows, setMinimizedWindows] = useState<DockItemId[]>([]);
  const [activeWindowTitle, setActiveWindowTitle] = useState<string | undefined>();

  const handleBootComplete = useCallback(() => {
    setIsBooting(false);
  }, []);

  const handleOpenWindow = useCallback((id: DockItemId) => {
    // If minimized, restore it
    if (minimizedWindows.includes(id)) {
      setMinimizedWindows((prev) => prev.filter((w) => w !== id));
    }

    // Add to active windows if not already open
    if (!activeWindows.includes(id)) {
      setActiveWindows((prev) => [...prev, id]);
    }

    // Set as active title
    const titles: Record<DockItemId, string> = {
      about: "About",
      skills: "Skills",
      projects: "Projects",
      experiences: "Experiences",
      contact: "Contact",
      cv: "CV",
      github: "GitHub",
      linkedin: "LinkedIn",
    };
    setActiveWindowTitle(titles[id]);
  }, [activeWindows, minimizedWindows]);

  const handleSpotlightOpen = useCallback(() => {
    setIsSpotlightOpen(true);
  }, []);

  const handleSpotlightClose = useCallback(() => {
    setIsSpotlightOpen(false);
  }, []);

  return (
    <>
      {/* Boot Screen */}
      {isBooting && <BootScreen onComplete={handleBootComplete} />}

      {/* Desktop Environment */}
      <Desktop>
        {/* Windows will be rendered here in Phase 2 */}
        {activeWindows.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-lg animate-fade-in">
              Click an icon in the dock to get started
            </p>
          </div>
        )}

        {/* Temporary: Show active windows as placeholder */}
        {activeWindows.map((id) => (
          <div
            key={id}
            className="absolute inset-x-0 top-0 mx-auto mt-8 max-w-md glass rounded-xl p-6 animate-window-open"
            style={{ top: `${activeWindows.indexOf(id) * 30 + 50}px` }}
          >
            <p className="text-lg font-semibold capitalize">{id} Window</p>
            <p className="text-muted-foreground text-sm mt-2">
              Full window implementation coming in Phase 2
            </p>
          </div>
        ))}
      </Desktop>

      {/* Menu Bar */}
      <MenuBar
        activeWindowTitle={activeWindowTitle}
        onSpotlightOpen={handleSpotlightOpen}
      />

      {/* Dock */}
      <Dock
        onItemClick={handleOpenWindow}
        activeWindows={activeWindows}
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
