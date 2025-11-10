import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import GhostCursor from "./components/GhostCursor";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const getInitialTheme = () => {
  if (typeof document === "undefined") return true;
  const root = document.documentElement;
  if (!root.classList.contains("dark") && !root.classList.contains("light")) {
    root.classList.add("dark");
    return true;
  }
  return root.classList.contains("dark");
};

const App = () => {
  const [isDark, setIsDark] = useState<boolean>(getInitialTheme);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const updateTheme = () => {
      setIsDark(root.classList.contains("dark"));
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const cursorColors = useMemo(() => {
    return isDark
      ? { color: "#B19EEF", haloColor: "#FFFFFF" }
      : { color: "#FFFFFF", haloColor: "#B19EEF" };
  }, [isDark]);

  return (
    <BrowserRouter>
      <GhostCursor
        color={cursorColors.color}
        haloColor={cursorColors.haloColor}
        brightness={1}
        edgeIntensity={0}
        trailLength={50}
        inertia={0.5}
        grainIntensity={0.05}
        bloomStrength={0.1}
        bloomRadius={1}
        bloomThreshold={0.025}
        fadeDelayMs={1000}
        fadeDurationMs={1500}
        style={{ position: "fixed", inset: 0, zIndex: 5 }}
      />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
