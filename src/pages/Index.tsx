import { Github, Linkedin, Mail, Twitter, ArrowDown, ArrowRight, ArrowLeft, User, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Index = () => {
  const skills = [
    "TypeScript",
    "Python",
    "React",
    "Node.js",
    "Java",
    "C++",
    "Go",
    "AWS",
    "Docker",
    "Kubernetes",
    "PostgreSQL",
    "MongoDB",
    "GraphQL",
    "Redis",
    "Linux",
    "Git",
    "CI/CD",
    "Machine Learning",
    "Cybersecurity",
    "Cloud Infrastructure"
  ];

  const socials = [
    { icon: Mail, label: "Email", href: "mailto:m7waqar@uwaterloo.ca" },
    { icon: Github, label: "GitHub", href: "https://github.com/muhibwqr" },
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/muhibwaqar" },
    { icon: Twitter, label: "Twitter", href: "https://x.com/muhibwqr" }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Main content - centered */}
      <div className="min-h-screen flex flex-col items-center justify-center px-4 relative z-20">
        <div className="text-center space-y-8 max-w-4xl w-full">
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

          {/* Skills - Clean one line */}
          <div className="w-full mt-4 mb-8">
            <div className="text-sm md:text-base text-gray-400 text-center">
              {skills.join(" • ")}
            </div>
          </div>

          {/* Story/Experience - Google Docs Style */}
          <div className="mt-12 max-w-3xl mx-auto text-left bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 md:p-12">
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <p>
                  <span className="text-white font-semibold">Started coding at age 11</span> → 
                  Been building tech projects for over a decade, from simple scripts to full-stack applications.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <p>
                  <span className="text-white font-semibold">University of Waterloo</span> → 
                  Studying Computer Science + Mathematics, combining technical depth with analytical thinking.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <p>
                  <span className="text-white font-semibold">4th place in Toronto wrestling championships</span> → 
                  Trained with world champions, learned discipline and resilience that I apply to every project.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <p>
                  <span className="text-white font-semibold">Building a clothing brand</span> → 
                  Creating designs, managing production, and selling to friends and customers. Entrepreneurship meets creativity.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <p>
                  <span className="text-white font-semibold">Travel fanatic & food lover</span> → 
                  Explored various destinations, especially connected to my cultural roots in Pakistan. Love discovering authentic local dishes and unique cafes.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <p>
                  <span className="text-white font-semibold">Coffee enthusiast</span> → 
                  Appreciate both artisanal coffee experiences and discovering unique local cafes wherever I go.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <p>
                  <span className="text-white font-semibold">Scrollify</span> → 
                  Won <a href="https://goonhacks.devpost.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">GoOnHacks <ExternalLink className="w-3 h-3" /></a> with an app that keeps you scrolling. Built with modern web technologies. 
                  <a href="https://github.com/muhibwqr/scrollify" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-2 inline-flex items-center gap-1">View on GitHub <ExternalLink className="w-3 h-3" /></a>
                </p>
              </div>

              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <p>
                  <span className="text-white font-semibold">Seeking Summer 2026 internships</span> → 
                  Looking for opportunities in Software Engineering, Cybersecurity, and Product. Ready to build something amazing.
                </p>
              </div>
            </div>
          </div>

          {/* Social links and Resume */}
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
            <Button
              variant="outline"
              size="lg"
              className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-primary"
              asChild
            >
              <a href="/muhib_waqar_resume.pdf" download="muhib_waqar_resume.pdf" target="_blank" rel="noopener noreferrer">
                <Download className="w-5 h-5 mr-2" />
                Resume
              </a>
            </Button>
          </div>

          {/* Bottom Arrow */}
          <div className="flex justify-center mt-12">
            <ArrowDown className="w-6 h-6 md:w-8 md:h-8 text-primary/50 animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
