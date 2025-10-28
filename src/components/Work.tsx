import { Briefcase, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function Work() {
  const experiences = [
    {
      company: "Islamic Books Souvenirs",
      role: "Software Engineering Intern",
      period: "2023-2024",
      highlights: [
        "Automated product catalog system",
        "Improved Shopify themes and UX",
        "Built real-time WhatsApp support integration"
      ],
      link: "#"
    },
    {
      company: "Blackstone Foundation",
      role: "Cybersecurity Engineer",
      period: "2023",
      highlights: [
        "Developed Python automation tools",
        "Implemented RBAC and IAM policies",
        "Created incident management workflows"
      ],
      link: "#"
    }
  ];

  const currentProjects = [
    {
      title: "AI Assistant for Slack",
      status: "In Progress",
      description: "Smart automation bot for team productivity"
    },
    {
      title: "Mental Health Voice Agent",
      status: "Beta",
      description: "Conversational AI for wellness support"
    },
    {
      title: "Raspberry Pi Red-Team Emulator",
      status: "Building",
      description: "Portable security testing toolkit"
    }
  ];

  return (
    <section id="work" className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
          Work & Projects <span className="gradient-text">◆</span>
        </h2>

        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="text-2xl font-semibold mb-8 flex items-center gap-2">
            <Briefcase className="text-primary" /> Experience
          </h3>
          
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <Card key={index} className="glass p-6 hover-lift">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-bold">{exp.company}</h4>
                    <p className="text-primary">{exp.role}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{exp.period}</span>
                </div>
                <ul className="space-y-2">
                  {exp.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-accent mt-1">▸</span>
                      <span className="text-muted-foreground">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-semibold">Building Now 🚀</h3>
            <span className="text-sm text-accent animate-pulse">● Live Updates</span>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {currentProjects.map((project, index) => (
              <Card key={index} className="glass p-6 hover-lift glow">
                <div className="mb-4">
                  <span className="text-xs px-3 py-1 rounded-full bg-accent/20 text-accent">
                    {project.status}
                  </span>
                </div>
                <h4 className="text-lg font-bold mb-2">{project.title}</h4>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </Card>
            ))}
          </div>
          
          <p className="text-center mt-8 text-muted-foreground">
            <span className="gradient-text font-semibold">Project dropping soon!</span> ✨
          </p>
        </div>
      </div>
    </section>
  );
}
