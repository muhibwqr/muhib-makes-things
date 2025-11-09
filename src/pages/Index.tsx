import { Github, Linkedin, Mail, Twitter, Download, Moon, Sun } from "lucide-react";
import Orb from "@/components/Orb";
import { useState, useEffect } from "react";

const Index = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    const isDarkMode = root.classList.contains("dark");
    setIsDark(isDarkMode);
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
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen">
      {/* Header */}
      <header className={`container mx-auto px-6 py-8 flex justify-between items-start border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
        <div>
          <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>◆ Muhib Waqar</h1>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <div className="flex items-center gap-2">
              <span>→</span>
              <span>CS</span>
              <span className="text-xs">UWaterloo</span>
            </div>
          </div>
        </div>
        <nav className="text-sm">
          <div className="flex items-center gap-4">
            <a href="#projects" className={`transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}>Projects</a>
            <span className={isDark ? 'text-gray-600' : 'text-gray-300'}>|</span>
            <a href="#about" className={`transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}>About me</a>
            <span className={isDark ? 'text-gray-600' : 'text-gray-300'}>|</span>
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                isDark 
                  ? 'bg-white/5 hover:bg-white/10 border border-white/10 text-white' 
                  : 'bg-black/5 hover:bg-black/10 border border-black/10 text-black'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4" />
                  <span>Dark</span>
                </>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        {/* What makes me different */}
        <section className="mb-16">
          <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>◆ What makes me different:</h2>
          <div className={`space-y-4 text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>Started coding at age 11</strong> → Been building tech projects for over a decade, from simple scripts to full-stack applications.
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>4th place in Toronto wrestling championships</strong> → Trained with world champions, learned discipline and resilience that I apply to every project.
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>University of Waterloo</strong> → Studying Computer Science + Mathematics, combining technical depth with analytical thinking.
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>Building a clothing brand</strong> → Creating designs, managing production, and selling to friends and customers. Entrepreneurship meets creativity.
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>Travel fanatic & food lover</strong> → Explored various destinations, especially connected to my cultural roots in Pakistan. Love discovering authentic local dishes and unique cafes.
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>Coffee enthusiast</strong> → Appreciate both artisanal coffee experiences and discovering unique local cafes wherever I go.
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>Scrollify</strong> → Won <a href="https://goonhacks.devpost.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">GoOnHacks</a> with an app that keeps you scrolling. Built with modern web technologies. <a href="https://github.com/muhibwqr/scrollify" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">View on GitHub</a>
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>Seeking Summer 2026 internships</strong> → Looking for opportunities in Software Engineering, Cybersecurity, and Product. Ready to build something amazing.
            </p>
          </div>
        </section>

        {/* Building Section */}
        <section className="mb-16" id="projects">
          <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>◆ Building:</h2>
          <div className={`space-y-4 text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>Scrollify</strong> → Won <a href="https://goonhacks.devpost.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">GoOnHacks</a> with an app that keeps you scrolling. Built with modern web technologies. <a href="https://github.com/muhibwqr/scrollify" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">GitHub</a>
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>Triageo - AI Security Triage</strong> → Hack the North 2025 project. Slack-native AI assistant for incident response. From chaos to clarity, in seconds.
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>Malicious Payload USB Project</strong> → Security research project. USB-based payload emulator using Raspberry Pi to mimic HID attacks and demonstrate access risk with modular scripts for keystroke injection.
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>AI Mental Health Voice Agent</strong> → Healthcare AI project. Voice-based conversational agent for empathetic mental health support with crisis detection and safe escalation to human services.
            </p>
            <p>
              → <strong className={isDark ? 'text-white' : 'text-black'}>Phenomenon Collective</strong> → Dynamic clothing brand blending creative vision with social impact. Creating designs, managing production, and building a community.
            </p>
          </div>
        </section>

        {/* Reach Out */}
        <section className="mb-16" id="about">
          <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>◆ Please reach out if you're:</h2>
          <div className={`space-y-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <p>→ A fellow founder.</p>
            <p>→ Someone who is curious about me or what I'm doing.</p>
            <p>→ Looking for a software engineer, cybersecurity specialist, or product builder.</p>
          </div>
        </section>

        {/* Contact */}
        <section className="pb-12">
          <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-black'}`}>◆ Contact:</h2>
          <div className="flex flex-wrap gap-6 text-sm">
            {socials.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 transition-colors border px-4 py-2 rounded-lg ${
                    isDark 
                      ? 'text-gray-300 hover:text-white border-white/10 hover:border-white/20 hover:bg-white/5' 
                      : 'text-gray-700 hover:text-black border-black/10 hover:border-black/20 hover:bg-black/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {social.label}
                </a>
              );
            })}
            <a
              href="/muhib_waqar_resume.pdf"
              download="muhib_waqar_resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 transition-colors border px-4 py-2 rounded-lg ${
                isDark 
                  ? 'text-gray-300 hover:text-white border-white/10 hover:border-white/20 hover:bg-white/5' 
                  : 'text-gray-700 hover:text-black border-black/10 hover:border-black/20 hover:bg-black/5'
              }`}
            >
              <Download className="w-4 h-4" />
              Resume
            </a>
          </div>
        </section>
      </main>
      </div>
    </div>
  );
};

export default Index;
