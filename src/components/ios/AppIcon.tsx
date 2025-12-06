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

  const iconSize = inDock ? "w-14 h-14" : "w-16 h-16";
  const labelSize = inDock ? "text-[10px]" : "text-[11px]";

  return (
    <button
      ref={iconRef}
      className={cn(
        "flex flex-col items-center gap-1 p-2 rounded-2xl touch-manipulation select-none transition-transform",
        isPressed && !isEditMode && "scale-90",
        isDragging && "opacity-50",
        isEditMode && !reducedMotion && "animate-wiggle",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
      style={
        isDragging && dragOffset
          ? {
              transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
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
          className="absolute -top-1 -left-1 w-5 h-5 bg-secondary border border-border rounded-full flex items-center justify-center z-10 shadow-sm"
          onClick={handleRemove}
          onTouchEnd={handleRemove}
          aria-label={`Remove ${app.label}`}
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Icon */}
      <div
        className={cn(
          iconSize,
          "rounded-2xl overflow-hidden shadow-lg relative bg-secondary"
        )}
      >
        <img
          src={app.icon}
          alt=""
          className="w-full h-full object-cover"
          draggable={false}
        />
        {/* Badge */}
        {app.badge !== undefined && app.badge > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
            {app.badge > 99 ? "99+" : app.badge}
          </span>
        )}
      </div>

      {/* Label */}
      <span
        className={cn(
          labelSize,
          "font-medium text-center line-clamp-1 max-w-[64px] drop-shadow-sm"
        )}
        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
      >
        {app.label}
      </span>
    </button>
  );
};

export default AppIcon;
