import { Code, Shield, Trophy, Award } from "lucide-react";
import { Card } from "@/components/ui/card";

export function About() {
  const highlights = [
    {
      icon: Code,
      title: "Software Engineering",
      description: "Automated business workflows and cut support times as a software engineering intern at Islamic Books Souvenirs"
    },
    {
      icon: Shield,
      title: "Cybersecurity",
      description: "Delivered impactful solutions: IAM policies, RBAC, SIEM log automation, and incident response playbooks"
    },
    {
      icon: Trophy,
      title: "Hackathons",
      description: "Multiple finalist and award wins at Hack the North, CanHack, PicoCTF, LyonCTF"
    },
    {
      icon: Award,
      title: "Certifications",
      description: "AWS, Cisco, and Microsoft certifications for cloud and security"
    }
  ];

  return (
    <section id="about" className="py-20 relative scroll-mt-20 transition-all duration-700">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background -z-10" />
      <div className="container mx-auto px-4 animate-fade-in">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
          About Me <span className="gradient-text">◆</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card
                key={index}
                className="glass p-6 hover-lift border-border/50"
              >
                <Icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
