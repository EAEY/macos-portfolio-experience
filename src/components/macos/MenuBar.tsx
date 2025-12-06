import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Wifi, Battery, Search, Clock as ClockIcon, Cloud, Calendar, Cpu, StickyNote, CheckSquare, LucideIcon } from "lucide-react";
import { useWidgets, WidgetType } from "@/contexts/WidgetContext";
import { useTheme } from "@/contexts/ThemeContext";

interface MenuBarProps {
  activeWindowTitle?: string;
  onSpotlightOpen: () => void;
}

const AppleMenuIcon = () => (
  <svg
    viewBox="0 0 170 170"
    className="w-4 h-4"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.197-2.12-9.973-3.17-14.34-3.17-4.58 0-9.492 1.05-14.746 3.17-5.262 2.13-9.501 3.24-12.742 3.35-4.929.21-9.842-1.96-14.746-6.52-3.13-2.73-7.045-7.41-11.735-14.04-5.032-7.08-9.169-15.29-12.41-24.65-3.471-10.11-5.211-19.9-5.211-29.378 0-10.857 2.346-20.221 7.045-28.068 3.693-6.303 8.606-11.275 14.755-14.925s12.793-5.51 19.948-5.629c3.915 0 9.049 1.211 15.429 3.591 6.362 2.388 10.447 3.599 12.238 3.599 1.339 0 5.877-1.416 13.57-4.239 7.275-2.618 13.415-3.702 18.445-3.275 13.63 1.1 23.87 6.473 30.68 16.153-12.19 7.386-18.22 17.731-18.1 31.002.11 10.337 3.86 18.939 11.23 25.769 3.34 3.17 7.07 5.62 11.22 7.36-.9 2.61-1.85 5.11-2.86 7.51zM119.11 7.24c0 8.102-2.96 15.667-8.86 22.669-7.12 8.324-15.732 13.134-25.071 12.375a25.222 25.222 0 0 1-.188-3.07c0-7.778 3.386-16.102 9.399-22.908 3.002-3.446 6.82-6.311 11.45-8.597 4.62-2.252 8.99-3.497 13.1-3.71.12 1.083.17 2.166.17 3.24z" />
  </svg>
);

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <span className="text-[13px] font-medium">
      {formatDate(time)} {formatTime(time)}
    </span>
  );
};

const WIDGET_TYPES: { type: WidgetType; label: string; icon: LucideIcon }[] = [
  { type: "clock", label: "Clock", icon: ClockIcon },
  { type: "weather", label: "Weather", icon: Cloud },
  { type: "calendar", label: "Calendar", icon: Calendar },
  { type: "system", label: "System Status", icon: Cpu },
  { type: "notes", label: "Notes", icon: StickyNote },
  { type: "reminders", label: "Reminders", icon: CheckSquare },
];

export const MenuBar = ({ activeWindowTitle, onSpotlightOpen }: MenuBarProps) => {
  const { addWidget, showWidgets, setShowWidgets } = useWidgets();
  const { theme, toggleTheme } = useTheme();

  // Handle keyboard shortcut for Spotlight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.code === "Space") {
        e.preventDefault();
        onSpotlightOpen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSpotlightOpen]);

  return (
    <header
      className="fixed top-0 left-0 right-0 h-7 menubar-glass z-40 flex items-center justify-between px-4 select-none"
      role="menubar"
      aria-label="Menu bar"
    >
      {/* Left Section - Apple Menu & App Menu */}
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="p-1 rounded hover:bg-foreground/10 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            aria-label="Apple menu"
          >
            <AppleMenuIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="glass min-w-[200px]"
            sideOffset={4}
          >
            <DropdownMenuItem className="text-[13px] cursor-pointer">
              About This Portfolio
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[13px] cursor-pointer">
              Preferences...
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-[13px] cursor-pointer"
              onClick={() => window.location.reload()}
            >
              Reload
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Active App Title */}
        <span className="text-[13px] font-semibold">
          {activeWindowTitle || "Finder"}
        </span>

        {/* App Menus */}
        <nav className="hidden md:flex items-center gap-4">
          <button className="text-[13px] hover:bg-foreground/10 px-2 py-0.5 rounded transition-colors">
            File
          </button>
          <button className="text-[13px] hover:bg-foreground/10 px-2 py-0.5 rounded transition-colors">
            Edit
          </button>
          <button className="text-[13px] hover:bg-foreground/10 px-2 py-0.5 rounded transition-colors">
            View
          </button>
          
          {/* Widgets Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="text-[13px] hover:bg-foreground/10 px-2 py-0.5 rounded transition-colors focus:outline-none">
              Widgets
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="glass min-w-[180px]" sideOffset={4}>
              <DropdownMenuItem
                className="text-[13px] cursor-pointer"
                onClick={() => setShowWidgets(!showWidgets)}
              >
                {showWidgets ? "Hide All Widgets" : "Show All Widgets"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {WIDGET_TYPES.map(({ type, label, icon: Icon }) => (
                <DropdownMenuItem
                  key={type}
                  className="text-[13px] cursor-pointer flex items-center gap-2"
                  onClick={() => addWidget(type)}
                >
                  <Icon className="w-4 h-4" />
                  Add {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button className="text-[13px] hover:bg-foreground/10 px-2 py-0.5 rounded transition-colors">
            Window
          </button>
          <button
            onClick={toggleTheme}
            className="text-[13px] hover:bg-foreground/10 px-2 py-0.5 rounded transition-colors"
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
        </nav>
      </div>

      {/* Right Section - Status Icons */}
      <div className="flex items-center gap-3">
        <button
          onClick={onSpotlightOpen}
          className="p-1 rounded hover:bg-foreground/10 transition-colors"
          aria-label="Open Spotlight search (Cmd + Space)"
        >
          <Search className="w-4 h-4" />
        </button>
        <Wifi className="w-4 h-4" aria-label="Wi-Fi connected" />
        <div className="flex items-center gap-1" aria-label="Battery 100%">
          <Battery className="w-5 h-5" />
        </div>
        <Clock />
      </div>
    </header>
  );
};

export default MenuBar;
