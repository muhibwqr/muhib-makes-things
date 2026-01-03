import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getCurrentTheme, toggleTheme as toggleThemeUtil } from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Initialize theme state from document
    setTheme(getCurrentTheme());
    
    // Listen for theme changes (e.g., from other tabs/windows)
    const observer = new MutationObserver(() => {
      setTheme(getCurrentTheme());
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
          setTheme(newTheme);
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
    setTheme(newTheme);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="hover-lift rounded-full"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
