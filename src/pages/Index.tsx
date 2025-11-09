import { Github, Linkedin, Mail, Twitter, Download, Moon, Sun } from "lucide-react";
import Orb from "@/components/Orb";
import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
      {/* Orb Background */}
      <div className="fixed inset-0 w-full h-full z-0">
        <Orb
          hoverIntensity={0.8}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
        />
      </div>
      
      {/* Content with backdrop for readability */}
      <div className="relative z-10 min-h-screen">
        {/* Semi-transparent backdrop for text readability */}
        <div className={`fixed inset-0 ${isDark ? 'bg-black/60' : 'bg-white/60'} backdrop-blur-sm pointer-events-none`}></div>
        
        {/* Content wrapper */}
        <div className="relative z-10">
        {/* Header */}
        <header className={`container mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col sm:flex-row justify-between items-start gap-4 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <Avatar className="w-20 h-20 sm:w-28 sm:h-28 border-2 border-white/20 flex-shrink-0">
            <AvatarImage src="/profile.jpeg" alt="Muhib Waqar" />
            <AvatarFallback className={`${isDark ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}>MW</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h1 className={`text-xl sm:text-2xl font-bold mb-1 sm:mb-2 ${isDark ? 'text-white' : 'text-black'}`}>◆ Muhib Waqar</h1>
            <div className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <div className="flex items-center gap-2 flex-wrap">
                <span>→</span>
                <span className="whitespace-nowrap">Honours Math & Business Admin</span>
                <span className="text-xs">UWaterloo</span>
              </div>
            </div>
          </div>
        </div>
        <nav className="text-xs sm:text-sm w-full sm:w-auto">
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
          <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>◆ What makes me different:</h2>
          <div className={`space-y-4 text-sm leading-relaxed ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>Been in tech since age 11</strong> → From entrepreneurship, graphic design, to software engineering. Been building tech projects for over a decade, from simple scripts to full-stack applications and AI systems.
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>University of Waterloo</strong> → Honours Mathematics & Business Administration. Admitted with President's Scholarship. Combining technical depth with analytical thinking and business acumen.
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>5M+ views across platforms</strong> → Built a personal brand that engages millions, helping non-profits with social media management and coaching creators on starting their own brands.
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>Currently building in course generation & RAG</strong> → Working on AI-powered educational tools using Retrieval-Augmented Generation to create personalized learning experiences.
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>Certified & experienced</strong> → AWS CCP, AZ-900, CCNA1, CCST - Cybersecurity. Previous SWE intern @ Islamic Books & Souvenirs, Cybersecurity Engineering @ Canadian Cyber Inc.
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>4th place in Toronto wrestling championships</strong> → Trained with world champions, learned discipline and resilience that I apply to every project.
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>Seeking Summer 2026 internships</strong> → Open to Intern, Software Engineer Intern, Application Security Intern, and SWE roles. Ready to build something amazing.
            </p>
          </div>
        </section>

        {/* Building Section */}
        <section className="mb-16" id="projects">
          <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>◆ Building:</h2>
          <div className={`space-y-4 text-sm leading-relaxed ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>Course Generation & RAG Platform</strong> → Currently building AI-powered educational tools using Retrieval-Augmented Generation to create personalized learning experiences and course content. <a href="https://github.com/muhibwqr" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">GitHub</a> • Python, RAG, LLMs, Vector Databases
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>Triageo - AI Security Triage</strong> → Hack the North 2025 project. Slack-native AI assistant that parses, classifies, and prioritizes security incidents. From log to triage in under 5 seconds with RAG over OWASP guidelines. <a href="https://github.com/muhibwqr/triageo" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">GitHub</a> • Python, Cohere LLM, Slack API, FastAPI, RAG
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>Scrollify</strong> → Won GoOnHacks. Tracks your productive time and penalizes you by calling your dad with an AI agent to have a chat. Rewards you for doomscrolling. <a href="https://github.com/muhibwqr/scrollify" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">GitHub</a> • Swift, Supabase, Vercel, Twilio, Deepgram
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>Malicious Payload USB Project</strong> → Security research project. USB-based payload emulator using Raspberry Pi to mimic HID attacks and demonstrate access risk with modular scripts for keystroke injection. <a href="https://github.com/muhibwqr/usb-payload" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">GitHub</a> • Python, Raspberry Pi, HID protocols
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>AI Mental Health Voice Agent</strong> → Healthcare AI project. Voice-based conversational agent for empathetic mental health support with crisis detection and safe escalation to human services. <a href="https://github.com/muhibwqr/mental-health-agent" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">GitHub</a> • Python, Twilio, Deepgram, Conversational AI
            </p>
          </div>
        </section>

        {/* Reach Out */}
        <section className="mb-16" id="about">
          <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>◆ Please reach out if you're:</h2>
          <div className={`space-y-3 text-sm ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            <p>→ A fellow founder.</p>
            <p>→ Someone who is curious about me or what I'm doing.</p>
            <p>→ Looking for a software engineer, cybersecurity specialist, or product builder.</p>
          </div>
        </section>

        {/* Contact */}
        <section className="pb-12">
          <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>◆ Contact:</h2>
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
        </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
