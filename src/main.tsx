import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Set light mode by default on the html element
if (
  !document.documentElement.classList.contains("dark") &&
  !document.documentElement.classList.contains("light")
) {
  document.documentElement.classList.add("light");
}

createRoot(document.getElementById("root")!).render(<App />);
