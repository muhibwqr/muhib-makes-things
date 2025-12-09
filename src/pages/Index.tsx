import { Github, Linkedin, Mail, Twitter, Download, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import LiquidEther from "@/components/LiquidEther";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { Updates } from "@/components/Updates";

const Index = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    // Default to dark mode if no class is set
    if (!root.classList.contains("dark") && !root.classList.contains("light")) {
      root.classList.add("dark");
      setIsDark(true);
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

  const socials = [
    { icon: Mail, label: "Email", href: "mailto:m7waqar@uwaterloo.ca" },
    { icon: Github, label: "GitHub", href: "https://github.com/muhibwqr" },
    { icon: Twitter, label: "Twitter", href: "https://x.com/muhibwqr" },
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/muhibwaqar" }
  ];

  return (
    <div className={`min-h-screen relative ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
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
      <div
        className={`fixed inset-0 z-[1] ${
          isDark ? "bg-black/60" : "bg-white/60"
        } backdrop-blur-sm pointer-events-none`}
      ></div>

      {/* Content wrapper */}
      <div className="relative z-10 min-h-screen">
        <div className="relative z-10">
          {/* Header */}
          <header
            className={`container mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center gap-4 border-b ${
              isDark ? "border-white/10" : "border-gray-200"
            }`}
          >
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <Avatar className="w-20 h-20 sm:w-28 sm:h-28 border-2 border-white/20 flex-shrink-0">
                <AvatarImage src="/profile.jpeg" alt="Muhib Waqar" />
                <AvatarFallback
                  className={`${isDark ? "bg-gray-800 text-white" : "bg-gray-200 text-black"}`}
                >
                  MW
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h1
                  className={`text-xl sm:text-2xl font-bold mb-1 sm:mb-2 tracking-[0.2em] ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  MUHIB WAQAR
                </h1>
                <p className={`text-xs sm:text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  math & business @ waterloo • software + security engineer • product builder
                </p>
              </div>
            </div>
            <nav className="text-xs sm:text-sm">
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                <button
                  onClick={toggleTheme}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all text-xs sm:text-sm ${
                    isDark
                      ? "bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                      : "bg-black/5 hover:bg-black/10 border border-black/10 text-black"
                  }`}
                  aria-label="Toggle theme"
                >
                  {isDark ? (
                    <>
                      <Sun className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Light</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Dark</span>
                    </>
                  )}
                </button>
              </div>
            </nav>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
            {/* Hero / Intro */}
            <Hero />

            {/* About */}
            <About />

            {/* Projects */}
            <Projects />

            {/* Updates */}
            <Updates />

            {/* Let's talk + contact */}
            <section className="py-12 sm:py-16">
              <h2
                className={`text-xl font-semibold mb-6 ${
                  isDark ? "text-white" : "text-black"
                }`}
              >
                ◆ let's talk
              </h2>
              <p
                className={`mb-6 text-base leading-relaxed ${
                  isDark ? "text-gray-100" : "text-gray-900"
                }`}
              >
                I'm looking for Summer 2026 SWE / AppSec / fullstack roles — ideally founder-led
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
                      className={`flex items-center gap-1.5 sm:gap-2 transition-colors border px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg ${
                        isDark
                          ? "text-gray-300 hover:text-white border-white/10 hover:border-white/20 hover:bg-white/5"
                          : "text-gray-700 hover:text-black border-black/10 hover:border-black/20 hover:bg-black/5"
                      }`}
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
                  className={`flex items-center gap-1.5 sm:gap-2 transition-colors border px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg ${
                    isDark
                      ? "text-gray-300 hover:text-white border-white/10 hover:border-white/20 hover:bg-white/5"
                      : "text-gray-700 hover:text-black border-black/10 hover:border-black/20 hover:bg-black/5"
                  }`}
                >
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Resume
                </a>
              </div>
            </section>

            {/* CTA footer */}
            <div
              className={`text-center pt-8 border-t ${
                isDark ? "border-white/10" : "border-gray-200"
              }`}
            >
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
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

