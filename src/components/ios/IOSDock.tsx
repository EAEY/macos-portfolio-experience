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
        "fixed bottom-6 left-4 right-4 z-40",
        "flex items-center justify-evenly px-4 py-2.5",
        "bg-black/20 backdrop-blur-2xl rounded-[32px]",
        "border border-white/10",
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
      {isEditMode && <DoneButton />}
    </nav>
  );
};

const DoneButton = () => {
  const { setEditMode } = useHomeScreen();

  return (
    <button
      className={cn(
        "absolute -top-14 right-4 px-5 py-2.5",
        "bg-primary text-primary-foreground font-semibold rounded-full",
        "shadow-lg transition-all duration-200",
        "active:scale-95 hover:bg-primary/90",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
      onClick={() => setEditMode(false)}
    >
      Done
    </button>
  );
};

export default IOSDock;
