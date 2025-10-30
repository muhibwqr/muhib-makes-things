import { ThemeToggle } from "./ThemeToggle";
import { useEffect, useState } from "react";

export function Header() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = (currentScroll / totalScroll) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b">
      {/* Scroll Progress Bar */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary transition-all duration-300"
           style={{ width: `${scrollProgress}%` }} />
      
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold gradient-text">Muhib Waqar</h1>
        
        <nav className="hidden md:flex items-center gap-6">
          <button onClick={() => scrollToSection("about")} className="hover:text-primary transition-colors">
            About Me
          </button>
          <button onClick={() => scrollToSection("work")} className="hover:text-primary transition-colors">
            Projects
          </button>
          <button onClick={() => scrollToSection("achievements")} className="hover:text-primary transition-colors">
            Achievements
          </button>
          <button onClick={() => scrollToSection("contact")} className="hover:text-primary transition-colors">
            Contact
          </button>
          <ThemeToggle />
        </nav>

        <div className="md:hidden">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
