import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Contact() {
  const socials = [
    { icon: Mail, label: "Email", href: "mailto:m7waqar@uwaterloo.ca", color: "hover:text-primary" },
    { icon: Github, label: "GitHub", href: "https://github.com/muhibwqr", color: "hover:text-foreground" },
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/muhibwaqar", color: "hover:text-blue-500" },
    { icon: Twitter, label: "Twitter", href: "https://x.com/muhibwqr", color: "hover:text-sky-500" }
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-accent/5 to-primary/5 scroll-mt-20 transition-all duration-700">
      <div className="container mx-auto px-4 text-center animate-fade-in">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Let's Connect <span className="gradient-text">◆</span>
        </h2>
        
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          Reach out for collaboration, internships, or to chat about tech — fellow founders, engineers, or curious minds welcome! ✨
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {socials.map((social, index) => {
            const Icon = social.icon;
            return (
              <Button
                key={index}
                variant="outline"
                size="lg"
                className={`glass hover-lift ${social.color} transition-colors`}
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

        <div className="text-sm text-muted-foreground">
          <p>Built by muhibwaqar using React, TypeScript, and Tailwind CSS</p>
        </div>
      </div>
    </section>
  );
}
