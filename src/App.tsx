import { BrowserRouter, Routes, Route } from "react-router-dom";
import GhostCursor from "./components/GhostCursor";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const App = () => (
  <BrowserRouter>
    <GhostCursor
      color="#B19EEF"
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

export default App;
