import { useRef, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useHomeScreen, AppIcon as AppIconType } from "@/contexts/HomeScreenContext";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import AppIcon from "./AppIcon";

interface AppGridProps {
  onAppTap: (id: string) => void;
  onLongPress: (app: AppIconType, rect: DOMRect) => void;
}

const APPS_PER_PAGE = 20; // 4 columns x 5 rows

export const AppGrid = ({ onAppTap, onLongPress }: AppGridProps) => {
  const { state, setCurrentPage } = useHomeScreen();
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const visibleApps = state.gridApps.filter(
    (app) => !state.hiddenApps.includes(app.id)
  );

  // Calculate pages
  const totalPages = Math.ceil(visibleApps.length / APPS_PER_PAGE);
  const pages = Array.from({ length: totalPages }, (_, pageIndex) =>
    visibleApps.slice(pageIndex * APPS_PER_PAGE, (pageIndex + 1) * APPS_PER_PAGE)
  );

  // Swipe detection
  const minSwipeDistance = 50;

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && state.currentPage < totalPages - 1) {
      setCurrentPage(state.currentPage + 1);
    }
    if (isRightSwipe && state.currentPage > 0) {
      setCurrentPage(state.currentPage - 1);
    }
  }, [touchStart, touchEnd, state.currentPage, totalPages, setCurrentPage]);

  // Keyboard navigation for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && state.currentPage > 0) {
        setCurrentPage(state.currentPage - 1);
      } else if (e.key === "ArrowRight" && state.currentPage < totalPages - 1) {
        setCurrentPage(state.currentPage + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.currentPage, totalPages, setCurrentPage]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Pages container */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className={cn(
            "flex h-full",
            !reducedMotion && "transition-transform duration-300 ease-out"
          )}
          style={{
            transform: `translateX(-${state.currentPage * 100}%)`,
            width: `${totalPages * 100}%`,
          }}
        >
          {pages.map((pageApps, pageIndex) => (
            <div
              key={pageIndex}
              className="flex-shrink-0 h-full px-4 pt-12 pb-4"
              style={{ width: `${100 / totalPages}%` }}
            >
              <div className="grid grid-cols-4 gap-y-6 gap-x-2 justify-items-center content-start">
                {pageApps.map((app) => (
                  <AppIcon
                    key={app.id}
                    app={app}
                    onTap={onAppTap}
                    onLongPress={onLongPress}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Page indicator dots */}
      {totalPages > 1 && (
        <div
          className="flex justify-center gap-2 pb-4"
          role="tablist"
          aria-label="Home screen pages"
        >
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === state.currentPage
                  ? "bg-foreground w-4"
                  : "bg-foreground/40"
              )}
              onClick={() => setCurrentPage(index)}
              role="tab"
              aria-selected={index === state.currentPage}
              aria-label={`Page ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AppGrid;
