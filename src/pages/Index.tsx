import { Github, Linkedin, Mail, Twitter, Download, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import LiquidEther from "@/components/LiquidEther";

const Index = () => {
  const [isDark, setIsDark] = useState(true);

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
    <div className={`min-h-screen relative ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* LiquidEther background animation */}
      <div className="fixed inset-0 z-0">
        <LiquidEther 
          colors={['#5227FF', '#FF9FFC', '#B19EEF']}
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
      <div className={`fixed inset-0 z-[1] ${isDark ? 'bg-black/60' : 'bg-white/60'} backdrop-blur-sm pointer-events-none`}></div>
      
      {/* Content wrapper */}
      <div className="relative z-10 min-h-screen">
        {/* Content wrapper */}
        <div className="relative z-10">
        {/* Header */}
        <header className={`container mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center gap-4 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="flex items-center gap-3 sm:gap-4">
          <Avatar className="w-20 h-20 sm:w-28 sm:h-28 border-2 border-white/20 flex-shrink-0">
            <AvatarImage src="/profile.jpeg" alt="Muhib Waqar" />
            <AvatarFallback className={`${isDark ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}>MW</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h1 className={`text-xl sm:text-2xl font-bold mb-1 sm:mb-2 ${isDark ? 'text-white' : 'text-black'}`}>◆ muhib waqar</h1>
            <div className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <div className="flex items-center gap-2 flex-wrap">
                <span>→</span>
                <span className="whitespace-nowrap">honours math & business admin</span>
                <span className="text-xs">@ university of waterloo</span>
              </div>
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                building ai tools, security systems, and products that scale
              </p>
            </div>
          </div>
        </div>
        <nav className="text-xs sm:text-sm">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <a href="#projects" className={`transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}>Projects</a>
            <span className={isDark ? 'text-gray-600' : 'text-gray-300'}>|</span>
            <a href="#about" className={`transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}>About me</a>
            <span className={isDark ? 'text-gray-600' : 'text-gray-300'}>|</span>
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all text-xs sm:text-sm ${
                isDark 
                  ? 'bg-white/5 hover:bg-white/10 border border-white/10 text-white' 
                  : 'bg-black/5 hover:bg-black/10 border border-black/10 text-black'
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
        {/* What makes me different */}
        <section className="mb-16">
          <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>◆ what makes me different:</h2>
          <div className={`space-y-3 text-base leading-relaxed ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>been in tech since age 11</strong> → from entrepreneurship and graphic design to software engineering. think beyond code.
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>university of waterloo</strong> → honours math & business admin, president's scholarship. bridge technical depth with business impact.
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>5M+ views across platforms</strong> → built a personal brand, helped non-profits, and mentored creators. scale impact beyond my own work.
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>building course generation & RAG</strong> → ai-powered tools for personalized learning. making quality education accessible at scale.
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>certified & experienced</strong> → aws ccp, az-900, ccna1, ccst. swe intern @ ibs, cybersecurity @ canadian cyber inc.
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>4th place toronto wrestling</strong> → trained with world champions. that discipline translates to debugging at 2am.
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>seeking summer 2026 internships</strong> → open to intern, swe intern, application security intern, and swe roles.
            </p>
          </div>
        </section>

        {/* Building Section */}
        <section className="mb-16" id="projects">
          <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>◆ building:</h2>
          <div className={`space-y-3 text-base leading-relaxed ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>goosetype</strong> → minimal typing test with real-time wpm tracking and leaderboards. built for speed, designed for focus. <a href="https://github.com/muhibwqr/goosetype" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">GitHub</a> • React, TypeScript, Tailwind, Vercel
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>course generation & RAG platform</strong> → ai-powered tools for personalized learning. <a href="https://github.com/muhibwqr" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">GitHub</a> • python, RAG, LLMs, databases, full stack
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>triageo - ai security triage</strong> → hack the north 2025. slack-native assistant that triages security incidents in under 5 seconds using RAG over OWASP guidelines. <a href="https://github.com/muhibwqr/triageo" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">GitHub</a> • python, Cohere LLM, Slack API, FastAPI, RAG
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>scrollify</strong> → won GoOnHacks. satirical productivity app that penalizes productive time by calling your dad via ai agent. rewards doomscrolling. <a href="https://github.com/muhibwqr/scrollify" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">GitHub</a> • swift, supabase, vercel, twilio, deepgram
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>malicious payload usb project</strong> → security research. usb-based payload emulator using Raspberry Pi to demonstrate HID attack vectors. <a href="https://github.com/muhibwqr/usb-payload" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">GitHub</a> • python, Raspberry Pi, HID protocols
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>ai mental health voice agent</strong> → healthcare ai with empathetic support and crisis detection. proves ai can augment care, not replace human connection. <a href="https://github.com/muhibwqr/mental-health-agent" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">GitHub</a> • python, Twilio, Deepgram, Conversational AI
            </p>
          </div>
        </section>

        {/* Reach Out */}
        <section className="mb-16" id="about">
          <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>◆ please reach out if you're:</h2>
          <div className={`space-y-2 text-base leading-relaxed ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            <p>→ a fellow founder building something meaningful.</p>
            <p>→ curious about my work or want to chat about tech, entrepreneurship, or wrestling.</p>
            <p>→ looking for technical depth, business acumen, and execution in SWE, cybersecurity, or product roles.</p>
            <p className={`mt-4 pt-4 border-t ${isDark ? 'border-white/10 text-gray-300' : 'border-gray-200 text-gray-700'}`}>
              i respond within 12 hours. feel free to message me anywhere.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="pb-12">
          <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>◆ contact:</h2>
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
                      ? 'text-gray-300 hover:text-white border-white/10 hover:border-white/20 hover:bg-white/5' 
                      : 'text-gray-700 hover:text-black border-black/10 hover:border-black/20 hover:bg-black/5'
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
                  ? 'text-gray-300 hover:text-white border-white/10 hover:border-white/20 hover:bg-white/5' 
                  : 'text-gray-700 hover:text-black border-black/10 hover:border-black/20 hover:bg-black/5'
              }`}
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Resume
            </a>
          </div>
        </section>
        
        {/* CTA */}
        <div className={`text-center py-8 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            seeking summer 2026 internships — let's talk.
          </p>
        </div>
        </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
