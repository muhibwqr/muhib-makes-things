import { Briefcase, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function Work() {
  const experiences = [
    {
      company: "Islamic Books & Souvenirs",
      role: "Software Engineer & Systems Design Intern",
      period: "Dec 2024 - Jun 2025",
      highlights: [
        "Made cool automations & systems that made e-com operations seamless",
        "Built a custom Shopify theme + WhatsApp integration for better UX & real-time support"
      ],
      link: "#"
    },
    {
      company: "Canadian Cyber Inc.",
      role: "Cybersecurity Engineering",
      period: "Jan 2020 - Oct 2023",
      highlights: [
        "Led AWS & Azure integration projects that boosted security + efficiency",
        "Rolled out WIP & BitLocker policies org-wide, strengthening endpoint protection",
        "Handled incident response + vulnerability fixes, improving overall security posture",
        "Reviewed + drafted ISO 27001 / SOC 2 / NIST docs to support audits & compliance"
      ],
      link: "#"
    },
    {
      company: "The Blackstone Foundation Library",
      role: "Software Engineer & Cybersecurity Intern",
      period: "Feb 2024 - Jun 2024",
      highlights: [
        "Created a registration system w/ API that let admins log in & approve entries faster",
        "Trained staff on security basics + implemented best practices so threat actors couldn't win"
      ],
      link: "#"
    },
    {
      company: "Astralis",
      role: "Founder",
      period: "Jun 2022 - Feb 2023",
      highlights: [
        "Started a small tech + cyber consulting biz to help clients w/ support, security, and cloud",
        "Led strategy, client projects, and built a team that delivered reliable + secure IT systems"
      ],
      link: "#"
    }
  ];

  const currentProjects = [
    {
      title: "Triageo - AI Security Triage",
      status: "Hack the North 2025",
      description: "Slack-native AI assistant for incident response. From chaos to clarity, in seconds.",
      badge: "🏆 HTN Finalist"
    },
    {
      title: "Phenomenon Collective",
      status: "Founded",
      description: "Dynamic clothing brand blending creative vision with social impact. 7M+ views across platforms.",
      badge: "🎨 Brand"
    },
    {
      title: "Next Project",
      status: "Coming Soon",
      description: "Building something new. Stay tuned for updates!",
      badge: "✨ TBA"
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
                <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                <span className="text-xs text-primary font-semibold">{project.badge}</span>
              </Card>
            ))}
          </div>
          
          <p className="text-center mt-8 text-muted-foreground">
            <span className="gradient-text font-semibold">Looking for Summer 2026 internships!</span> Open to SWE, cybersecurity, and product roles ✨
          </p>
        </div>
      </div>
    </section>
  );
}
