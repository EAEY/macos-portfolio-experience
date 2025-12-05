import { useState, useEffect, useCallback, useRef } from "react";

interface DesktopProps {
  children: React.ReactNode;
}

export const Desktop = ({ children }: DesktopProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const desktopRef = useRef<HTMLDivElement>(null);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Parallax effect on mouse move
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (prefersReducedMotion) return;

      const rect = desktopRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = (e.clientX - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.height / 2) / rect.height;

      setMousePosition({ x: x * 10, y: y * 10 });
    },
    [prefersReducedMotion]
  );

  return (
    <div
      ref={desktopRef}
      className="fixed inset-0 overflow-hidden bg-background"
      onMouseMove={handleMouseMove}
    >
      {/* Wallpaper Background */}
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{
          transform: prefersReducedMotion
            ? "none"
            : `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.05)`,
        }}
      >
        {/* Gradient wallpaper with mesh-like pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(220,60%,12%)] via-[hsl(260,40%,15%)] to-[hsl(200,50%,10%)]" />
        
        {/* Animated gradient orbs */}
        <div
          className={`absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[hsl(210,100%,40%,0.3)] to-[hsl(280,100%,50%,0.2)] blur-[100px] ${
            prefersReducedMotion ? "" : "animate-parallax-float"
          }`}
        />
        <div
          className={`absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[hsl(300,100%,50%,0.2)] to-[hsl(200,100%,60%,0.15)] blur-[80px] ${
            prefersReducedMotion ? "" : "animate-parallax-float"
          }`}
          style={{ animationDelay: "-10s" }}
        />
        <div
          className={`absolute top-1/2 right-1/3 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-[hsl(180,100%,50%,0.15)] to-[hsl(240,100%,60%,0.1)] blur-[60px] ${
            prefersReducedMotion ? "" : "animate-parallax-float"
          }`}
          style={{ animationDelay: "-5s" }}
        />

        {/* Subtle noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Desktop Content Area - below menu bar, above dock */}
      <main
        className="absolute inset-0 pt-7 pb-20"
        role="main"
        aria-label="Desktop"
      >
        {children}
      </main>
    </div>
  );
};

export default Desktop;
