import { Link, useParams } from "react-router-dom";
import { Moon, Sun, ArrowLeft, ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import { projectsData } from "@/lib/projectsData";

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const project = projectsData.find((p) => p.id === projectId);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;
    if (body.classList.contains("light")) {
      root.classList.remove("dark");
      root.classList.add("light");
      setIsDark(false);
    } else if (body.classList.contains("dark")) {
      root.classList.remove("light");
      root.classList.add("dark");
      setIsDark(true);
    } else {
      setIsDark(root.classList.contains("dark"));
    }
  }, []);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    const body = window.document.body;
    const prev = isDark ? "dark" : "light";
    const next = isDark ? "light" : "dark";
    root.classList.remove(prev);
    root.classList.add(next);
    body.classList.remove(prev);
    body.classList.add(next);
    setIsDark(!isDark);
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black dark:bg-[#0f0f10] dark:text-white">
        <div className="ag text-center">
          <p className="text-lg mb-3">project not found.</p>
          <Link to="/projects" className="underline underline-offset-4">
            back to projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black dark:bg-[#0f0f10] dark:text-white">
      <style>{`
        @font-face {
          font-family: 'Apple Garamond';
          src: local('Apple Garamond'), local('AppleGaramond'), local('Apple-Garamond');
        }
        .ag {
          font-family: 'Apple Garamond', 'EB Garamond', 'Cormorant Garamond', Garamond, 'Times New Roman', serif;
          font-feature-settings: "liga", "kern";
        }
      `}</style>

      <main className="min-h-screen flex items-start justify-center px-6 pt-16 pb-24">
        <div className="w-full max-w-[760px]">
          <nav className="flex items-center justify-center gap-8 sm:gap-10 mb-12 text-sm sm:text-base ag">
            <Link
              to="/"
              className="text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white underline-offset-4 hover:underline"
            >
              home
            </Link>
            <Link
              to="/inspirations"
              className="text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white underline-offset-4 hover:underline"
            >
              inspirations
            </Link>
            <Link
              to="/projects"
              className="text-black dark:text-white underline underline-offset-4"
            >
              projects
            </Link>
            <button
              onClick={toggleTheme}
              className="inline-flex items-center justify-center w-7 h-7 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-black/70 dark:text-white/70 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </nav>

          <Link
            to="/projects"
            className="ag inline-flex items-center gap-1.5 text-xs sm:text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={12} />
            all projects
          </Link>

          <header className="ag mb-8">
            <h1 className="text-2xl sm:text-3xl font-medium leading-[1.2] mb-2">
              {project.title}
            </h1>
            <p className="text-sm sm:text-base italic opacity-60 mb-4">
              {project.tagline}
            </p>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs sm:text-sm bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded px-2 py-1 transition-colors"
              >
                visit
                <ArrowUpRight size={11} />
              </a>
            )}
          </header>

          {(project.previewVideo || project.previewImage) && (
            <div className="relative w-full aspect-video rounded-md overflow-hidden border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 mb-8">
              {project.previewVideo ? (
                <video
                  src={project.previewVideo}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                  controls
                />
              ) : (
                <img
                  src={project.previewImage}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
            </div>
          )}

          {project.previewImages && project.previewImages.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {project.previewImages.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${project.title} preview ${i + 1}`}
                  className="w-full rounded-md border border-black/10 dark:border-white/10 object-cover"
                  loading="lazy"
                />
              ))}
            </div>
          )}

          <section className="ag mb-10">
            {project.longDescription.split("\n\n").map((para, i) => (
              <p
                key={i}
                className="text-sm sm:text-base leading-[1.8] text-black/85 dark:text-white/85 mb-4 last:mb-0"
              >
                {para}
              </p>
            ))}
          </section>

          <section className="ag mb-8">
            <h2 className="text-xs sm:text-sm uppercase tracking-[0.18em] opacity-60 mb-3">
              stack
            </h2>
            <p className="text-sm sm:text-base text-black/85 dark:text-white/85">
              {project.stack}
            </p>
          </section>

          {project.highlights && project.highlights.length > 0 && (
            <section className="ag mb-8">
              <h2 className="text-xs sm:text-sm uppercase tracking-[0.18em] opacity-60 mb-3">
                highlights
              </h2>
              <ul className="text-sm sm:text-base leading-[1.8] text-black/85 dark:text-white/85 space-y-1.5">
                {project.highlights.map((h, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="opacity-40 shrink-0">—</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {project.challenges && project.challenges.length > 0 && (
            <section className="ag mb-8">
              <h2 className="text-xs sm:text-sm uppercase tracking-[0.18em] opacity-60 mb-3">
                challenges
              </h2>
              <ul className="text-sm sm:text-base leading-[1.8] text-black/85 dark:text-white/85 space-y-1.5">
                {project.challenges.map((c, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="opacity-40 shrink-0">—</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {project.results && project.results.length > 0 && (
            <section className="ag mb-10">
              <h2 className="text-xs sm:text-sm uppercase tracking-[0.18em] opacity-60 mb-3">
                results
              </h2>
              <ul className="text-sm sm:text-base leading-[1.8] text-black/85 dark:text-white/85 space-y-1.5">
                {project.results.map((r, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="opacity-40 shrink-0">—</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
