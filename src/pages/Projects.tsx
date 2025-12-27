import { Github, Linkedin, Mail, Twitter, Moon, Sun, Code, FolderKanban } from "lucide-react";
import { Projects } from "@/components/Projects";
import LiquidEther from "@/components/LiquidEther";
import Dock from "@/components/Dock";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectsPage() {
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;
    
    if (body.classList.contains("light")) {
      root.classList.remove("dark");
      root.classList.add("light");
      setIsDark(false);
    } else if (body.classList.contains("dark")) {
      root.classList.remove("light");
      root.classList.add("dark");
      setIsDark(true);
    } else if (!root.classList.contains("dark") && !root.classList.contains("light")) {
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

  const dockItems = [
    { 
      icon: <Mail size={18} />, 
      label: 'Email', 
      onClick: () => window.open('mailto:m7waqar@uwaterloo.ca', '_blank')
    },
    { 
      icon: <Linkedin size={18} />, 
      label: 'LinkedIn', 
      onClick: () => window.open('https://linkedin.com/in/muhibwaqar', '_blank')
    },
    { 
      icon: <Github size={18} />, 
      label: 'GitHub', 
      onClick: () => window.open('https://github.com/muhibwqr', '_blank')
    },
    { 
      icon: <Twitter size={18} />, 
      label: 'Twitter', 
      onClick: () => window.open('https://x.com/muhibwqr', '_blank')
    },
    // Navigation
    { 
      icon: <FolderKanban size={18} />, 
      label: 'Projects', 
      onClick: () => navigate('/projects')
    },
    { 
      icon: <Code size={18} />, 
      label: 'GooseType', 
      onClick: () => window.open('https://goosetype.com', '_blank'),
      previewImage: '/goosetype-preview.png',
      previewAlt: 'GooseType University Leaderboard'
    },
    { 
      icon: isDark ? <Sun size={18} /> : <Moon size={18} />, 
      label: isDark ? 'Light Mode' : 'Dark Mode', 
      onClick: toggleTheme
    },
  ];

  return (
    <div className="min-h-screen relative bg-white text-black dark:bg-black dark:text-white">
      {/* LiquidEther background animation */}
      <div className="fixed inset-0 z-0">
        <LiquidEther
          colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
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
        
        <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
          <Projects />
        </main>
      </div>
    </div>
  );
}

