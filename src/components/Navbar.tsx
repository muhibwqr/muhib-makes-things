import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, Home, FolderKanban, Mail, Linkedin, Github, Twitter, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { getCurrentTheme, toggleTheme as toggleThemeUtil } from "@/lib/theme";
import { motion, AnimatePresence } from "framer-motion";
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
    { path: "/projects", label: "projects", icon: FolderKanban, previewVideo: "/goosetype-preview.mp4" },
  ];

  return (
    <nav className="fixed top-0 left-0 z-50 p-4 sm:p-6">
      <div className="navbar-panel">
        <div className="flex flex-col gap-3 sm:gap-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            const [showPreview, setShowPreview] = useState(false);
            return (
              <div
                key={item.path}
                className="relative"
                onMouseEnter={() => item.previewVideo && setShowPreview(true)}
                onMouseLeave={() => setShowPreview(false)}
              >
                <Link
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
                  <div className="relative w-4 h-4 sm:w-5 sm:h-5">
                    <AnimatePresence mode="wait">
                      {showPreview && item.previewVideo ? (
                        <motion.div
                          key="preview"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                          className="absolute inset-0 rounded overflow-hidden"
                        >
                          <video
                            src={item.previewVideo}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="icon"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Icon className="w-full h-full" strokeWidth={1.5} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <span>{item.label}</span>
                </Link>
              </div>
            );
          })}
          
          {/* Contact Info */}
          <div className="border-t border-gray-200/20 dark:border-gray-700/20 pt-3 mt-3 space-y-2">
            <a
              href="mailto:m7waqar@uwaterloo.ca"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 text-xs sm:text-sm font-medium transition-colors ${
                isDark
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              <Mail className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
              <span>email</span>
            </a>
            <a
              href="https://linkedin.com/in/muhibwaqar"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 text-xs sm:text-sm font-medium transition-colors ${
                isDark
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
              <span>linkedin</span>
            </a>
            <a
              href="https://github.com/muhibwqr"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 text-xs sm:text-sm font-medium transition-colors ${
                isDark
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              <Github className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
              <span>github</span>
            </a>
            <a
              href="https://x.com/muhibwqr"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 text-xs sm:text-sm font-medium transition-colors ${
                isDark
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              <Twitter className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
              <span>twitter</span>
            </a>
            <Link
              to="/resume"
              className={`flex items-center gap-2 text-xs sm:text-sm font-medium transition-colors ${
                isDark
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
              <span>resume</span>
            </Link>
          </div>

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

