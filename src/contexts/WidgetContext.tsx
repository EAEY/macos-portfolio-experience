import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

export type WidgetType = "clock" | "weather" | "calendar" | "system" | "notes" | "reminders";

export interface WidgetState {
  id: string;
  type: WidgetType;
  position: { x: number; y: number };
  size: "small" | "medium" | "large";
  isPinned: boolean;
  isMinimized: boolean;
}

interface WidgetContextType {
  widgets: WidgetState[];
  addWidget: (type: WidgetType) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, updates: Partial<WidgetState>) => void;
  toggleWidgetPin: (id: string) => void;
  toggleWidgetMinimize: (id: string) => void;
  showWidgets: boolean;
  setShowWidgets: (show: boolean) => void;
}

const WidgetContext = createContext<WidgetContextType | undefined>(undefined);

const WIDGETS_STORAGE_KEY = "mac_portfolio.widgets";
const GRID_SIZE = 20;

// Snap position to grid
const snapToGrid = (value: number): number => Math.round(value / GRID_SIZE) * GRID_SIZE;

// Get initial position for new widget
const getInitialPosition = (existingWidgets: WidgetState[]): { x: number; y: number } => {
  const baseX = 50;
  const baseY = 80;
  const offset = existingWidgets.length * 30;
  return {
    x: snapToGrid(baseX + offset),
    y: snapToGrid(baseY + offset),
  };
};

export function WidgetProvider({ children }: { children: ReactNode }) {
  const [widgets, setWidgets] = useState<WidgetState[]>(() => {
    const saved = localStorage.getItem(WIDGETS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [showWidgets, setShowWidgets] = useState(true);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(WIDGETS_STORAGE_KEY, JSON.stringify(widgets));
  }, [widgets]);

  const addWidget = useCallback((type: WidgetType) => {
    const id = `${type}-${Date.now()}`;
    const position = getInitialPosition(widgets);
    
    setWidgets((prev) => [
      ...prev,
      {
        id,
        type,
        position,
        size: "medium",
        isPinned: false,
        isMinimized: false,
      },
    ]);
  }, [widgets]);

  const removeWidget = useCallback((id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const updateWidget = useCallback((id: string, updates: Partial<WidgetState>) => {
    setWidgets((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              ...updates,
              position: updates.position
                ? { x: snapToGrid(updates.position.x), y: snapToGrid(updates.position.y) }
                : w.position,
            }
          : w
      )
    );
  }, []);

  const toggleWidgetPin = useCallback((id: string) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isPinned: !w.isPinned } : w))
    );
  }, []);

  const toggleWidgetMinimize = useCallback((id: string) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: !w.isMinimized } : w))
    );
  }, []);

  return (
    <WidgetContext.Provider
      value={{
        widgets,
        addWidget,
        removeWidget,
        updateWidget,
        toggleWidgetPin,
        toggleWidgetMinimize,
        showWidgets,
        setShowWidgets,
      }}
    >
      {children}
    </WidgetContext.Provider>
  );
}

export function useWidgets() {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error("useWidgets must be used within a WidgetProvider");
  }
  return context;
}
