import { ExternalLink, Folder } from "lucide-react";
import { Card } from "@/components/ui/card";
import { projectsData } from "@/lib/projectsData";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TvPreview from "./TvPreview";
import "./Projects.css";

const ROTATE_INTERVAL_MS = 5000;

export function Projects() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [rotateIndex, setRotateIndex] = useState(0);
  const navigate = useNavigate();
  const projects = projectsData;

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
                        className={`relative overflow-hidden glass hover-lift border-border/50 project-card-minimal cursor-pointer ${index === activeIndex ? 'border-primary/50 bg-primary/5 ring-2 ring-primary/30' : ''}`}
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        {/* Translucent preview as background */}
                        <div className="absolute inset-0 z-0 opacity-[0.28] dark:opacity-[0.24]">
                          {project.previewVideo ? (
                            <video
                              src={project.previewVideo}
                              className="w-full h-full object-cover pointer-events-none"
                              muted
                              loop
                              playsInline
                              autoPlay
                            />
                          ) : project.previewImages?.[0] ? (
                            <img
                              src={project.previewImages[0]}
                              alt=""
                              className="w-full h-full object-cover pointer-events-none"
                            />
                          ) : (project as { previewImage?: string }).previewImage ? (
                            <img
                              src={(project as { previewImage?: string }).previewImage}
                              alt=""
                              className="w-full h-full object-cover pointer-events-none"
                            />
                          ) : null}
                        </div>
                        <div className="relative z-10 flex items-center justify-between w-full">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-black/5 dark:bg-white/10 rounded-lg">
                              <Folder size={20} className="text-black dark:text-white" />
                            </div>
                            <h3 className="project-title text-black dark:text-white">
                              {project.title}
                            </h3>
                          </div>
                          <ExternalLink size={18} className="text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
                        </div>
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
