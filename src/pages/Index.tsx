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

  const socials = [
    { icon: Mail, label: "Email", href: "mailto:m7waqar@uwaterloo.ca" },
    { icon: Github, label: "GitHub", href: "https://github.com/muhibwqr" },
    { icon: Twitter, label: "Twitter", href: "https://x.com/muhibwqr" },
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/muhibwaqar" }
  ];

  return (
    <div className="min-h-screen relative bg-white text-black dark:bg-black dark:text-white">
      {/* LiquidEther background animation */}
      <div className="fixed inset-0 z-0">
        <LiquidEther
          colors={["#4A9EFF", "#9FF5FF", "#B1D4FF"]}
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
        
        <div className="relative z-10">
          {/* Header */}
          <header className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center gap-4 border-b border-black/10 dark:border-white/10">
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <Avatar className="w-20 h-20 sm:w-28 sm:h-28 border-2 border-black/30 dark:border-white/20 flex-shrink-0">
                <AvatarImage src="/profile.jpeg" alt="Muhib Waqar" />
                <AvatarFallback className="bg-gray-200 text-black dark:bg-gray-800 dark:text-white">
                  MW
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 tracking-[0.2em] text-black dark:text-white">
                 muhib waqar
                </h1>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  math & business @ uwaterloo • swe • security • product management
                </p>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
            {/* About */}
            <About />

            {/* Let's talk + contact */}
            <section className="py-12 sm:py-16">
              <h2 className="text-xl font-semibold mb-6 text-black dark:text-white">
                ◆ let's talk
              </h2>
              <p className="mb-6 text-base leading-relaxed text-gray-900 dark:text-gray-100">
                I'm looking for Summer 2026 SWE / Product Management/ fullstack roles — ideally
                teams that value speed, resilience, and ownership. I'm adamant on learning, growing & adapting to new environments
              </p>

              <div className="flex flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm">
                {socials.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 sm:gap-2 transition-colors border px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-gray-700 hover:text-black border-black/10 hover:border-black/20 hover:bg-black/5 dark:text-gray-300 dark:hover:text-white dark:border-white/10 dark:hover:border-white/20 dark:hover:bg-white/5"
                    >
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      {social.label}
                    </a>
                  );
                })}
                <a
                  href="/muhib_waqar_resume_app.pdf"
                  download="muhib_waqar_resume_app.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 sm:gap-2 transition-colors border px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-gray-700 hover:text-black border-black/10 hover:border-black/20 hover:bg-black/5 dark:text-gray-300 dark:hover:text-white dark:border-white/10 dark:hover:border-white/20 dark:hover:bg-white/5"
                >
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Resume
                </a>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;

