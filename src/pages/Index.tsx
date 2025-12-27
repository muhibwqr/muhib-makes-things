import { Github, Linkedin, Mail, Twitter, Moon, Sun } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import LiquidEther from "@/components/LiquidEther";
import Dock from "@/components/Dock";
import { Updates } from "@/components/Updates";
import { Projects } from "@/components/Projects";
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

  const currently = [
    { name: "Math & Business @ Waterloo", logo: "🏛️" }
  ];

  const previously = [
    { name: "Founding Fullstack Engineer", company: "Stealth AI", logo: "🚀" },
    { name: "Software & Systems Engineering", company: "E-commerce + Non-profits", logo: "💼" },
    { name: "Cybersecurity Engineering", company: "Canadian Cyber Inc.", logo: "🔒" }
  ];


  const writing = [
    "why ontology for text-to-sql?",
    "building at scale"
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
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Dock Navigation */}
        <Dock 
          items={dockItems}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />
        
        {/* Header - Top section */}
        <header className="px-6 sm:px-8 py-8 sm:py-12 flex justify-between items-start">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black dark:text-white">
            hi im muhib
          </h1>
          <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-black/20 dark:border-white/20 flex-shrink-0">
            <AvatarImage src="/profile.jpeg" alt="Muhib Waqar" />
            <AvatarFallback className="bg-gray-200 text-black dark:bg-gray-800 dark:text-white">
              MW
            </AvatarFallback>
          </Avatar>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 sm:px-8 pb-24">
          <div className="max-w-4xl space-y-12">
            
            {/* Currently */}
            <section>
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-black dark:text-white">
                Currently
              </h2>
              <div className="space-y-3">
                {currently.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-2xl">{item.logo}</span>
                    <span className="text-base text-black dark:text-white">{item.name}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Previously */}
            <section>
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-black dark:text-white">
                Previously
              </h2>
              <div className="space-y-3">
                {previously.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-2xl">{item.logo}</span>
                    <div>
                      <span className="text-base text-black dark:text-white">{item.name}</span>
                      {item.company && (
                        <span className="text-base text-gray-600 dark:text-gray-400 ml-2">@ {item.company}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects */}
            <section>
              <Projects />
            </section>

            {/* Writing */}
            <section>
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-black dark:text-white">
                Writing
              </h2>
              <div className="space-y-2">
                {writing.map((article, index) => (
                  <div key={index} className="text-base text-black dark:text-white">
                    {article}
                  </div>
                ))}
              </div>
            </section>

            {/* Updates */}
            <section>
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
