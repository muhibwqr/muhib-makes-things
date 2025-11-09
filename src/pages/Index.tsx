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
        <header className={`container mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-center gap-4 border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="flex items-center gap-3 sm:gap-4">
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
          <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>◆ What makes me different:</h2>
          <div className={`space-y-3 text-base leading-relaxed ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>Been in tech since age 11</strong> → From entrepreneurship and graphic design to software engineering. Think beyond code.
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>University of Waterloo</strong> → Honours Math & Business Admin, President's Scholarship. Bridge technical depth with business impact.
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>5M+ views across platforms</strong> → Built a personal brand, helped non-profits, and mentored creators. Scale impact beyond my own work.
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>Building course generation & RAG</strong> → AI-powered tools for personalized learning. Making quality education accessible at scale.
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>Certified & experienced</strong> → AWS CCP, AZ-900, CCNA1, CCST. SWE intern @ IBS, Cybersecurity @ Canadian Cyber Inc.
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>4th place Toronto wrestling</strong> → Trained with world champions. That discipline translates to debugging at 2am.
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>Seeking Summer 2026 internships</strong> → Open to Intern, SWE Intern, Application Security Intern, and SWE roles.
            </p>
          </div>
        </section>

        {/* Building Section */}
        <section className="mb-16" id="projects">
          <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>◆ Building:</h2>
          <div className={`space-y-3 text-base leading-relaxed ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>Course Generation & RAG Platform</strong> → AI-powered tools for personalized learning. <a href="https://github.com/muhibwqr" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">GitHub</a> • Python, RAG, LLMs, Databases, Full Stack
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>Triageo - AI Security Triage</strong> → Hack the North 2025. Slack-native assistant that triages security incidents in under 5 seconds using RAG over OWASP guidelines. <a href="https://github.com/muhibwqr/triageo" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">GitHub</a> • Python, Cohere LLM, Slack API, FastAPI, RAG
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>Scrollify</strong> → Won GoOnHacks. Satirical productivity app that penalizes productive time by calling your dad via AI agent. Rewards doomscrolling. <a href="https://github.com/muhibwqr/scrollify" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">GitHub</a> • Swift, Supabase, Vercel, Twilio, Deepgram
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>Malicious Payload USB Project</strong> → Security research. USB-based payload emulator using Raspberry Pi to demonstrate HID attack vectors. <a href="https://github.com/muhibwqr/usb-payload" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">GitHub</a> • Python, Raspberry Pi, HID protocols
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>AI Mental Health Voice Agent</strong> → Healthcare AI with empathetic support and crisis detection. Proves AI can augment care, not replace human connection. <a href="https://github.com/muhibwqr/mental-health-agent" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">GitHub</a> • Python, Twilio, Deepgram, Conversational AI
            </p>
          </div>
        </section>

        {/* Reach Out */}
        <section className="mb-16" id="about">
          <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>◆ Please reach out if you're:</h2>
          <div className={`space-y-2 text-base leading-relaxed ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            <p>→ A fellow founder building something meaningful.</p>
            <p>→ Curious about my work or want to chat about tech, entrepreneurship, or wrestling.</p>
            <p>→ Looking for technical depth, business acumen, and execution in SWE, cybersecurity, or product roles.</p>
            <p className={`mt-4 pt-4 border-t ${isDark ? 'border-white/10 text-gray-300' : 'border-gray-200 text-gray-700'}`}>
              I respond within 12 hours. Feel free to message me anywhere.
            </p>
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
