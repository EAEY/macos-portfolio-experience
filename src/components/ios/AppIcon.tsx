import { useState, useRef, useCallback, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppIcon as AppIconType, useHomeScreen } from "@/contexts/HomeScreenContext";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

interface AppIconProps {
  app: AppIconType;
  onTap: (id: string) => void;
  onLongPress: (app: AppIconType, rect: DOMRect) => void;
  isDragging?: boolean;
  dragOffset?: { x: number; y: number };
  inDock?: boolean;
}

export const AppIcon = ({
  app,
  onTap,
  onLongPress,
  isDragging = false,
  dragOffset,
  inDock = false,
}: AppIconProps) => {
  const { isEditMode, hideApp } = useHomeScreen();
  const reducedMotion = usePrefersReducedMotion();
  const iconRef = useRef<HTMLButtonElement>(null);
  const longPressTimer = useRef<number | null>(null);
  const [isPressed, setIsPressed] = useState(false);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (isEditMode) return;
      setIsPressed(true);
      longPressTimer.current = window.setTimeout(() => {
        if (iconRef.current) {
          const rect = iconRef.current.getBoundingClientRect();
          onLongPress(app, rect);
        }
      }, 500);
    },
    [app, onLongPress, isEditMode]
  );

  const handleTouchEnd = useCallback(() => {
    setIsPressed(false);
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleTouchMove = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleClick = useCallback(() => {
    if (!isEditMode) {
      onTap(app.id);
    }
  }, [app.id, onTap, isEditMode]);

  const handleRemove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      hideApp(app.id);
    },
    [app.id, hideApp]
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  // Squircle icon sizes following iOS specs
  const iconSize = inDock ? "w-[56px] h-[56px]" : "w-[72px] h-[72px]";
  const touchTarget = inDock ? "min-w-[72px] min-h-[72px]" : "min-w-[88px] min-h-[88px]";
  const labelSize = inDock ? "text-[11px]" : "text-[12px]";

  return (
    <button
      ref={iconRef}
      className={cn(
        "relative flex flex-col items-center justify-center gap-1.5 touch-manipulation select-none",
        touchTarget,
        "transition-transform duration-150",
        isPressed && !isEditMode && "scale-[0.92]",
        isDragging && "opacity-60 scale-110",
        isEditMode && !reducedMotion && "animate-wiggle",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      )}
      style={
        isDragging && dragOffset
          ? {
              transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) scale(1.1)`,
              zIndex: 100,
            }
          : undefined
      }
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      aria-label={app.label}
      aria-pressed={isPressed}
    >
      {/* Remove button in edit mode */}
      {isEditMode && (
        <button
          className={cn(
            "absolute -top-0.5 -left-0.5 w-[22px] h-[22px] z-20",
            "bg-secondary/90 border border-border/50 rounded-full",
            "flex items-center justify-center",
            "shadow-md backdrop-blur-sm",
            "active:scale-90 transition-transform"
          )}
          onClick={handleRemove}
          onTouchEnd={handleRemove}
          aria-label={`Remove ${app.label}`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Icon Container with Squircle shape */}
      <div
        className={cn(
          iconSize,
          "ios-app-icon relative overflow-hidden",
          "shadow-ios-icon"
        )}
      >
        {/* Icon image */}
        <img
          src={app.icon}
          alt=""
          className="w-full h-full object-cover"
          draggable={false}
        />
        
        {/* Subtle inner highlight for depth */}
        <div className="absolute inset-0 ios-icon-highlight pointer-events-none" />
        
        {/* Badge */}
        {app.badge !== undefined && app.badge > 0 && (
          <span
            className={cn(
              "absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1.5",
              "bg-destructive text-destructive-foreground",
              "text-[11px] font-bold rounded-full",
              "flex items-center justify-center",
              "shadow-md border border-destructive/50"
            )}
          >
            {app.badge > 99 ? "99+" : app.badge}
          </span>
        )}
      </div>

      {/* Label with text shadow for readability */}
      <span
        className={cn(
          labelSize,
          "font-medium text-center line-clamp-1 max-w-[80px]",
          "ios-icon-label"
        )}
      >
        {app.label}
      </span>
    </button>
  );
};

export default AppIcon;
