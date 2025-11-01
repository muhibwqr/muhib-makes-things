import { ThemeToggle } from "./ThemeToggle";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

export function Header() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();

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

  const navItems = [
    { id: "about", label: "About Me", scroll: true },
    { id: "work", label: "Projects", scroll: true },
    { id: "achievements", label: "Achievements", scroll: true },
    { id: "contact", label: "Contact", scroll: true },
  ];

  const interactiveItems = [
    { to: "/chat", label: "🤖 Chat AI" },
    { to: "/keanu", label: "📸 Keanu" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b">
      {/* Scroll Progress Bar */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary transition-all duration-300"
           style={{ width: `${scrollProgress}%` }} />
      
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold gradient-text hover:opacity-80 transition-opacity">
          Muhib Waqar
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          {location.pathname === "/" && navItems.map((item) => (
            <button 
              key={item.id} 
              onClick={() => scrollToSection(item.id)} 
              className="hover:text-primary transition-colors"
            >
              {item.label}
            </button>
          ))}
          {interactiveItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>

        <div className="md:hidden flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                {location.pathname === "/" && navItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => scrollToSection(item.id)}
                    className="w-full justify-start text-lg"
                  >
                    {item.label}
                  </Button>
                ))}
                {interactiveItems.map((item) => (
                  <Link key={item.to} to={item.to}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-lg"
                    >
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
