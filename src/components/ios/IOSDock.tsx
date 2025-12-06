import { cn } from "@/lib/utils";
import { useHomeScreen, AppIcon as AppIconType } from "@/contexts/HomeScreenContext";
import AppIcon from "./AppIcon";

interface IOSDockProps {
  onAppTap: (id: string) => void;
  onLongPress: (app: AppIconType, rect: DOMRect) => void;
}

export const IOSDock = ({ onAppTap, onLongPress }: IOSDockProps) => {
  const { state, isEditMode } = useHomeScreen();
  const visibleApps = state.dockApps.filter(
    (app) => !state.hiddenApps.includes(app.id)
  );

  return (
    <nav
      className={cn(
        "fixed bottom-4 left-4 right-4 z-40",
        "flex items-center justify-center gap-2 px-4 py-2",
        "bg-background/60 backdrop-blur-xl rounded-3xl",
        "border border-border/30 shadow-lg",
        "safe-area-bottom"
      )}
      role="toolbar"
      aria-label="Dock"
    >
      {visibleApps.map((app) => (
        <AppIcon
          key={app.id}
          app={app}
          onTap={onAppTap}
          onLongPress={onLongPress}
          inDock
        />
      ))}

      {/* Done button in edit mode */}
      {isEditMode && (
        <DoneButton />
      )}
    </nav>
  );
};

const DoneButton = () => {
  const { setEditMode } = useHomeScreen();

  return (
    <button
      className={cn(
        "absolute -top-12 right-4 px-4 py-2",
        "bg-primary text-primary-foreground font-semibold rounded-full",
        "shadow-lg transition-transform active:scale-95"
      )}
      onClick={() => setEditMode(false)}
    >
      Done
    </button>
  );
};

export default IOSDock;
