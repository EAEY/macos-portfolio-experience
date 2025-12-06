import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { DockItemId } from "@/components/macos/Dock";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import AboutWindow from "@/components/macos/windows/AboutWindow";
import SkillsWindow from "@/components/macos/windows/SkillsWindow";
import ProjectsWindow from "@/components/macos/windows/ProjectsWindow";
import ExperiencesWindow from "@/components/macos/windows/ExperiencesWindow";
import ContactWindow from "@/components/macos/windows/ContactWindow";
import CVWindow from "@/components/macos/windows/CVWindow";
import SettingsWindow from "@/components/macos/windows/SettingsWindow";
import FinderWindow from "@/components/macos/windows/FinderWindow";
import HomeIndicator from "./HomeIndicator";

interface FullScreenAppProps {
  appId: DockItemId | "settings";
  onClose: () => void;
  launchRect?: DOMRect;
}

const APP_CONTENT: Record<string, { title: string; component: React.ReactNode }> = {
  about: { title: "About", component: <AboutWindow /> },
  skills: { title: "Skills", component: <SkillsWindow /> },
  projects: { title: "Projects", component: <ProjectsWindow /> },
  experiences: { title: "Experience", component: <ExperiencesWindow /> },
  contact: { title: "Contact", component: <ContactWindow /> },
  cv: { title: "CV", component: <CVWindow /> },
  settings: { title: "Settings", component: <SettingsWindow /> },
  finder: { title: "Finder", component: <FinderWindow /> },
};

export const FullScreenApp = ({ appId, onClose, launchRect }: FullScreenAppProps) => {
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const appData = APP_CONTENT[appId];
  
  // Swipe up to close state
  const [swipeY, setSwipeY] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);

  // Calculate initial transform for launch animation
  const getInitialTransform = () => {
    if (!launchRect || reducedMotion) return {};
    const centerX = launchRect.left + launchRect.width / 2;
    const centerY = launchRect.top + launchRect.height / 2;
    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;
    
    return {
      "--launch-x": `${centerX - viewportCenterX}px`,
      "--launch-y": `${centerY - viewportCenterY}px`,
    } as React.CSSProperties;
  };

  // Handle swipe up to dismiss
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Only start swipe from bottom 80px of screen
    const touchY = e.touches[0].clientY;
    if (touchY > window.innerHeight - 80) {
      touchStartY.current = touchY;
      touchStartTime.current = Date.now();
      setIsSwiping(true);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (touchStartY.current === null || !isSwiping) return;
    
    const currentY = e.touches[0].clientY;
    const diff = touchStartY.current - currentY;
    
    // Only track upward swipes
    if (diff > 0) {
      setSwipeY(Math.min(diff, window.innerHeight * 0.5));
    }
  }, [isSwiping]);

  const handleTouchEnd = useCallback(() => {
    if (!isSwiping) return;
    
    const swipeTime = Date.now() - touchStartTime.current;
    const swipeThreshold = window.innerHeight * 0.25;
    const isQuickSwipe = swipeTime < 300 && swipeY > 50;
    
    if (swipeY > swipeThreshold || isQuickSwipe) {
      // Close the app
      setIsClosing(true);
      setTimeout(() => {
        onClose();
      }, reducedMotion ? 0 : 280);
    } else {
      // Spring back
      setSwipeY(0);
    }
    
    touchStartY.current = null;
    setIsSwiping(false);
  }, [swipeY, isSwiping, onClose, reducedMotion]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Scroll to top when app opens
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [appId]);

  if (!appData) return null;

  const swipeProgress = swipeY / (window.innerHeight * 0.3);
  const scale = 1 - (swipeProgress * 0.1);
  const opacity = 1 - (swipeProgress * 0.3);
  const borderRadius = swipeProgress * 24;

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed inset-0 z-50 flex flex-col overflow-hidden",
        "ios-app-container",
        !reducedMotion && !isClosing && "animate-ios-app-open",
        isClosing && !reducedMotion && "animate-ios-app-close"
      )}
      style={{
        ...getInitialTransform(),
        transform: swipeY > 0 ? `translateY(${swipeY * 0.3}px) scale(${scale})` : undefined,
        opacity: swipeY > 0 ? opacity : undefined,
        borderRadius: swipeY > 0 ? `${borderRadius}px` : undefined,
        transition: !isSwiping ? "transform 0.3s cubic-bezier(0.2, 0.9, 0.2, 1), opacity 0.3s, border-radius 0.3s" : "none",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label={appData.title}
    >
      {/* App Header - Frosted glass */}
      <header className="flex-shrink-0 flex items-center gap-3 px-4 pt-12 pb-3 ios-app-header">
        <button
          onClick={onClose}
          className={cn(
            "flex items-center gap-1 text-primary font-semibold",
            "p-2 -ml-2 rounded-xl transition-all duration-200",
            "hover:bg-secondary/50 active:scale-95",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
          aria-label="Go back to home screen"
        >
          <ChevronLeft className="w-6 h-6" />
          <span>Back</span>
        </button>
        <h1 className="text-lg font-semibold flex-1 text-center pr-16">
          {appData.title}
        </h1>
      </header>

      {/* App Content */}
      <main className="flex-1 overflow-y-auto overscroll-contain bg-background">
        <div className="p-4 pb-8">{appData.component}</div>
      </main>

      {/* Home indicator - swipe up affordance */}
      <div className="flex-shrink-0 h-10 flex items-center justify-center bg-background">
        <HomeIndicator className="opacity-50" />
      </div>
    </div>
  );
};

export default FullScreenApp;
