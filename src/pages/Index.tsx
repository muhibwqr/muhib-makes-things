import { Github, Linkedin, Mail, Twitter, Moon, Sun } from "lucide-react";
import LiquidEther from "@/components/LiquidEther";
import Dock from "@/components/Dock";
import { Updates } from "@/components/Updates";
import { Projects } from "@/components/Projects";
import { About } from "@/components/About";
import { useState, useEffect } from "react";

const Index = () => {
  const [isDark, setIsDark] = useState(false);

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
    { 
      icon: isDark ? <Sun size={18} /> : <Moon size={18} />, 
      label: isDark ? 'Light Mode' : 'Dark Mode', 
      onClick: toggleTheme
    },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top Navigation */}
        <nav className="fixed top-0 left-0 z-50 p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-xs sm:text-sm font-medium transition-colors text-left text-black dark:text-white hover:opacity-70"
            >
              home
            </button>
            <button
              onClick={() => scrollToSection('projects')}
              className="text-xs sm:text-sm font-medium transition-colors text-left text-black dark:text-white hover:opacity-70"
            >
              projects
            </button>
            <button
              onClick={() => scrollToSection('updates')}
              className="text-xs sm:text-sm font-medium transition-colors text-left text-black dark:text-white hover:opacity-70"
            >
              updates
            </button>
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
                  <span className="hidden sm:inline">dark</span>
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

        {/* Dock Navigation */}
        <Dock 
          items={dockItems}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />
        
        {/* Header - Top section */}
        <header className="px-6 sm:px-8 py-8 sm:py-12 pt-24 sm:pt-32">
          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black dark:text-white mb-2">
              Muhib Waqar
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black dark:text-white mb-4">
              MUHIB WAQAR
            </h2>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
              math & business @ waterloo • software + security engineer • product builder
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 sm:px-8 pb-24">
          <div className="max-w-4xl space-y-12">
            
            {/* About */}
            <About />

            {/* Let's Talk */}
            <section id="lets-talk" className="py-12 sm:py-16 relative scroll-mt-20">
              <h2 className="text-xl font-semibold mb-6 text-black dark:text-white">
                ◆ let's talk
              </h2>
              <p className="text-base leading-relaxed mb-6 text-black dark:text-white">
                I'm looking for Summer 2026 SWE / Product Management/ fullstack roles — ideally founder-led teams that value speed, resilience, and ownership.
              </p>
              <div className="flex flex-wrap gap-4 mb-6">
                <a
                  href="mailto:m7waqar@uwaterloo.ca"
                  className="text-base text-black dark:text-white hover:opacity-70 transition-opacity"
                >
                  Email
                </a>
                <a
                  href="https://github.com/muhibwqr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-black dark:text-white hover:opacity-70 transition-opacity"
                >
                  GitHub
                </a>
                <a
                  href="https://x.com/muhibwqr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-black dark:text-white hover:opacity-70 transition-opacity"
                >
                  Twitter
                </a>
                <a
                  href="https://linkedin.com/in/muhibwaqar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-black dark:text-white hover:opacity-70 transition-opacity"
                >
                  LinkedIn
                </a>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-black dark:text-white hover:opacity-70 transition-opacity"
                >
                  Resume
                </a>
              </div>
              <p className="text-base leading-relaxed text-black dark:text-white">
                high ownership, fast execution, zero entitlement — let's build.
              </p>
            </section>

            {/* Projects */}
            <section id="projects">
              <Projects />
            </section>

            {/* Updates */}
            <section id="updates">
              <Updates />
            </section>
          </div>
        </main>

        {/* Footer - Bottom section - Language selector */}
        <footer className="fixed bottom-24 left-0 right-0 z-20 px-6 sm:px-8 py-6 pointer-events-none">
          <div className="flex justify-end">
            <div className="text-sm text-black dark:text-white pointer-events-auto">
              <span className="opacity-100">EN</span>
              <span className="opacity-50 mx-1">/</span>
              <span className="opacity-50">中文</span>
            </div>
        </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
