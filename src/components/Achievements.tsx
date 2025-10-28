import { Trophy, Award, Target, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

export function Achievements() {
  const achievements = [
    {
      icon: Trophy,
      title: "Hack the North",
      description: "Multiple finalist positions",
      color: "text-yellow-500"
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
    },
    {
      icon: Users,
      title: "Velocity Incubator",
      description: "University of Waterloo affiliation",
      color: "text-primary"
    }
  ];

  return (
    <section id="achievements" className="py-20">
      <div className="container mx-auto px-4">
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
            Mentored by industry experts and cyber professionals. Active member of the University of Waterloo tech community and Velocity Incubator.
          </p>
        </div>
      </div>
    </section>
  );
}
