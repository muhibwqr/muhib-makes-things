import { ScrollVelocity } from "@/components/ScrollVelocity";
import { Github, Linkedin, Mail, Twitter, ArrowDown, ArrowRight, ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
          {/* Profile Icon */}
          <div className="flex justify-center mb-4">
            <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-primary/50 ring-4 ring-primary/20">
              <AvatarImage src="/profile.jpg" alt="Muhib Waqar" />
              <AvatarFallback className="bg-primary/20 text-primary text-4xl md:text-5xl font-bold">
                <User className="w-16 h-16 md:w-20 md:h-20" />
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Decorative Arrows */}
          <div className="flex items-center justify-center gap-8 mb-4">
            <ArrowLeft className="w-6 h-6 md:w-8 md:h-8 text-primary/50 animate-pulse" />
            <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
            <ArrowRight className="w-6 h-6 md:w-8 md:h-8 text-primary/50 animate-pulse" />
          </div>

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

          {/* Bottom Arrow */}
          <div className="flex justify-center mt-8">
            <ArrowDown className="w-6 h-6 md:w-8 md:h-8 text-primary/50 animate-bounce" />
          </div>
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
