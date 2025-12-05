import { useState, useEffect } from "react";
import { Settings, Palette, Monitor, Accessibility, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsState {
  accentColor: string;
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: "small" | "medium" | "large";
}

const ACCENT_COLORS = [
  { name: "Blue", value: "211 100% 50%", class: "bg-[hsl(211,100%,50%)]" },
  { name: "Purple", value: "280 80% 60%", class: "bg-[hsl(280,80%,60%)]" },
  { name: "Pink", value: "330 80% 60%", class: "bg-[hsl(330,80%,60%)]" },
  { name: "Orange", value: "25 95% 55%", class: "bg-[hsl(25,95%,55%)]" },
  { name: "Green", value: "140 70% 45%", class: "bg-[hsl(140,70%,45%)]" },
  { name: "Cyan", value: "185 90% 45%", class: "bg-[hsl(185,90%,45%)]" },
];

const DEFAULT_SETTINGS: SettingsState = {
  accentColor: "211 100% 50%",
  reducedMotion: false,
  highContrast: false,
  fontSize: "medium",
};

const STORAGE_KEY = "mac_portfolio.settings";

export const SettingsWindow = () => {
  const [settings, setSettings] = useState<SettingsState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [activeTab, setActiveTab] = useState<"appearance" | "accessibility">("appearance");

  // Apply settings
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

    // Apply accent color
    document.documentElement.style.setProperty("--primary", settings.accentColor);
    document.documentElement.style.setProperty("--ring", settings.accentColor);
    document.documentElement.style.setProperty("--macos-accent-blue", settings.accentColor);

    // Apply reduced motion
    if (settings.reducedMotion) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }

    // Apply high contrast
    if (settings.highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }

    // Apply font size
    const fontSizes = { small: "14px", medium: "16px", large: "18px" };
    document.documentElement.style.setProperty("--base-font-size", fontSizes[settings.fontSize]);
  }, [settings]);

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const tabs = [
    { id: "appearance" as const, label: "Appearance", icon: Palette },
    { id: "accessibility" as const, label: "Accessibility", icon: Accessibility },
  ];

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <nav
        className="w-48 border-r border-border/50 p-3 space-y-1"
        role="tablist"
        aria-label="Settings categories"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${tab.id}-panel`}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              activeTab === tab.id
                ? "bg-primary/20 text-primary"
                : "hover:bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Appearance Tab */}
        {activeTab === "appearance" && (
          <div
            id="appearance-panel"
            role="tabpanel"
            aria-labelledby="appearance-tab"
            className="space-y-6 animate-fade-in"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/20">
                <Palette className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Appearance</h2>
                <p className="text-sm text-muted-foreground">
                  Customize how the portfolio looks
                </p>
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Accent Color</label>
              <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Accent color">
                {ACCENT_COLORS.map((color) => (
                  <button
                    key={color.name}
                    role="radio"
                    aria-checked={settings.accentColor === color.value}
                    aria-label={color.name}
                    onClick={() => setSettings((s) => ({ ...s, accentColor: color.value }))}
                    className={cn(
                      "w-8 h-8 rounded-full transition-all",
                      color.class,
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      settings.accentColor === color.value
                        ? "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110"
                        : "hover:scale-105"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Display Scale */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Display</label>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                <Monitor className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Desktop experience optimized for all screen sizes
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Accessibility Tab */}
        {activeTab === "accessibility" && (
          <div
            id="accessibility-panel"
            role="tabpanel"
            aria-labelledby="accessibility-tab"
            className="space-y-6 animate-fade-in"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/20">
                <Accessibility className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Accessibility</h2>
                <p className="text-sm text-muted-foreground">
                  Make the portfolio easier to use
                </p>
              </div>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
              <div className="space-y-0.5">
                <label htmlFor="reduced-motion" className="text-sm font-medium">
                  Reduce Motion
                </label>
                <p className="text-xs text-muted-foreground">
                  Minimize animations and transitions
                </p>
              </div>
              <button
                id="reduced-motion"
                role="switch"
                aria-checked={settings.reducedMotion}
                onClick={() =>
                  setSettings((s) => ({ ...s, reducedMotion: !s.reducedMotion }))
                }
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  settings.reducedMotion ? "bg-primary" : "bg-muted"
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                    settings.reducedMotion && "translate-x-5"
                  )}
                />
              </button>
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
              <div className="space-y-0.5">
                <label htmlFor="high-contrast" className="text-sm font-medium">
                  High Contrast
                </label>
                <p className="text-xs text-muted-foreground">
                  Increase color contrast for better visibility
                </p>
              </div>
              <button
                id="high-contrast"
                role="switch"
                aria-checked={settings.highContrast}
                onClick={() =>
                  setSettings((s) => ({ ...s, highContrast: !s.highContrast }))
                }
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  settings.highContrast ? "bg-primary" : "bg-muted"
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                    settings.highContrast && "translate-x-5"
                  )}
                />
              </button>
            </div>

            {/* Font Size */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Text Size</label>
              <div className="flex gap-2" role="radiogroup" aria-label="Text size">
                {(["small", "medium", "large"] as const).map((size) => (
                  <button
                    key={size}
                    role="radio"
                    aria-checked={settings.fontSize === size}
                    onClick={() => setSettings((s) => ({ ...s, fontSize: size }))}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm capitalize transition-colors",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      settings.fontSize === size
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary hover:bg-secondary/80"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reset Button */}
        <div className="mt-8 pt-6 border-t border-border/50">
          <button
            onClick={handleReset}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm",
              "bg-destructive/10 text-destructive hover:bg-destructive/20",
              "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsWindow;
