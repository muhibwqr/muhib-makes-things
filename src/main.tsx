import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeTheme } from "./lib/theme";

// Initialize theme from storage or system preference
initializeTheme();

createRoot(document.getElementById("root")!).render(<App />);
