import { ExternalLink, Github } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import "./Projects.css";

export function Projects() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const projects = [
    {
      title: "goosetype.com — typing arena",
      description: "Shipped in 1 week → 500 users in 12 hours. Originally 'Waterloo Type' but after 40 students signed up instantly, Waterloo's email security flagged it as phishing and auto-banned it — so I rebranded and rebuilt it into GooseType.",
      stack: "react, ts, tailwind, vercel",
      link: "https://goosetype.com",
      previewVideo: "/goosetype-preview.mp4"
    },
    {
      title: "Triageo — AI security incident responder (HTN 2025)",
      description: "Slack-native agent for 5-second triage over OWASP. Severity scoring, RAG, log insights, recommended actions.",
      stack: "python, fastapi, cohere, slack api",
      link: "#",
      previewImage: undefined
    },
    {
      title: "anti-productivity doomscroll app — GoOnHacks Winner",
      description: "Satirical app that punishes productivity and rewards doomscrolling (AI calls your dad).",
      stack: "swift, supabase, twilio",
      link: "#",
      previewImage: undefined
    }
  ];

  return (
    <section id="projects" className="py-12 sm:py-16 relative scroll-mt-20">
      <div className="px-4 sm:px-6">
        <h2 className="text-xl font-semibold mb-6 text-black dark:text-white">
          ◆ projects
        </h2>
        
        <div className="space-y-4 relative">
          {projects.map((project, index) => (
            <div 
              key={index} 
              className="relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Card className="glass hover-lift border-border/50">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold mb-2 text-black dark:text-white">
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

              {/* Preview on the right */}
              <AnimatePresence>
                {hoveredIndex === index && (project.previewImage || project.previewVideo) && (
                  <motion.div
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute left-full top-0 ml-6 z-50 pointer-events-none project-preview-wrapper"
                  >
                    <div className="project-preview">
                      {project.previewVideo ? (
                        <video
                          src={project.previewVideo}
                          className="project-preview-image"
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      ) : project.previewImage ? (
                        <img 
                          src={project.previewImage} 
                          alt={`${project.title} preview`}
                          className="project-preview-image"
                        />
                      ) : null}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

