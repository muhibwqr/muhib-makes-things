import { Link } from "react-router-dom";
import { Moon, Sun, ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import { projectsData } from "@/lib/projectsData";

export default function ProjectsPage() {
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

          <header className="ag mb-10">
            <h1 className="text-2xl sm:text-3xl font-medium leading-[1.2] mb-3">
              projects
            </h1>
            <p className="text-sm sm:text-base leading-[1.7] text-black/85 dark:text-white/85">
              things i've shipped, built, or broken along the way.
            </p>
          </header>

          <div className="ag space-y-10">
            {projectsData.map((p) => (
              <article
                key={p.id}
                className="border-b border-black/10 dark:border-white/10 pb-10 last:border-b-0 last:pb-0"
              >
                <Link
                  to={`/projects/${p.id}`}
                  className="block group"
                >
                  <div className="relative w-full aspect-video rounded-md overflow-hidden border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 mb-4">
                    {p.previewVideo ? (
                      <video
                        src={p.previewVideo}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        playsInline
                        autoPlay
                        preload="metadata"
                      />
                    ) : p.previewImage ? (
                      <img
                        src={p.previewImage}
                        alt={p.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-black/30 dark:text-white/30 text-xs italic">
                        no preview
                      </div>
                    )}
                  </div>
                  <div className="flex items-baseline justify-between gap-3 mb-1">
                    <h2 className="text-base sm:text-lg font-semibold group-hover:underline underline-offset-4">
                      {p.title}
                    </h2>
                    <span className="text-xs sm:text-sm opacity-50 inline-flex items-center gap-1">
                      read more
                      <ArrowUpRight size={11} />
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm italic opacity-60 mb-2">
                    {p.tagline}
                  </p>
                  <p className="text-sm sm:text-base text-black/85 dark:text-white/85 mb-2">
                    {p.description}
                  </p>
                  <p className="text-xs sm:text-sm opacity-60">{p.stack}</p>
                </Link>
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-xs sm:text-sm bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded px-2 py-1 transition-colors"
                  >
                    visit
                    <ArrowUpRight size={11} />
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
