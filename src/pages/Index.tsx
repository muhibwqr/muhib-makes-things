import { ScrollVelocity } from "@/components/ScrollVelocity";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const facts = [
    "Started coding at age 11",
    "4th place in Toronto wrestling championships",
    "Trained with world champions",
    "University of Waterloo CS + Math",
    "Building a clothing brand",
    "Travel fanatic",
    "Coffee enthusiast",
    "Food lover",
    "Cybersecurity specialist",
    "Full-stack engineer",
    "Machine learning builder",
    "Cloud infrastructure expert"
  ];

  const socials = [
    { icon: Mail, label: "Email", href: "mailto:m7waqar@uwaterloo.ca" },
    { icon: Github, label: "GitHub", href: "https://github.com/muhibwqr" },
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/muhibwaqar" },
    { icon: Twitter, label: "Twitter", href: "https://x.com/muhibwqr" }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated scrolling text */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <ScrollVelocity
          texts={facts}
          velocity={50}
          parallaxClassName="bg-dark-blue/30 py-4"
          scrollerClassName="text-white"
        />
      </div>

      {/* Main content - centered */}
      <div className="min-h-screen flex flex-col items-center justify-center px-4 relative z-20">
        <div className="text-center space-y-8 max-w-4xl">
          {/* Name */}
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
            <span className="text-white">Muhib</span>
            <span className="text-primary"> Waqar</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-gray-300 font-light">
            Software Engineer • Cybersecurity Specialist • Builder
          </p>

          {/* Key facts grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="text-3xl font-bold text-primary mb-2">11</div>
              <div className="text-sm text-gray-400">Years old when I started coding</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="text-3xl font-bold text-primary mb-2">4th</div>
              <div className="text-sm text-gray-400">Place in Toronto wrestling championships</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="text-3xl font-bold text-primary mb-2">∞</div>
              <div className="text-sm text-gray-400">Passion for building & learning</div>
            </div>
          </div>

          {/* Social links */}
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            {socials.map((social, index) => {
              const Icon = social.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="lg"
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-primary"
                  asChild
                >
                  <a href={social.href} target="_blank" rel="noopener noreferrer">
                    <Icon className="w-5 h-5 mr-2" />
                    {social.label}
                  </a>
                </Button>
              );
            })}
          </div>

          {/* Bottom text */}
          <p className="text-sm text-gray-500 mt-12">
            Seeking Summer 2026 internships in SWE, Cybersecurity & Product
          </p>
        </div>
      </div>

      {/* Bottom animated text */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <ScrollVelocity
          texts={facts}
          velocity={-50}
          parallaxClassName="bg-dark-blue/30 py-4"
          scrollerClassName="text-white"
        />
      </div>
    </div>
  );
};

export default Index;
