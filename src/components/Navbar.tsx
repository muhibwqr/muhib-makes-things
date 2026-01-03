import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, Home, FolderKanban } from "lucide-react";
import { useState, useEffect } from "react";
import { getCurrentTheme, toggleTheme as toggleThemeUtil } from "@/lib/theme";
import "./Navbar.css";

export function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Initialize theme state from document
    setIsDark(getCurrentTheme() === 'dark');
    
    // Listen for theme changes (e.g., from other tabs/windows)
    const observer = new MutationObserver(() => {
      setIsDark(getCurrentTheme() === 'dark');
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    // Listen for storage changes (other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'muhib-theme') {
        const newTheme = e.newValue as 'light' | 'dark' | null;
        if (newTheme) {
          setIsDark(newTheme === 'dark');
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = toggleThemeUtil();
    setIsDark(newTheme === 'dark');
  };

  const navItems = [
    { path: "/", label: "home", icon: Home },
    { path: "/projects", label: "projects", icon: FolderKanban },
  ];

  return (
    <nav className="fixed top-0 left-0 z-50 p-4 sm:p-6">
      <div className="navbar-panel">
        <div className="flex flex-col gap-3 sm:gap-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 text-xs sm:text-sm font-medium transition-colors ${
                  isActive
                    ? isDark
                      ? "text-white"
                      : "text-black"
                    : isDark
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
                <span>{item.label}</span>
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
      </div>
    </nav>
  );
}

