import { useEffect, useRef } from "react";
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

  // Scroll to top when app opens
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [appId]);

  if (!appData) return null;

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed inset-0 z-50 bg-background flex flex-col overflow-hidden",
        !reducedMotion && "animate-app-launch"
      )}
      style={getInitialTransform()}
      role="dialog"
      aria-modal="true"
      aria-label={appData.title}
    >
      {/* App Header */}
      <header className="flex-shrink-0 flex items-center gap-3 px-4 pt-12 pb-3 border-b border-border/50 bg-background">
        <button
          onClick={onClose}
          className={cn(
            "flex items-center gap-1 text-primary font-medium",
            "p-2 -ml-2 rounded-lg transition-colors",
            "hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
          aria-label="Go back to home screen"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-lg font-semibold flex-1 text-center pr-16">
          {appData.title}
        </h1>
      </header>

      {/* App Content */}
      <main className="flex-1 overflow-y-auto overscroll-contain">
        <div className="p-4 pb-8">{appData.component}</div>
      </main>

      {/* Home indicator */}
      <div className="flex-shrink-0 h-8 flex items-center justify-center pb-2">
        <div className="w-32 h-1 bg-foreground/30 rounded-full" />
      </div>
    </div>
  );
};

export default FullScreenApp;
