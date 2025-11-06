import { ChevronDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import SplashCursor from "./SplashCursor";

export function Hero() {
  const [currentEmoji, setCurrentEmoji] = useState(0);
  const [currentFont, setCurrentFont] = useState(0);

  const emojis = ["👨‍💻", "🔐", "📐", "☁️", "🚀", "🛠️", "⚡", "🎯"];
  const fonts = ["font-space", "font-orbitron", "font-righteous", "font-playfair", "font-montserrat"];

  useEffect(() => {
    const emojiInterval = setInterval(() => {
      setCurrentEmoji((prev) => (prev + 1) % emojis.length);
    }, 1500);

    const fontInterval = setInterval(() => {
      setCurrentFont((prev) => (prev + 1) % fonts.length);
    }, 800);

    return () => {
      clearInterval(emojiInterval);
      clearInterval(fontInterval);
    };
  }, []);

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Fluid SplashCursor animation only for hero section */}
      <SplashCursor style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }} />

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="animate-fade-in">
          <div className="mb-6 text-6xl transition-all duration-700 ease-in-out">
            {emojis[currentEmoji]}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Hi, I&apos;m <span className={`gradient-text transition-all duration-500 ease-in-out ${fonts[currentFont]}`}>Muhib Waqar</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto">
            Fullstack, cybersecurity, and machine learning engineering, approaching problems with a creative mindset
          </p>
          <p className="text-lg text-muted-foreground mb-2">
            ✨ University of Waterloo Math • Been working on tech since I was 11
          </p>
          <div className="inline-block glass px-6 py-3 rounded-lg mb-6 border-2 border-primary animate-pulse">
            <p className="text-lg font-bold text-primary">
              🚀 Actively seeking Summer 2026 internships in SWE, Cybersecurity & Product
            </p>
          </div>

          <Button 
            variant="outline" 
            size="lg"
            className="glass hover-lift mb-8 border-primary/50"
            asChild
          >
            <a href="/muhib_waqar_resume.pdf" download="Muhib_Waqar_Resume.pdf">
              <Download className="w-5 h-5 mr-2" />
              Download Resume
            </a>
          </Button>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8 max-w-4xl mx-auto">
            <span className="glass px-4 py-2 rounded-full text-sm font-semibold">Python</span>
            <span className="glass px-4 py-2 rounded-full text-sm">TensorFlow</span>
            <span className="glass px-4 py-2 rounded-full text-sm">PyTorch</span>
            <span className="glass px-4 py-2 rounded-full text-sm">Pandas</span>
            <span className="glass px-4 py-2 rounded-full text-sm">NumPy</span>
            <span className="glass px-4 py-2 rounded-full text-sm font-semibold">JavaScript</span>
            <span className="glass px-4 py-2 rounded-full text-sm">TypeScript</span>
            <span className="glass px-4 py-2 rounded-full text-sm">React</span>
            <span className="glass px-4 py-2 rounded-full text-sm">Node.js</span>
            <span className="glass px-4 py-2 rounded-full text-sm font-semibold">Cloud Security</span>
            <span className="glass px-4 py-2 rounded-full text-sm">AWS</span>
            <span className="glass px-4 py-2 rounded-full text-sm">Azure</span>
            <span className="glass px-4 py-2 rounded-full text-sm">Docker</span>
            <span className="glass px-4 py-2 rounded-full text-sm">Kubernetes</span>
            <span className="glass px-4 py-2 rounded-full text-sm">Scikit-learn</span>
            <span className="glass px-4 py-2 rounded-full text-sm">FastAPI</span>
            <span className="glass px-4 py-2 rounded-full text-sm">SQL</span>
          </div>
        </div>

        <button 
          onClick={scrollToAbout}
          className="animate-bounce mt-8 hover-lift"
          aria-label="Scroll to about section"
        >
          <ChevronDown className="w-8 h-8 text-primary" />
        </button>
      </div>
    </section>
  );
}
