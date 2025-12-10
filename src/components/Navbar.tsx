import { Link, useLocation } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;
    
    // Check body class first (set in index.html)
    if (body.classList.contains("light")) {
      root.classList.remove("dark");
      root.classList.add("light");
      setIsDark(false);
    } else if (body.classList.contains("dark")) {
      root.classList.remove("light");
      root.classList.add("dark");
      setIsDark(true);
    } else if (!root.classList.contains("dark") && !root.classList.contains("light")) {
      // Default to light mode
      root.classList.add("light");
      body.classList.add("light");
      setIsDark(false);
    } else {
      const isDarkMode = root.classList.contains("dark");
      setIsDark(isDarkMode);
    }
  }, []);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    const newTheme = isDark ? "light" : "dark";
    root.classList.remove(isDark ? "dark" : "light");
    root.classList.add(newTheme);
    setIsDark(!isDark);
  };

  const navItems = [
    { path: "/", label: "home" },
    { path: "/projects", label: "projects" },
    { path: "/updates", label: "updates" },
  ];

  return (
    <nav className="fixed top-0 left-0 z-50 p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:gap-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`text-xs sm:text-sm font-medium transition-colors ${
                isActive
                  ? isDark
                    ? "text-white"
                    : "text-black"
                  : isDark
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={toggleTheme}
          className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all text-xs sm:text-sm mt-2 ${
            isDark
              ? "bg-white/5 hover:bg-white/10 border border-white/10 text-white"
              : "bg-black/5 hover:bg-black/10 border border-black/10 text-black"
          }`}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <>
              <Sun className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">light</span>
            </>
          ) : (
            <>
              <Moon className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">dark</span>
            </>
          )}
        </button>
      </div>
    </nav>
  );
}

