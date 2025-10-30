import { Trophy, Award, Target, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

export function Achievements() {
  const achievements = [
    {
      icon: Trophy,
      title: "7M+ Views",
      description: "Across all platforms",
      color: "text-yellow-500"
    },
    {
      icon: Users,
      title: "3 Businesses",
      description: "Before graduating high school",
      color: "text-primary"
    },
    {
      icon: Target,
      title: "CTF Competitions",
      description: "Top rankings in PicoCTF & LyonCTF",
      color: "text-primary"
    },
    {
      icon: Award,
      title: "Cloud Certifications",
      description: "AWS, Cisco, Microsoft certified",
      color: "text-accent"
    }
  ];

  return (
    <section id="achievements" className="py-20 relative scroll-mt-20 transition-all duration-700">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background -z-10" />
      <div className="container mx-auto px-4 animate-fade-in">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
          Achievements <span className="gradient-text">◆</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <Card
                key={index}
                className="glass p-6 hover-lift text-center border-border/50"
              >
                <Icon className={`w-12 h-12 mx-auto mb-4 ${achievement.color}`} />
                <h3 className="text-lg font-bold mb-2">{achievement.title}</h3>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center max-w-2xl mx-auto">
          <p className="text-muted-foreground">
            Studying Math at University of Waterloo, focused on software and cybersecurity engineering. Mentored by industry experts and cyber professionals.
          </p>
        </div>
      </div>
    </section>
  );
}
