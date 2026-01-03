import { Github, Linkedin, Mail, Twitter, Download, Moon, Sun, FolderKanban, Home, FileText } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import LiquidEther from "@/components/LiquidEther";
import Dock from "@/components/Dock";
import { About } from "@/components/About";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentTheme, toggleTheme as toggleThemeUtil } from "@/lib/theme";

const Index = () => {
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