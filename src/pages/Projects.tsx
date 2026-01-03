import { Github, Linkedin, Mail, Twitter, Moon, Sun, FolderKanban, Home, FileText } from "lucide-react";
import { Projects } from "@/components/Projects";
import Cubes from "@/components/Cubes";
import Dock from "@/components/Dock";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentTheme, toggleTheme as toggleThemeUtil } from "@/lib/theme";

export default function ProjectsPage() {
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

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

  const dockItems = [
    // Navigation
    { 
      icon: <Home size={18} />, 
      label: 'Home', 
      onClick: () => navigate('/'),
    },
    { 
      icon: <FolderKanban size={18} />, 
      label: 'Projects', 
      onClick: () => navigate('/projects'),
    },
    // Social
    { 
      icon: <Mail size={18} />, 
      label: 'Email', 
      onClick: () => window.open('mailto:m7waqar@uwaterloo.ca', '_blank'),
    },
    { 
      icon: <Linkedin size={18} />, 
      label: 'LinkedIn', 
      onClick: () => window.open('https://linkedin.com/in/muhibwaqar', '_blank'),
      previewVideo: '/linkedin-preview.mp4',
      previewAlt: 'LinkedIn Content'
    },
    { 
      icon: <Github size={18} />, 
      label: 'GitHub', 
      onClick: () => window.open('https://github.com/muhibwqr', '_blank'),
    },
    { 
      icon: <Twitter size={18} />, 
      label: 'Twitter', 
      onClick: () => window.open('https://x.com/muhibwqr', '_blank'),
      previewVideo: '/twitter-preview.mp4',
      previewAlt: 'Twitter Content'
    },
    { 
      icon: <FileText size={18} />, 
      label: 'Resume', 
      onClick: () => navigate('/resume'),
      previewImage: '/hireme.jpeg',
      previewAlt: 'Hire Me'
    },
    { 
      icon: isDark ? <Sun size={18} /> : <Moon size={18} />, 
      label: isDark ? 'Light Mode' : 'Dark Mode', 
      onClick: toggleTheme,
    },
  ];

  return (
    <div className="min-h-screen relative bg-white text-black dark:bg-black dark:text-white">
      {/* Cubes background animation */}
      <div className="fixed inset-0 z-0">
        <Cubes />
      </div>

      {/* Semi-transparent backdrop for text readability */}
      <div className="fixed inset-0 z-[1] bg-white/60 dark:bg-black/60 backdrop-blur-sm pointer-events-none"></div>

      {/* Content wrapper */}
      <div className="relative z-10 min-h-screen">
        {/* Dock Navigation */}
        <Dock 
          items={dockItems}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />
        
        <main className="px-4 sm:px-6 py-8 sm:py-12">
          <div className="max-w-7xl section-spacing">
            <Projects />
          </div>
        </main>
      </div>
    </div>
  );
}

