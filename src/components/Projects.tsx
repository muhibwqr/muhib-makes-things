import { ExternalLink, Folder } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import TvPreview from "./TvPreview";
import "./Projects.css";

export function Projects() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const projects = [
    {
      title: "goosetype.com — typing arena (5000+ tests)",
      description: "Shipped in 1 week → 500 users in 12 hours. Originally 'Waterloo Type' but after 40 students signed up instantly, Waterloo's security flagged it as phishing and banned it. Rebranded to GooseType, rebuilt in 48h (5000+ tests taken).",
      stack: "react, ts, tailwind, vercel",
      link: "https://goosetype.com",
      previewVideo: "/goosetype-preview.mp4"
    },
    {
      title: "Triageo — AI security incident responder (HTN 2025)",
      description: "Slack-native AI agent that triages security incidents in under 5 seconds. OWASP severity scoring, RAG over logs, recommended actions with tagged responders. Learns from past incidents to flag similar patterns. HTN 2025 — got kudos from judges.",
      stack: "python, fastapi, cohere, slack api",
      link: "https://devpost.com/software/triageo",
      previewImages: ['/triageo-1.jpg', '/triageo-2.jpg']
    },
    {
      title: "Scrollify — anti-productivity doomscroll app (GoOnHacks25)",
      description: "Scrollify — an app that maximizes doomscrolling. If you're off social media for 5+ mins, it triggers a Twilio voice AI agent that calls your dad. Features live leaderboard, browser extension tracking, and iOS app blocking. Won GoOnHacks25 by design.",
      stack: "swift, supabase, twilio",
      link: "https://devpost.com/software/scrollify-tp4a2l",
      previewVideo: '/scrollify.mov'
    }
  ];

  const activeProject = hoveredIndex !== null ? projects[hoveredIndex] : null;

  return (
    <section id="projects" className="py-12 sm:py-16 relative scroll-mt-20">
      <div className="px-4 sm:px-6">
        <h2 className="text-xl font-semibold mb-6 text-black dark:text-white">
        → projects i worked on (hover over them!)
        </h2>
        
        <div className="projects-layout">
            <div className="projects-list space-y-4">
            {projects.map((project, index) => (
                <div 
                key={index} 
                className="relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                >
                <a 
                    href={project.link}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                >
                    <Card className={`glass hover-lift border-border/50 project-card-minimal ${hoveredIndex === index ? 'border-primary/50 bg-primary/5' : ''}`}>
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-black/5 dark:bg-white/10 rounded-lg">
                        <Folder size={20} className="text-black dark:text-white" />
                        </div>
                        <h3 className="text-lg font-medium text-black dark:text-white">
                        {project.title}
                        </h3>
                    </div>
                    <ExternalLink size={18} className="text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
                    </Card>
                </a>
                </div>
            ))}
            </div>

            <div className="projects-tv-container">
                <TvPreview project={activeProject} />
            </div>
        </div>
      </div>
    </section>
  );
}
