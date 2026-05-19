import { Link } from "react-router-dom";
import { Moon, Sun, ArrowUpRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";

type MediaItem = {
  id: string;
  url: string;
  type: "image" | "video";
  label?: string;
};

const SLIDER_MEDIA: MediaItem[] = [
  { id: "1", url: "/slider/baba%20sippin%20in%20turkey.JPG", type: "image", label: "baba sippin in turkey" },
  { id: "2", url: "/slider/charity%20night%20auction.JPG", type: "image", label: "charity night auction" },
  { id: "3", url: "/slider/cursor%20cafe.JPG", type: "image", label: "cursor cafe" },
  { id: "4", url: "/slider/grand%20opening%20masjid%20darusalam.MOV", type: "video", label: "grand opening masjid darusalam" },
  { id: "5", url: "/slider/hosting%20the%20largest%20muslim%20hackathon%20in%20north%20america.JPG", type: "image", label: "hosting the largest muslim hackathon in north america" },
  { id: "6", url: "/slider/pakistan%20motives.JPG", type: "image", label: "pakistan motives" },
  { id: "7", url: "/slider/playing%20cards%20with%20claybird%20%28ycf25%29%20.JPG", type: "image", label: "playing cards with claybird (ycf25)" },
  { id: "8", url: "/slider/post%20fajr%20in%20pakistan.JPG", type: "image", label: "post fajr in pakistan" },
  { id: "9", url: "/slider/post%20fajr%20motive.JPG", type: "image", label: "lakeshore sunrise with the mandem" },
  { id: "10", url: "/slider/shipping%20with%20no%20internet%20on%20a%2014%20hour%20flight.MP4", type: "video", label: "shipping with no internet on a 14 hour flight" },
  { id: "11", url: "/slider/sneaking%20into%20alif%20office.JPG", type: "image", label: "sneaking into alif office" },
  { id: "12", url: "/slider/visiting%20serval%20office.JPG", type: "image", label: "visiting serval office" },
  { id: "13", url: "/slider/waterloo%20math%20in%20turket.JPG", type: "image", label: "waterloo math in turkey" },
];

type Person = {
  name: string;
  role: string;
  link: string;
  blurb: string;
};

const PEOPLE: Person[] = [
  {
    name: "thariq",
    role: "engineer at anthropic, sf",
    link: "https://www.thariq.io/",
    blurb:
      "scarborough mans working at anthropic in sf. muslim, works his butt off, super cool. definitely an inspiration in how he lets his curiosity guide him.",
  },
];

type Verse = {
  text: string;
  ref: string;
  commentary: string;
};

const VERSES: Verse[] = [
  {
    text: "god does not burden any soul with more than it can bear.",
    ref: "qur'an 2:286",
    commentary:
      "the burden of life may seem too much for us to handle sometimes, but remember that allah the merciful believes that we can get through it. he sees the potential in us and knows we can endure it with perseverance. if the lord of the worlds has faith in us, who are we as meek beings to deny our truest strength?",
  },
  {
    text: "do not lose heart or despair — if you are true believers you have the upper hand.",
    ref: "qur'an 3:139",
    commentary:
      "allah promises us that we will indeed be among the superior if we are patient with the trials and tribulations that befall upon us. part of being patient is accepting his divine decree, no matter how harsh the reality may seem. if you feel at a loss right now, do not grieve — you have already won a great victory of life.",
  },
  {
    text: "so truly where there is hardship there is also ease.",
    ref: "qur'an 94:5",
    commentary:
      "for those undergoing an overwhelming hardship, allah promises that every hardship will indeed be followed by ease. our hearts are built stronger after every heartbreak, more durable. time will heal, and this too shall pass, inshallah.",
  },
  {
    text: "my mercy encompasses all things.",
    ref: "qur'an 7:156",
    commentary:
      "when all hope seems lost, when injustice and evil prevail, remember this verse. allah is the most compassionate, the most merciful. he sees things we might not be able to see with our naked eyes and limited intellect. we might not know the hikmah behind all the things that happen to us, but whatever happens is the divine decree of the most merciful.",
  },
  {
    text: "and he will provide for him from where he does not expect. and whoever relies upon allah, then he is sufficient for him.",
    ref: "qur'an 65:3",
    commentary:
      "the significance of relying on allah alone. we should not cling onto human beings — not parents, children, spouses, or friends. nor should we attach ourselves to wealth and fame, because none of that compares to the feeling of contentment when you have allah and believe in his divine plans.",
  },
  {
    text: "indeed, i am near.",
    ref: "qur'an 2:186",
    commentary:
      "four words to reassure the lonely and troubled. you will never feel empty, nor will you ever feel alone when you have allah in your life. even when you have sinned, allah's mercy excels his wrath and he is always ready to forgive you if you seek forgiveness.",
  },
  {
    text: "he knows what is in every heart.",
    ref: "qur'an 67:13",
    commentary:
      "allah knows our intentions, thoughts, and concealed feelings. sometimes you might feel that nobody would understand the situation you are going through, and you keep it to yourself. remember, allah knows and he is always near you. you can always let it out to the creator of the worlds.",
  },
  {
    text: "he created the heavens and earth for a true purpose; he formed you and made your forms good: you will all return to him.",
    ref: "qur'an 64:3",
    commentary:
      "if you ever doubt yourself, thinking you are not enough — you have been created in the best of forms with utmost perfection. never undermine your potential, and always pave a path to discover capabilities you never knew you had.",
  },
  {
    text: "you who believe, seek help through steadfastness and prayer, for god is with the steadfast.",
    ref: "qur'an 2:153",
    commentary:
      "two important steps in order to seek help in whatever turbulence we encounter: patience and prayer. without these two essential solutions, we will be overwhelmed by negative emotions. next time you feel lost, vulnerable, stressed, or depressed, try this and see the difference it makes.",
  },
  {
    text: "do you suppose that you will enter the garden without first having suffered like those before you? ... truly, god's help is near.",
    ref: "qur'an 2:214",
    commentary:
      "every individual, especially the prophets (peace be upon them), have been afflicted with trials so dire that we desperately need the help of allah. tests will surely occur in our lives — but allah ends the verse with a reassurance, that he will always be near us.",
  },
];

type Hadith = {
  text: string;
  arabic?: string;
  ref: string;
  grade?: string;
};

const HADITHS: Hadith[] = [
  {
    text: "were the son of adam to flee from his provision as he flees from death, his provision would surely reach him just as death will reach him.",
    ref: "ḥilyat al-awliyā' 7/90, narrated by jabir",
  },
  {
    text: "if you were to rely upon allah with the reliance he is due, you would be given provision like the birds: they go out hungry in the morning and come back with full bellies in the evening.",
    arabic:
      "لَوْ أَنَّكُمْ تَوَكَّلْتُمْ عَلَى اللَّهِ حَقَّ تَوَكُّلِهِ لَرَزَقَكُمْ كَمَا يَرْزُقُ الطَّيْرَ تَغْدُو خِمَاصًا وَتَرُوحُ بِطَانًا",
    ref: "sunan ibn majah 4164, narrated by 'umar",
    grade: "hasan (darussalam)",
  },
];

export default function InspirationsPage() {
  const [isDark, setIsDark] = useState(false);
  const [sliderDragging, setSliderDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ x: number; scrollLeft: number } | null>(null);
  const isDragging = useRef(false);

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

  useEffect(() => {
    const container = sliderRef.current;
    if (!container) return;
    const speed = 0.4;
    let rafId: number;
    const tick = () => {
      if (isDragging.current) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      container.scrollLeft += speed;
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (maxScroll > 0 && container.scrollLeft >= maxScroll) container.scrollLeft = 0;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    const onMove = (clientX: number) => {
      if (!isDragging.current || !dragStart.current || !sliderRef.current) return;
      const dx = dragStart.current.x - clientX;
      sliderRef.current.scrollLeft = dragStart.current.scrollLeft + dx;
    };
    const onMouseMove = (e: MouseEvent) => onMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) onMove(t.clientX);
    };
    const onEnd = () => {
      isDragging.current = false;
      dragStart.current = null;
      setSliderDragging(false);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    if ((e.target as HTMLElement).closest("a, button")) return;
    e.preventDefault();
    isDragging.current = true;
    dragStart.current = { x: e.clientX, scrollLeft: sliderRef.current.scrollLeft };
    setSliderDragging(true);
  };
  const onTouchStart = (e: React.TouchEvent) => {
    if (!sliderRef.current) return;
    const t = e.touches[0];
    if (t) {
      isDragging.current = true;
      dragStart.current = { x: t.clientX, scrollLeft: sliderRef.current.scrollLeft };
      setSliderDragging(true);
    }
  };
  const onWheel = (e: React.WheelEvent) => {
    const container = sliderRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    const canScrollLeft = scrollLeft > 0;
    const canScrollRight = scrollLeft < scrollWidth - clientWidth - 1;
    if ((e.deltaY > 0 && canScrollRight) || (e.deltaY < 0 && canScrollLeft)) {
      e.preventDefault();
      container.scrollLeft += e.deltaY;
    }
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
        .arabic {
          font-family: 'SBL Bibilit', 'Amiri', 'Scheherazade New', 'Noto Naskh Arabic', serif;
          line-height: 2;
        }
      `}</style>

      <main className="min-h-screen flex items-start justify-center px-6 pt-16 pb-24">
        <div className="w-full max-w-[760px]">
          <nav className="flex items-center justify-center gap-8 sm:gap-10 mb-16 text-sm sm:text-base ag">
            <Link
              to="/"
              className="text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white underline-offset-4 hover:underline"
            >
              home
            </Link>
            <Link
              to="/inspirations"
              className="text-black dark:text-white underline underline-offset-4"
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
              onClick={toggleTheme}
              className="inline-flex items-center justify-center w-7 h-7 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-black/70 dark:text-white/70 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </nav>

          {/* Intro */}
          <header className="ag mb-12">
            <div className="flex items-baseline gap-3 flex-wrap mb-3">
              <h1 className="text-2xl sm:text-3xl font-medium leading-[1.2]">
                inspirations
              </h1>
              <span className="italic opacity-50 text-xs sm:text-sm">
                (updating every other day slowly)
              </span>
            </div>
            <p className="text-sm sm:text-base leading-[1.7] text-black/85 dark:text-white/85">
              i am inspired by all of allah's{" "}
              <span className="italic opacity-70">(god's)</span> creation.
              recently i've been inspired by:
            </p>
          </header>

          {/* People */}
          <details className="ag mb-6 group border-b border-black/10 dark:border-white/10 pb-6">
            <summary className="cursor-pointer list-none flex items-center justify-between py-2 mb-4 select-none">
              <h2 className="text-xs sm:text-sm uppercase tracking-[0.18em] opacity-60 group-hover:opacity-100 transition">
                people
              </h2>
              <span className="text-xs opacity-50 group-open:rotate-90 transition-transform">›</span>
            </summary>
            <div className="space-y-6">
              {PEOPLE.map((p) => (
                <article key={p.name} className="leading-[1.7]">
                  <div className="flex items-baseline gap-2 mb-1">
                    <h3 className="text-base sm:text-lg font-semibold">{p.name}</h3>
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs sm:text-sm bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded px-1.5 py-0.5 transition-colors"
                    >
                      thariq.io
                      <ArrowUpRight size={11} />
                    </a>
                  </div>
                  <p className="text-xs sm:text-sm italic opacity-60 mb-2">
                    {p.role}
                  </p>
                  <p className="text-sm sm:text-base text-black/85 dark:text-white/85">
                    {p.blurb}
                  </p>
                </article>
              ))}
            </div>
          </details>

          {/* Scenes from my life */}
          <details className="ag mb-6 group border-b border-black/10 dark:border-white/10 pb-6">
            <summary className="cursor-pointer list-none flex items-center justify-between py-2 mb-4 select-none">
              <h2 className="text-xs sm:text-sm uppercase tracking-[0.18em] opacity-60 group-hover:opacity-100 transition">
                scenes from my life
              </h2>
              <span className="text-xs opacity-50 group-open:rotate-90 transition-transform">›</span>
            </summary>
            <div className="relative overflow-hidden">
              <div
                ref={sliderRef}
                className={`flex flex-row overflow-x-auto overflow-y-hidden gap-4 sm:gap-5 py-2 -mx-1 px-1 w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden select-none touch-pan-x overscroll-contain ${
                  sliderDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
                style={{ contain: "layout paint", overscrollBehavior: "contain" }}
                onMouseDown={onMouseDown}
                onTouchStart={onTouchStart}
                onWheel={onWheel}
              >
                {SLIDER_MEDIA.map((item) => (
                  <div
                    key={item.id}
                    className="flex-shrink-0 w-40 sm:w-48 flex flex-col gap-2"
                  >
                    <div className="w-full aspect-[4/5] flex items-center justify-center overflow-hidden rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
                      {item.type === "video" ? (
                        <video
                          src={item.url}
                          className="w-full h-full object-cover pointer-events-none"
                          muted
                          loop
                          playsInline
                          autoPlay
                          preload="auto"
                        />
                      ) : (
                        <img
                          className="w-full h-full object-cover pointer-events-none"
                          alt={item.label || ""}
                          src={item.url}
                          loading="lazy"
                          decoding="async"
                          draggable={false}
                        />
                      )}
                    </div>
                    <p className="text-xs text-black/60 dark:text-white/60 text-center italic px-1 truncate">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white dark:from-[#0f0f10] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white dark:from-[#0f0f10] to-transparent" />
            </div>
            <p className="mt-3 text-xs text-black/40 dark:text-white/40 italic">
              drag, scroll, or hover to explore
            </p>
          </details>

          {/* Quran verses */}
          <details className="ag mb-6 group border-b border-black/10 dark:border-white/10 pb-6">
            <summary className="cursor-pointer list-none flex items-center justify-between py-2 mb-4 select-none">
              <h2 className="text-xs sm:text-sm uppercase tracking-[0.18em] opacity-60 group-hover:opacity-100 transition">
                words from the qur'an
              </h2>
              <span className="text-xs opacity-50 group-open:rotate-90 transition-transform">›</span>
            </summary>
            <ol className="space-y-10 pt-2">
              {VERSES.map((v, i) => (
                <li key={i} className="leading-[1.7]">
                  <div className="flex items-start gap-3">
                    <span className="text-xs sm:text-sm opacity-40 pt-1 tabular-nums w-6 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <blockquote className="text-base sm:text-lg italic leading-[1.5] border-l-2 border-black/15 dark:border-white/15 pl-4 mb-2 text-black/90 dark:text-white/90">
                        "{v.text}"
                      </blockquote>
                      <p className="text-xs sm:text-sm opacity-50 mb-3 pl-4 not-italic">
                        — {v.ref}
                      </p>
                      <p className="text-sm sm:text-[0.95rem] text-black/75 dark:text-white/75 pl-4">
                        {v.commentary}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </details>

          {/* Hadith */}
          <details className="ag mb-6 group border-b border-black/10 dark:border-white/10 pb-6">
            <summary className="cursor-pointer list-none flex items-center justify-between py-2 mb-4 select-none">
              <h2 className="text-xs sm:text-sm uppercase tracking-[0.18em] opacity-60 group-hover:opacity-100 transition">
                words from the prophet ﷺ
              </h2>
              <span className="text-xs opacity-50 group-open:rotate-90 transition-transform">›</span>
            </summary>
            <div className="space-y-10 pt-2">
              {HADITHS.map((h, i) => (
                <article key={i} className="leading-[1.7]">
                  <div className="flex items-start gap-3">
                    <span className="text-xs sm:text-sm opacity-40 pt-1 tabular-nums w-6 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <blockquote className="text-base sm:text-lg italic leading-[1.5] border-l-2 border-black/15 dark:border-white/15 pl-4 mb-3 text-black/90 dark:text-white/90">
                        "{h.text}"
                      </blockquote>
                      {h.arabic && (
                        <p
                          dir="rtl"
                          className="arabic text-lg sm:text-xl text-right pl-4 mb-3 text-black/85 dark:text-white/85"
                        >
                          {h.arabic}
                        </p>
                      )}
                      <p className="text-xs sm:text-sm opacity-50 pl-4 not-italic">
                        — {h.ref}
                        {h.grade && (
                          <span className="ml-2 italic">grade: {h.grade}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </details>
        </div>
      </main>
    </div>
  );
}
