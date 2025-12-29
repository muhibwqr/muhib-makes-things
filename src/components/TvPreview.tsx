import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from "lucide-react";
import './TvPreview.css';

interface Project {
  title: string;
  description: string;
  stack: string;
  link: string;
  previewVideo?: string;
  previewImage?: string;
  previewImages?: string[];
}

interface TvPreviewProps {
  project: Project | null;
}

export default function TvPreview({ project }: TvPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Handle image rotation for projects with multiple preview images
  useEffect(() => {
    if (!project?.previewImages || project.previewImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % project.previewImages!.length);
    }, 500); // 0.5 seconds

    return () => clearInterval(interval);
  }, [project]);

  // Reset image index when project changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [project?.title]);

  useEffect(() => {
    if (project) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 500;
      canvas.height = canvas.parentElement?.clientHeight || 400;
    };
    resize();
    window.addEventListener('resize', resize);

    const loop = () => {
       const w = canvas.width;
       const h = canvas.height;
       if (w === 0 || h === 0) return;
       
       const idata = ctx.createImageData(w, h);
       const buffer32 = new Uint32Array(idata.data.buffer);
       const len = buffer32.length;

       for (let i = 0; i < len; i++) {
           const gray = Math.random() < 0.5 ? 0 : 255;
           buffer32[i] = (255 << 24) | (gray << 16) | (gray << 8) | gray;
       }
       ctx.putImageData(idata, 0, 0);
       animationId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(animationId);
    };
  }, [project]);

  return (
    <div className="tv-wrapper">
      <div className="tv-frame">
        <div className="tv-screen-container">
          <div className="tv-screen">
            {project ? (
              <div className="tv-content">
                 <div className="tv-media-container">
                    {project.previewVideo ? (
                        <video src={project.previewVideo} autoPlay loop muted playsInline className="tv-media" />
                    ) : project.previewImages ? (
                        <img src={project.previewImages[currentImageIndex]} alt={project.title} className="tv-media" />
                    ) : project.previewImage ? (
                        <img src={project.previewImage} alt={project.title} className="tv-media" />
                    ) : null}
                 </div>
              </div>
            ) : (
              <canvas ref={canvasRef} className="tv-static" />
            )}
            <div className="tv-overlay scanlines"></div>
            <div className="tv-overlay glow"></div>
            <div className="tv-overlay vignette"></div>
          </div>
        </div>
        <div className="tv-controls-panel">
           <div className="tv-brand">muhibtv</div>
           <div className="tv-knobs">
             <div className="tv-knob"></div>
             <div className="tv-knob"></div>
           </div>
           <div className="tv-speaker">
              <span></span><span></span><span></span><span></span>
           </div>
        </div>
      </div>
      <div className="tv-legs"></div>

      {/* External Details */}
      <div className={`tv-external-info ${project ? 'active' : ''}`}>
         {project ? (
            <div className="tv-info-content fade-in">
                <div className="tv-external-header">
                    <h3 className="tv-external-title">{project.title}</h3>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="tv-external-link">
                        <ArrowUpRight size={20} />
                    </a>
                </div>
                <p className="tv-external-description">{project.description}</p>
                <div className="tv-external-stack">
                    {project.stack.split(',').map((tech, i) => (
                        <span key={i} className="tv-tag">{tech.trim()}</span>
                    ))}
                </div>
            </div>
         ) : (
             <div className="tv-placeholder-text">Hover a project to view details</div>
         )}
      </div>
    </div>
  );
}
