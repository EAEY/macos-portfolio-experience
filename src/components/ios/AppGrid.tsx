import { useRef, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useHomeScreen, AppIcon as AppIconType } from "@/contexts/HomeScreenContext";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import AppIcon from "./AppIcon";

interface AppGridProps {
  onAppTap: (id: string) => void;
  onLongPress: (app: AppIconType, rect: DOMRect) => void;
}

const APPS_PER_PAGE = 16; // 4 columns x 4 rows (leaving room for widgets)

export const AppGrid = ({ onAppTap, onLongPress }: AppGridProps) => {
  const { state, setCurrentPage } = useHomeScreen();
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);

  const visibleApps = state.gridApps.filter(
    (app) => !state.hiddenApps.includes(app.id)
  );

  // Calculate pages
  const totalPages = Math.max(1, Math.ceil(visibleApps.length / APPS_PER_PAGE));
  const pages = Array.from({ length: totalPages }, (_, pageIndex) =>
    visibleApps.slice(pageIndex * APPS_PER_PAGE, (pageIndex + 1) * APPS_PER_PAGE)
  );

  // Swipe detection with visual feedback
  const minSwipeDistance = 50;

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setSwipeOffset(0);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const currentX = e.targetTouches[0].clientX;
    setTouchEnd(currentX);
    
    if (touchStart !== null) {
      const diff = currentX - touchStart;
      // Limit swipe offset and add resistance at edges
      const maxOffset = window.innerWidth * 0.3;
      const resistance = 0.4;
      let offset = diff * resistance;
      
      // Add more resistance at page boundaries
      if ((state.currentPage === 0 && diff > 0) || 
          (state.currentPage === totalPages - 1 && diff < 0)) {
        offset *= 0.3;
      }
      
      setSwipeOffset(Math.max(-maxOffset, Math.min(maxOffset, offset)));
    }
  }, [touchStart, state.currentPage, totalPages]);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) {
      setSwipeOffset(0);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && state.currentPage < totalPages - 1) {
      setCurrentPage(state.currentPage + 1);
    }
    if (isRightSwipe && state.currentPage > 0) {
      setCurrentPage(state.currentPage - 1);
    }
    
    setSwipeOffset(0);
    setTouchStart(null);
    setTouchEnd(null);
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
            !reducedMotion && swipeOffset === 0 && "transition-transform duration-300"
          )}
          style={{
            transform: `translateX(calc(-${state.currentPage * 100}% + ${swipeOffset}px))`,
            width: `${totalPages * 100}%`,
            transitionTimingFunction: "cubic-bezier(0.2, 0.9, 0.2, 1)",
          }}
        >
          {pages.map((pageApps, pageIndex) => (
            <div
              key={pageIndex}
              className="flex-shrink-0 h-full px-4 pt-4 pb-4"
              style={{ width: `${100 / totalPages}%` }}
            >
              <div className="grid grid-cols-4 gap-y-4 gap-x-1 justify-items-center content-start">
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
          className="flex justify-center gap-2 pb-2"
          role="tablist"
          aria-label="Home screen pages"
        >
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === state.currentPage
                  ? "w-6 bg-foreground"
                  : "w-2 bg-foreground/40"
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
