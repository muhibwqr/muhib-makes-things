import { Github, Linkedin, Mail, Twitter, Download, Moon, Sun } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import LiquidEther from "@/components/LiquidEther";
import Dock from "@/components/Dock";
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
        
        <div className="relative z-10">
          {/* Header */}
          <header className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center gap-4 border-b border-black/10 dark:border-white/10">
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <Avatar className="w-20 h-20 sm:w-28 sm:h-28 border-2 border-black/20 dark:border-white/20 flex-shrink-0">
                <AvatarImage src="/profile.jpeg" alt="Muhib Waqar" />
                <AvatarFallback className="bg-gray-200 text-black dark:bg-gray-800 dark:text-white">
                  MW
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 tracking-[0.2em] text-black dark:text-white">
                  MUHIB WAQAR
                </h1>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  math & business @ waterloo • software + security engineer • product builder
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
                I'm looking for Summer 2026 SWE / Product Management/ fullstack roles — ideally founder-led
                teams that value speed, resilience, and ownership.
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
                  href="/muhib_waqar_resume.pdf"
                  download="muhib_waqar_resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 sm:gap-2 transition-colors border px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-gray-700 hover:text-black border-black/10 hover:border-black/20 hover:bg-black/5 dark:text-gray-300 dark:hover:text-white dark:border-white/10 dark:hover:border-white/20 dark:hover:bg-white/5"
                >
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Resume
                </a>
              </div>
            </section>

            {/* CTA footer */}
            <div className="text-center pt-8 border-t border-black/10 dark:border-white/10">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                high ownership, fast execution, zero entitlement — let&apos;s build.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;

