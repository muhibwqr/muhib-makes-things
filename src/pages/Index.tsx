import { Github, Linkedin, Mail, Twitter, Download, Moon } from "lucide-react";
import Dither from "@/components/Dither";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  const socials = [
    { icon: Mail, label: "Email", href: "mailto:m7waqar@uwaterloo.ca" },
    { icon: Github, label: "GitHub", href: "https://github.com/muhibwqr" },
    { icon: Twitter, label: "Twitter", href: "https://x.com/muhibwqr" },
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/muhibwaqar" }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Header */}
      <header className="container mx-auto px-6 py-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold underline">◆ Muhib Waqar</h1>
          <div className="mt-2 space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <span>→</span>
              <span>CS</span>
              <span className="text-xs">UWaterloo</span>
            </div>
          </div>
        </div>
        <nav className="text-sm">
          <div className="flex items-center gap-2">
            <a href="#projects" className="hover:underline">Projects</a>
            <span>|</span>
            <a href="#about" className="hover:underline">About me</a>
            <span>|</span>
            <div className="flex items-center gap-1">
              <Moon className="w-4 h-4" />
              <span>Dark mode</span>
            </div>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 pb-12 max-w-4xl">
        {/* What makes me different */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold mb-4">◆ What makes me different:</h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              → <strong>Started coding at age 11</strong> → Been building tech projects for over a decade, from simple scripts to full-stack applications.
            </p>
            <p>
              → <strong>4th place in Toronto wrestling championships</strong> → Trained with world champions, learned discipline and resilience that I apply to every project.
            </p>
            <p>
              → <strong>University of Waterloo</strong> → Studying Computer Science + Mathematics, combining technical depth with analytical thinking.
            </p>
            <p>
              → <strong>Building a clothing brand</strong> → Creating designs, managing production, and selling to friends and customers. Entrepreneurship meets creativity.
            </p>
            <p>
              → <strong>Travel fanatic & food lover</strong> → Explored various destinations, especially connected to my cultural roots in Pakistan. Love discovering authentic local dishes and unique cafes.
            </p>
            <p>
              → <strong>Coffee enthusiast</strong> → Appreciate both artisanal coffee experiences and discovering unique local cafes wherever I go.
            </p>
            <p>
              → <strong>Scrollify</strong> → Won <a href="https://goonhacks.devpost.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">GoOnHacks</a> with an app that keeps you scrolling. Built with modern web technologies. <a href="https://github.com/muhibwqr/scrollify" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">View on GitHub</a>
            </p>
            <p>
              → <strong>Seeking Summer 2026 internships</strong> → Looking for opportunities in Software Engineering, Cybersecurity, and Product. Ready to build something amazing.
            </p>
          </div>
        </section>

        {/* Building Section */}
        <section className="mb-12" id="projects">
          <h2 className="text-lg font-semibold mb-4">◆ Building:</h2>
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              → <strong>Scrollify</strong> → An app that keeps you scrolling. Won GoOnHacks hackathon. <a href="https://github.com/muhibwqr/scrollify" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">GitHub</a>
            </p>
          </div>
        </section>

        {/* Dither Component */}
        <section className="mb-12">
          <div style={{ width: '100%', height: '600px', position: 'relative' }}>
            <Dither
              waveColor={[0.5, 0.5, 0.5]}
              disableAnimation={false}
              enableMouseInteraction={true}
              mouseRadius={0.3}
              colorNum={4}
              waveAmplitude={0.3}
              waveFrequency={3}
              waveSpeed={0.05}
            />
          </div>
        </section>

        {/* Reach Out */}
        <section className="mb-12" id="about">
          <h2 className="text-lg font-semibold mb-4">◆ Please reach out if you're:</h2>
          <div className="space-y-2 text-sm">
            <p>→ A fellow founder.</p>
            <p>→ Someone who is curious about me or what I'm doing.</p>
            <p>→ Looking for a software engineer, cybersecurity specialist, or product builder.</p>
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-lg font-semibold mb-4">◆ Contact:</h2>
          <div className="flex flex-wrap gap-4 text-sm">
            {socials.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:underline"
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
              className="flex items-center gap-2 hover:underline"
            >
              <Download className="w-4 h-4" />
              Resume
            </a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
