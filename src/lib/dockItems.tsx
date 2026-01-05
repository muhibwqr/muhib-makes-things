import { Github, Linkedin, Mail, Twitter, Moon, Sun, FolderKanban, Home, FileText, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCurrentTheme, toggleTheme as toggleThemeUtil } from "./theme";
import { useState, useEffect } from "react";
import type { DockItemData } from "@/components/Dock";

export function useDockItems(): DockItemData[] {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

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

  return [
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
    // Social Dropdown
    { 
      icon: <Share2 size={18} />, 
      label: 'Social', 
      onClick: () => {}, // Handled by dropdown
      isDropdown: true,
      dropdownItems: [
        {
          icon: <Mail size={16} />,
          label: 'Email',
          href: 'mailto:m7waqar@uwaterloo.ca',
        },
        {
          icon: <Linkedin size={16} />,
          label: 'LinkedIn',
          href: 'https://linkedin.com/in/muhibwaqar',
          previewVideo: '/linkedin-preview.mp4',
        },
        {
          icon: <Github size={16} />,
          label: 'GitHub',
          href: 'https://github.com/muhibwqr',
        },
        {
          icon: <Twitter size={16} />,
          label: 'Twitter',
          href: 'https://x.com/muhibwqr',
          previewVideo: '/twitter-preview.mp4',
        },
      ]
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
}

