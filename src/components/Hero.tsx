import { ChevronDown } from "lucide-react";

export function Hero() {
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
          <div className="mb-6 text-6xl">👨‍💻</div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Hi, I'm <span className="gradient-text">Muhib Waqar</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto">
            Technical builder, cybersecurity engineer, and creative problem-solver
          </p>
          <p className="text-lg text-muted-foreground mb-2">
            ✨ University of Waterloo Math • Been working on tech since I was 11
          </p>
          <div className="inline-block glass px-6 py-3 rounded-lg mb-8 border-2 border-primary">
            <p className="text-lg font-bold text-primary">
              🚀 Actively seeking Summer 2026 internships in SWE, Cybersecurity & Product
            </p>
          </div>
          
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
