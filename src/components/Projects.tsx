import { ExternalLink, Folder } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TvPreview from "./TvPreview";
import "./Projects.css";

const ROTATE_INTERVAL_MS = 5000;

export function Projects() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [rotateIndex, setRotateIndex] = useState(0);
  const navigate = useNavigate();

  const projects = [
    {
      id: "goosetype",
      title: "goosetype.com — typing arena (5000+ tests)",
      description: "Shipped in 1 week → 500 users in 12 hours. Originally 'Waterloo Type' but after 40 students signed up instantly, Waterloo's security flagged it as phishing and banned it. Rebranded to GooseType, rebuilt in 48h (5000+ tests taken).",
      stack: "react, ts, tailwind, vercel",
      link: "https://goosetype.com",
      previewVideo: "/goosetype-preview.mp4"
    },
    {
      id: "triageo",
      title: "Triageo — AI security incident responder (HTN 2025)",
      description: "Slack-native AI agent that triages security incidents in under 5 seconds. OWASP severity scoring, RAG over logs, recommended actions with tagged responders. Learns from past incidents to flag similar patterns. HTN 2025 — got kudos from judges.",
      stack: "python, fastapi, cohere, slack api",
      link: "https://devpost.com/software/triageo",
      previewImages: ['/triageo-1.jpg', '/triageo-2.jpg']
    },
    {
      id: "scrollify",
      title: "Scrollify — anti-productivity doomscroll app (GoOnHacks25)",
      description: "Scrollify — an app that maximizes doomscrolling. If you're off social media for 5+ mins, it triggers a Twilio voice AI agent that calls your dad. Features live leaderboard, browser extension tracking, and iOS app blocking. Won the 67 award at GoOnHacks25.",
      stack: "swift, supabase, twilio",
      link: "https://devpost.com/software/scrollify-tp4a2l",
      previewVideo: '/scrollify.mov'
    },
    {
      id: "brev-analyzer",
      title: "Model Cost Analyzer — brev.dev instance optimizer",
      description: "A friend and I were setting up a GPU instance on Brev.Dev by NVIDIA and were struggling to pick an instance for our model that wouldn't cost us extra. Built a cost analyzer to help choose the right GPU instance based on model requirements and budget constraints.",
      stack: "python, jupyter notebook, shell",
      link: "https://brev.dev",
      previewVideo: '/brev-instance.mp4'
    },
    {
      id: "flowerOS",
      title: "flowerOS — dedicated to zahid mehboob",
      description: "If you sacrifice purpose for technical prowess, you're ngmi. A tool built for a seventy-year-old artisan—my grandfather—to bridge the engineering principles of tech with the workflow of hand sewn ribbons and floral motifs.",
      stack: "built for purpose",
      link: "#",
      previewVideo: "/cursorful-video-1770059587142.mp4"
    },
    {
      id: "cursor-doc-intelligence",
      title: "Document intelligence pipeline — nv-ingest + NIMs (cursor.md)",
      description: "RL documentation is a desert. We built a document intelligence pipeline on NVIDIA nv-ingest with NIMs, fed a real Amazon PRD through the system, and ran it with cursor.md—Cursor analyzed the full schema and mapped the logic within seconds.",
      stack: "nvidia nv-ingest, nvidia NIMs, docker",
      link: "#",
      previewVideo: "/cursor-doc-intelligence.mov"
    }
  ];

  // Rotate through projects in the TV when nothing is hovered
  useEffect(() => {
    if (hoveredIndex !== null) return;
    const interval = setInterval(() => {
      setRotateIndex((prev) => (prev + 1) % projects.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [hoveredIndex, projects.length]);

  const activeProject = hoveredIndex !== null ? projects[hoveredIndex] : projects[rotateIndex];
  const activeIndex = hoveredIndex !== null ? hoveredIndex : rotateIndex;

  return (
    <section id="projects" className="section-spacing relative scroll-mt-20">
      <div className="px-4 sm:px-6">
        <h2 className="section-header text-black dark:text-white">
        ↳ projects i worked on (hover over them!)
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
                      <Card 
                        className={`glass hover-lift border-border/50 project-card-minimal cursor-pointer ${index === activeIndex ? 'border-primary/50 bg-primary/5 ring-2 ring-primary/30' : ''}`}
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-black/5 dark:bg-white/10 rounded-lg">
                        <Folder size={20} className="text-black dark:text-white" />
                        </div>
                        <h3 className="project-title text-black dark:text-white">
                        {project.title}
                        </h3>
                  </div>
                    <ExternalLink size={18} className="text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
                    </Card>
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
