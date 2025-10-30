import { ChevronDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

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
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background -z-10" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />

      <div className="container mx-auto px-4 text-center">
        <div className="animate-fade-in">
          <div className="mb-6 text-6xl transition-all duration-700 ease-in-out">
            {emojis[currentEmoji]}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Hi, I&apos;m <span className={`gradient-text transition-all duration-500 ease-in-out ${fonts[currentFont]}`}>Muhib Waqar</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto">
            Technical builder, cybersecurity engineer, and creative problem-solver
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
          
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <span className="glass px-4 py-2 rounded-full text-sm">Python</span>
            <span className="glass px-4 py-2 rounded-full text-sm">JavaScript</span>
            <span className="glass px-4 py-2 rounded-full text-sm">Cloud Security</span>
            <span className="glass px-4 py-2 rounded-full text-sm">AWS</span>
            <span className="glass px-4 py-2 rounded-full text-sm">React</span>
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
