import { useState, useRef, useCallback, useEffect, ReactNode } from "react";
import { X, Minus, Pin, PinOff } from "lucide-react";
import { WidgetState } from "@/contexts/WidgetContext";

interface WidgetProps {
  widget: WidgetState;
  onUpdate: (updates: Partial<WidgetState>) => void;
  onRemove: () => void;
  onTogglePin: () => void;
  onToggleMinimize: () => void;
  children: ReactNode;
  title: string;
}

const SIZE_CLASSES = {
  small: "w-40 h-40",
  medium: "w-56 h-56",
  large: "w-72 h-72",
};

export const Widget = ({
  widget,
  onUpdate,
  onRemove,
  onTogglePin,
  onToggleMinimize,
  children,
  title,
}: WidgetProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showControls, setShowControls] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback(
    (e: React.PointerEvent) => {
      if (widget.isPinned) return;
      
      e.preventDefault();
      setIsDragging(true);
      
      const rect = widgetRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    },
    [widget.isPinned]
  );

  const handleDragMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Constrain to viewport
      const maxX = window.innerWidth - 100;
      const maxY = window.innerHeight - 100;

      onUpdate({
        position: {
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(40, Math.min(newY, maxY)),
        },
      });
    },
    [isDragging, dragOffset, onUpdate]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("pointermove", handleDragMove);
      document.addEventListener("pointerup", handleDragEnd);
      return () => {
        document.removeEventListener("pointermove", handleDragMove);
        document.removeEventListener("pointerup", handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  if (widget.isMinimized) {
    return (
      <button
        onClick={onToggleMinimize}
        className="fixed glass rounded-xl px-3 py-1.5 text-xs font-medium hover:bg-foreground/10 transition-colors z-20"
        style={{
          left: widget.position.x,
          top: widget.position.y,
        }}
      >
        {title}
      </button>
    );
  }

  return (
    <div
      ref={widgetRef}
      className={`fixed glass rounded-2xl overflow-hidden z-20 transition-all duration-200 ${
        SIZE_CLASSES[widget.size]
      } ${isDragging ? "cursor-grabbing scale-[1.02] shadow-2xl" : "cursor-grab"}`}
      style={{
        left: widget.position.x,
        top: widget.position.y,
      }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Header */}
      <div
        className="h-7 flex items-center justify-between px-2 bg-foreground/5 select-none"
        onPointerDown={handleDragStart}
      >
        <span className="text-[11px] font-medium text-muted-foreground truncate">
          {title}
        </span>
        
        {/* Controls */}
        <div
          className={`flex items-center gap-1 transition-opacity ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={onTogglePin}
            className="p-0.5 rounded hover:bg-foreground/10 transition-colors"
            aria-label={widget.isPinned ? "Unpin widget" : "Pin widget"}
          >
            {widget.isPinned ? (
              <PinOff className="w-3 h-3 text-muted-foreground" />
            ) : (
              <Pin className="w-3 h-3 text-muted-foreground" />
            )}
          </button>
          <button
            onClick={onToggleMinimize}
            className="p-0.5 rounded hover:bg-foreground/10 transition-colors"
            aria-label="Minimize widget"
          >
            <Minus className="w-3 h-3 text-muted-foreground" />
          </button>
          <button
            onClick={onRemove}
            className="p-0.5 rounded hover:bg-foreground/10 transition-colors"
            aria-label="Close widget"
          >
            <X className="w-3 h-3 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 h-[calc(100%-28px)] overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default Widget;
