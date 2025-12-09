import { ExternalLink, Github } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function Projects() {
  const projects = [
    {
      title: "goosetype.com — typing arena",
      description: "Shipped in 1 week → 500 users in 12 hours. Originally 'Waterloo Type' but after 40 students signed up instantly, Waterloo's email security flagged it as phishing and auto-banned it — so I rebranded and rebuilt it into GooseType.",
      stack: "react, ts, tailwind, vercel",
      link: "https://goosetype.com"
    },
    {
      title: "Triageo — AI security incident responder (HTN 2025)",
      description: "Slack-native agent for 5-second triage over OWASP. Severity scoring, RAG, log insights, recommended actions.",
      stack: "python, fastapi, cohere, slack api",
      link: "#"
    },
    {
      title: "anti-productivity doomscroll app — GoOnHacks Winner",
      description: "Satirical app that punishes productivity and rewards doomscrolling (AI calls your dad).",
      stack: "swift, supabase, twilio",
      link: "#"
    }
  ];

  return (
    <section id="projects" className="py-12 sm:py-16 relative scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <h2 className="text-xl font-semibold mb-6">
          ◆ projects
        </h2>
        
        <div className="space-y-4">
          {projects.map((project, index) => (
            <Card key={index} className="glass hover-lift border-border/50">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold mb-2">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {project.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {project.stack}
                  </p>
                  {project.link !== "#" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="gap-2"
                    >
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

