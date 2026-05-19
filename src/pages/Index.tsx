import { Github, Linkedin, Mail, Twitter, Moon, Sun, RotateCcw, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { VideoAscii } from "react-video-ascii";
import { useState, useEffect, useRef } from "react";

const Index = () => {
  const [isDark, setIsDark] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [videoIdx, setVideoIdx] = useState(0);
  const [writingTeasing, setWritingTeasing] = useState(false);
  const [nameDetached, setNameDetached] = useState(false);
  const [namePos, setNamePos] = useState({ x: 0, y: 0 });
  const nameDragging = useRef(false);
  const nameOffset = useRef({ x: 0, y: 0 });

  const onNamePointerDown = (e: React.PointerEvent<HTMLSpanElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    nameOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    nameDragging.current = true;
    if (!nameDetached) {
      setNameDetached(true);
      setNamePos({ x: rect.left, y: rect.top });
    }
    el.setPointerCapture(e.pointerId);
  };
  const onNamePointerMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (!nameDragging.current) return;
    setNamePos({
      x: e.clientX - nameOffset.current.x,
      y: e.clientY - nameOffset.current.y,
    });
  };
  const onNamePointerUp = (e: React.PointerEvent<HTMLSpanElement>) => {
    nameDragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };
  const resetName = () => {
    setNameDetached(false);
    setNamePos({ x: 0, y: 0 });
  };

  const [videos] = useState<string[]>(() => {
    const base = ["/landing-bg-5.mp4", "/landing-bg-3.mp4", "/landing-bg-4.mp4"];
    for (let i = base.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [base[i], base[j]] = [base[j], base[i]];
    }
    return base;
  });
  const EMAIL = "notesfrommuhib@gmail.com";

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = EMAIL;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 1600);
  };

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
    } else if (!root.classList.contains("dark") && !root.classList.contains("light")) {
      root.classList.add("light");
      body.classList.add("light");
      setIsDark(false);
    } else {
      const isDarkMode = root.classList.contains("dark");
      setIsDark(isDarkMode);
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

  const socials = [
    { icon: <Mail size={14} />, label: 'email', href: 'mailto:notesfrommuhib@gmail.com' },
    { icon: <Linkedin size={14} />, label: 'linkedin', href: 'https://linkedin.com/in/muhibwaqar' },
    { icon: <Github size={14} />, label: 'github', href: 'https://github.com/muhibwqr' },
    { icon: <Twitter size={14} />, label: 'twitter', href: 'https://x.com/muhibwqr' },
  ];

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

      <main className="min-h-screen flex items-start justify-center px-6 pt-16 pb-16">
        <div className="w-full max-w-[720px]">
          {/* Top nav above video */}
          <nav className="flex items-center justify-center gap-8 sm:gap-10 mb-4 text-sm sm:text-base ag relative">
            <Link
              to="/inspirations"
              className="text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white underline-offset-4 hover:underline"
            >
              inspirations
            </Link>
            <Link
              to="/projects"
              className="text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white underline-offset-4 hover:underline"
            >
              work
            </Link>
            <button
              type="button"
              onClick={() => {
                setWritingTeasing(true);
                setTimeout(() => setWritingTeasing(false), 1400);
              }}
              className={`inline-flex items-center gap-1 text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white underline-offset-4 hover:underline ${writingTeasing ? "animate-shake" : ""}`}
            >
              {writingTeasing ? (
                <>
                  <Lock size={12} />
                  coming soon
                </>
              ) : (
                "writing"
              )}
            </button>

            {/* Contact w/ dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setContactOpen(true)}
              onMouseLeave={() => setContactOpen(false)}
            >
              <a
                href="mailto:notesfrommuhib@gmail.com"
                className="text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white underline-offset-4 hover:underline"
              >
                contact
              </a>
              {contactOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50">
                  <div className="flex flex-col bg-white dark:bg-[#1a1a1c] border border-black/10 dark:border-white/10 rounded-md shadow-lg py-1 min-w-[140px]">
                    {socials.map((s) =>
                      s.label === 'email' ? (
                        <button
                          key={s.label}
                          type="button"
                          onClick={copyEmail}
                          className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm text-black/80 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/5 text-left w-full"
                        >
                          {s.icon}
                          <span className="whitespace-nowrap">
                            {emailCopied ? 'copied!' : 'email'}
                          </span>
                        </button>
                      ) : (
                        <a
                          key={s.label}
                          href={s.href}
                          target={s.href.startsWith('http') ? '_blank' : undefined}
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm text-black/80 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/5"
                        >
                          {s.icon}
                          <span>{s.label}</span>
                        </a>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={toggleTheme}
              className="inline-flex items-center justify-center w-7 h-7 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-black/70 dark:text-white/70 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </nav>

          {/* ASCII art centerpiece, capped 40vh */}
          <div className="relative mb-6">
            <div className="rounded-md overflow-hidden border border-black/10 dark:border-white/10 bg-black shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
              <div className="relative w-full max-h-[40vh]" style={{ aspectRatio: '16 / 9' }}>
                <VideoAscii
                  key={videos[videoIdx]}
                  src={videos[videoIdx]}
                  numColsRaw={220}
                  brightnessRaw={1.1}
                  saturationRaw={0.9}
                  bgOpacityRaw={0.0}
                  charMode="luminance"
                  mouseEffect={{ style: 'brighten', radius: 0.08, brightness: 1.8 }}
                  className="absolute inset-0"
                />
              </div>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 -right-3 sm:-right-8 flex flex-col gap-1.5">
              {videos.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setVideoIdx(i)}
                  aria-label={`Show video ${i + 1}`}
                  className={`ag text-xs sm:text-sm w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    videoIdx === i
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <h1 className="ag text-base sm:text-lg font-medium leading-[1.4] mb-4 text-black dark:text-white whitespace-nowrap overflow-hidden">
            <span className="font-medium">assalamualaikum</span>{" "}
            <span className="italic opacity-60">
              [may peace be upon you]
            </span>
            {", my name is "}
            {nameDetached ? (
              <button
                type="button"
                onClick={resetName}
                aria-label="Reset name"
                className="inline-flex items-center justify-center w-5 h-5 align-middle rounded-full text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition"
              >
                <RotateCcw size={12} />
              </button>
            ) : (
              <span
                onPointerDown={onNamePointerDown}
                onPointerMove={onNamePointerMove}
                onPointerUp={onNamePointerUp}
                className="font-semibold whitespace-nowrap cursor-grab active:cursor-grabbing select-none"
              >
                muhib waqar
              </span>
            )}
            .
          </h1>


          {/* Body */}
          <div className="ag text-black dark:text-white">
            <p className="text-[0.95rem] sm:text-base leading-[1.7] text-justify hyphens-none [word-spacing:-0.05em]">
              {"i am a 19-year-old computational mathematics and business student at the "}
              <a
                href="https://uwaterloo.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-sm transition-colors [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
              >
                university of waterloo
              </a>
              {", attempting to become the best engineer/researcher i can, though my education really began when i did my first internship at 11 years old. alhamdulillah "}
              <span className="italic opacity-70">[all praise to allah]</span>
              {", i've since run a relentless cycle of businesses across sneaker reselling, clothing brands, ecom, cybersecurity, animation, video editing, real estate, and so much more, turning my multi-passionate drive into a sacred mission to bring high-agency, beautiful things into this world, inshallah "}
              <span className="italic opacity-70">[if allah wills]</span>
              {". from working as a founding engineer at a stealth startup to my current role as an ai software engineer on the product team at "}
              <a
                href="https://zown.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-sm transition-colors [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
              >
                zown
              </a>
              {", i optimize for speed, scale, and excellence, whether holding certifications like aws ccp and cisco ccst, shipping "}
              <a
                href="https://goosetype.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-sm transition-colors [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
              >
                goosetype.com
              </a>
              {" to 5,000 users in a week, or hosting north america's largest muslim ethics-based hackathon for over 300 builders. if you're looking for me, you might find me training, traveling between cafes from toronto to san francisco, or sharing my journey online, while i pour my energy into building "}
              <a
                href="https://pillarsnetwork.org"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-sm transition-colors [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
              >
                pillars network
              </a>
              {" to cultivate benevolence and help the next generation become true foundations of society. everything i do is driven by a desire to push boundaries, a deep love for his creation, and an absolute devotion to the creator. knowing that every milestone is entirely by his guidance, my ultimate ambition is to utilize every ounce of my agency to bring beautiful things into this world, serve his creation, and please the one who built it all."}
            </p>
          </div>
        </div>
      </main>

      {nameDetached && (
        <span
          onPointerDown={onNamePointerDown}
          onPointerMove={onNamePointerMove}
          onPointerUp={onNamePointerUp}
          style={{ left: namePos.x, top: namePos.y }}
          className="ag fixed z-50 font-semibold text-sm sm:text-base cursor-grab active:cursor-grabbing select-none text-black dark:text-white"
        >
          muhib waqar
        </span>
      )}
    </div>
  );
};

export default Index;
