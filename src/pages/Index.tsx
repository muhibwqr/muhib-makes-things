import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Dock from "@/components/Dock";
import { useDockItems } from "@/lib/dockItems";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
// Highlight span component
const HighlightSpan = ({ color }: { color: string }) => (
  <span className={`absolute inset-0 ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out -z-10`} />
);

function sliderItemLabel(url: string): string {
  const name = url.split("/").pop() || "";
  const decoded = decodeURIComponent(name);
  const lastDot = decoded.lastIndexOf(".");
  return lastDot > 0 ? decoded.slice(0, lastDot) : decoded;
}

const Index = () => {
  const dockItems = useDockItems();
  const [isMobile, setIsMobile] = useState(false);
  const [sliderDragging, setSliderDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; scrollLeft: number } | null>(null);
  const isDraggingRef = useRef(false);
  const [nameVariantIndex, setNameVariantIndex] = useState(0);
  const nameCycleRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nameVariants = [
    "muhib waqar",           // Latin
    "وقار محب",              // Urdu (waqar muhib)
    "Love · Dignity",        // English meaning
  ];

  useEffect(() => () => {
    if (nameCycleRef.current) clearInterval(nameCycleRef.current);
  }, []);

  // Only media from public/slider (from Downloads/slider folder – copy files there into public/slider)
  const sliderMedia = [
    { id: "1", url: "/slider/baba%20sippin%20in%20turkey.JPG", type: "image" as const },
    { id: "2", url: "/slider/charity%20night%20auction.JPG", type: "image" as const },
    { id: "3", url: "/slider/cursor%20cafe.JPG", type: "image" as const },
    { id: "4", url: "/slider/grand%20opening%20masjid%20darusalam.MOV", type: "video" as const },
    { id: "5", url: "/slider/hosting%20the%20largest%20muslim%20hackathon%20in%20north%20america.JPG", type: "image" as const },
    { id: "6", url: "/slider/pakistan%20motives.JPG", type: "image" as const },
    { id: "7", url: "/slider/playing%20cards%20with%20claybird%20%28ycf25%29%20.JPG", type: "image" as const },
    { id: "8", url: "/slider/post%20fajr%20in%20pakistan.JPG", type: "image" as const },
    { id: "9", url: "/slider/post%20fajr%20motive.JPG", type: "image" as const, label: "lakeshore sunrise with the mandem" },
    { id: "10", url: "/slider/shipping%20with%20no%20internet%20on%20a%2014%20hour%20flight.MP4", type: "video" as const },
    { id: "11", url: "/slider/sneaking%20into%20alif%20office.JPG", type: "image" as const },
    { id: "13", url: "/slider/visiting%20serval%20office.JPG", type: "image" as const },
    { id: "14", url: "/slider/waterloo%20math%20in%20turket.JPG", type: "image" as const },
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Webring embed: only on home page – fixed bottom-left, remove on unmount
  useEffect(() => {
    const script = document.createElement("script");
    script.id = "webring-embed-script";
    script.src = "https://uwaterloo.network/embed.js";
    script.setAttribute("data-webring", "");
    script.setAttribute("data-user", "muhib-waqar");
    script.async = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
      const widget =
        document.getElementById("webring") ??
        document.querySelector("body > [data-webring]") ??
        document.querySelector("[id*='webring']") ??
        document.querySelector("[class*='webring']");
      if (widget && widget.id !== "webring-embed-script") {
        widget.remove();
      }
    };
  }, []);

  // Auto-scroll slider horizontally (paused while dragging)
  useEffect(() => {
    const container = sliderRef.current;
    if (!container) return;
    const speed = 0.4;
    let rafId: number;
    const tick = () => {
      if (isDraggingRef.current) {
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
  }, [sliderMedia.length]);

  // Wheel scroll for scenes horizontal slider
  const onScenesWheel = (e: React.WheelEvent) => {
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

  // Drag-to-scroll handlers for horizontal slider
  const onSliderMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    if ((e.target as HTMLElement).closest("a, button")) return;
    e.preventDefault();
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, scrollLeft: sliderRef.current.scrollLeft };
    setSliderDragging(true);
  };
  const onSliderTouchStart = (e: React.TouchEvent) => {
    if (!sliderRef.current) return;
    const t = e.touches[0];
    if (t) {
      isDraggingRef.current = true;
      dragStartRef.current = { x: t.clientX, scrollLeft: sliderRef.current.scrollLeft };
      setSliderDragging(true);
    }
  };
  useEffect(() => {
    const container = sliderRef.current;
    if (!container) return;
    const onMove = (clientX: number) => {
      if (!isDraggingRef.current || !dragStartRef.current) return;
      const dx = dragStartRef.current.x - clientX;
      container.scrollLeft = dragStartRef.current.scrollLeft + dx;
    };
    const onMouseMove = (e: MouseEvent) => onMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) onMove(t.clientX);
    };
    const onEnd = () => {
      isDraggingRef.current = false;
      dragStartRef.current = null;
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

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col bg-[#f2f2f2] dark:bg-[#262626] relative text-black dark:text-white">
      {/* Content wrapper: flex column so Dock + scroll area share viewport */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col">
        {/* Dock — vertical on left for desktop, horizontal at bottom on mobile */}
        <Dock 
          items={dockItems}
          panelHeight={isMobile ? 56 : 68}
          baseItemSize={isMobile ? 42 : 50}
          magnification={70}
          vertical={!isMobile}
        />
        
        {/* Scrollable main content */}
        <div className="flex-1 min-h-0 overflow-y-auto">
        <div
          className="relative z-10 max-w-2xl lg:max-w-6xl mx-auto px-3 sm:px-6 pb-24 sm:pb-0"
        >
          {/* Header - Minimal (responsive), centered block */}
          <header className="py-6 sm:py-12 flex justify-center">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 w-full max-w-xl">
              <Avatar className="w-14 h-14 sm:w-20 sm:h-20 rounded-none border border-black/20 dark:border-white/20 flex-shrink-0">
                <AvatarImage src="/profile.jpeg" alt="Muhib Waqar" className="rounded-none" />
                <AvatarFallback className="bg-gray-200 text-black dark:bg-gray-800 dark:text-white rounded-none">
                  MW
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div
                  className="flex items-baseline gap-1.5 mb-1"
                  onMouseEnter={() => {
                    nameCycleRef.current = setInterval(() => {
                      setNameVariantIndex((i) => (i + 1) % nameVariants.length);
                    }, 180);
                  }}
                  onMouseLeave={() => {
                    if (nameCycleRef.current) {
                      clearInterval(nameCycleRef.current);
                      nameCycleRef.current = null;
                    }
                    setNameVariantIndex(0);
                  }}
                >
                  <h1 className="hero-title text-black dark:text-white cursor-default transition-opacity duration-75">
                    {nameVariants[nameVariantIndex]}
                  </h1>
                  <span className="text-[9px] text-gray-400 dark:text-gray-500 whitespace-nowrap">hover here ←</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  math & business @ uwaterloo • swe • security • product management
                </p>
              </div>
            </div>
          </header>

          {/* Main Content - single column: body, writing, scenes */}
          <main className="pt-0 pb-8 sm:pb-12 min-h-[60vh]">
            <div className="flex flex-col">
              <section className="animate-fade-in-column animate-fade-in-column-delay-100 flex-1 min-w-0 -mt-2 flex flex-col items-center">
                <div className="space-y-2 leading-[1.6] w-full max-w-xl">
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-gray-400 dark:text-gray-500">↳</span>
                    <div className="flex flex-wrap items-center gap-1">
                      <a 
                        href="https://uwaterloo.ca"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 relative group cursor-pointer"
                      >
                        <span className="text-black dark:text-white font-medium">math/ business administration at</span>
                        <img 
                          src="/waterloo.webp" 
                          alt="University of Waterloo" 
                          className="h-4 w-auto object-contain flex-shrink-0"
                        />
                        <span className="text-black dark:text-white font-medium">university of waterloo</span>
                        <HighlightSpan color="bg-yellow-300/40 dark:bg-yellow-400/30" />
                      </a>
                      <span className="text-gray-500 dark:text-gray-400"> → studying to <span className="font-semibold text-gray-600 dark:text-gray-300">bridge</span> technical and mathematical depth with <span className="font-semibold text-gray-600 dark:text-gray-300">business impact</span>.</span>
                </div>
                </div>
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-gray-400 dark:text-gray-500">↳</span>
                    <div>
                      <span className="text-black dark:text-white font-medium">shipped </span>
                      <a
                        href="https://goosetype.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex relative group cursor-pointer font-medium"
                      >
                        <span className="text-black dark:text-white font-semibold">goosetype.com</span>
                        <HighlightSpan color="bg-amber-300/40 dark:bg-amber-400/30" />
                      </a>
                      <span className="text-black dark:text-white font-medium">, <span className="font-semibold">5000+</span> users in <span className="font-semibold">one week</span></span>
                      <span className="text-gray-500 dark:text-gray-400"> → typing arena, rebranded after Waterloo flagged the original; <span className="font-semibold text-gray-600 dark:text-gray-300">rebuilt and scaled fast</span>.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-gray-400 dark:text-gray-500">↳</span>
                    <div>
                      <span className="text-black dark:text-white font-medium">hosted the <span className="font-semibold">biggest</span> muslim ethics–based hackathon in <span className="font-semibold">north america</span></span>
                      <span className="text-gray-500 dark:text-gray-400"> → <span className="font-semibold text-gray-600 dark:text-gray-300">300+</span> people, sponsored by <span className="font-semibold text-gray-600 dark:text-gray-300">YC-backed</span> startups, <span className="font-semibold text-gray-600 dark:text-gray-300">Shopify</span>, & <span className="font-semibold text-gray-600 dark:text-gray-300">a16z</span> scout.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-gray-400 dark:text-gray-500">↳</span>
                    <div className="flex flex-wrap items-center gap-1">
                      <span className="text-black dark:text-white font-medium">certified & <span className="font-semibold">experienced</span></span>
                      <span className="text-gray-500 dark:text-gray-400"> → </span>
                      <a 
                        href="https://aws.amazon.com/certification/certified-cloud-practitioner/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 relative group cursor-pointer"
                      >
                        <img 
                          src="/aws.png" 
                          alt="AWS" 
                          className="h-4 w-auto object-contain flex-shrink-0"
                        />
                        <span className="text-gray-500 dark:text-gray-400">aws ccp</span>
                        <HighlightSpan color="bg-orange-300/40 dark:bg-orange-400/30" />
                      </a>
                      <span className="text-gray-500 dark:text-gray-400">,</span>
                      <a 
                        href="https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 relative group cursor-pointer"
                      >
                        <img 
                          src="/azure.png" 
                          alt="Azure" 
                          className="h-4 w-auto object-contain flex-shrink-0"
                        />
                        <span className="text-gray-500 dark:text-gray-400">az-900</span>
                        <HighlightSpan color="bg-blue-300/40 dark:bg-blue-400/30" />
                      </a>
                      <span className="text-gray-500 dark:text-gray-400">,</span>
                      <a 
                        href="https://www.cisco.com/c/en/us/training-events/training/certifications/associate/ccna.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 relative group cursor-pointer"
                      >
                        <img 
                          src="/cisco.jpeg" 
                          alt="Cisco" 
                          className="h-4 w-auto object-contain flex-shrink-0"
                        />
                        <span className="text-gray-500 dark:text-gray-400">ccna1</span>
                        <HighlightSpan color="bg-green-300/40 dark:bg-green-400/30" />
                      </a>
                      <span className="text-gray-500 dark:text-gray-400">,</span>
                      <a 
                        href="https://www.cisco.com/c/en/us/training-events/training/certifications/entry/ccst.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 relative group cursor-pointer"
                      >
                        <img 
                          src="/cisco.jpeg" 
                          alt="Cisco" 
                          className="h-4 w-auto object-contain flex-shrink-0"
                        />
                        <span className="text-gray-500 dark:text-gray-400">ccst</span>
                        <HighlightSpan color="bg-purple-300/40 dark:bg-purple-400/30" />
                      </a>
                      <span className="text-gray-500 dark:text-gray-400">+ more.</span>
                      <a 
                        href="#"
                        className="inline-flex items-center gap-1 cursor-pointer relative group font-medium"
                        onClick={(e) => e.preventDefault()}
                      >
                        <span className="text-gray-500 dark:text-gray-400"><span className="font-semibold text-gray-600 dark:text-gray-300">founding</span> backend engineer @</span>
                        <img 
                          src="/stealthstartup.png" 
                          alt="Stealth Startup" 
                          className="h-4 w-auto object-contain flex-shrink-0"
                        />
                        <HighlightSpan color="bg-pink-300/40 dark:bg-pink-400/30" />
                      </a>
                      <span className="text-gray-500 dark:text-gray-400">,</span>
                      <a 
                        href="https://thebfl.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 relative group cursor-pointer"
                      >
                        <span className="text-gray-500 dark:text-gray-400">swe & cyber intern @</span>
                        <img 
                          src="/bfl.jpg" 
                          alt="Blackstone Foundation Library" 
                          className="h-4 w-auto object-contain flex-shrink-0"
                        />
                        <HighlightSpan color="bg-cyan-300/40 dark:bg-cyan-400/30" />
                      </a>
                      <span className="text-gray-500 dark:text-gray-400">,</span>
                      <a 
                        href="https://islamicbookstoronto.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 relative group cursor-pointer"
                      >
                        <span className="text-gray-500 dark:text-gray-400">swe intern @</span>
                        <img 
                          src="/ibs.avif" 
                          alt="IBS" 
                          className="h-4 w-auto object-contain flex-shrink-0"
                        />
                        <HighlightSpan color="bg-indigo-300/40 dark:bg-indigo-400/30" />
                      </a>
                      <span className="text-gray-500 dark:text-gray-400">,</span>
                      <a 
                        href="https://canadiancyber.ca"
                  target="_blank"
                  rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 relative group cursor-pointer"
                      >
                        <span className="text-gray-500 dark:text-gray-400">cybersecurity @</span>
                        <img 
                          src="/canadiancyber_logo.jpeg" 
                          alt="Canadian Cyber Inc" 
                          className="h-4 w-auto object-contain flex-shrink-0"
                        />
                        <HighlightSpan color="bg-red-300/40 dark:bg-red-400/30" />
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm font-medium">
                    <span className="text-gray-400 dark:text-gray-500">↳</span>
                    <div>
                      <span className="text-black dark:text-white"><span className="font-semibold">cool facts:</span> first internship at <span className="font-semibold">11</span>, </span>
                      <a href="https://instagram.com/muhibwqr" target="_blank" rel="noopener noreferrer" className="inline-flex relative group cursor-pointer font-medium">
                        <span className="font-semibold">8 million views on my insta</span>
                        <HighlightSpan color="bg-lime-300/40 dark:bg-lime-400/30" />
                      </a>
                      <span className="text-black dark:text-white">, </span>
                      <a href="https://www.instagram.com/reel/DE3VipVx8UT/" target="_blank" rel="noopener noreferrer" className="inline-flex relative group cursor-pointer font-medium">
                        <span className="font-semibold">4th place toronto wrestling </span>
                        <HighlightSpan color="bg-teal-300/40 dark:bg-teal-400/30" />
                      </a>
                      <span className="text-black dark:text-white">.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-gray-400 dark:text-gray-500">↳</span>
                    <Link
                      to="/projects"
                      className="inline-flex relative group cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                      check out my projects (click here)
                      <HighlightSpan color="bg-violet-300/40 dark:bg-violet-400/30" />
                    </Link>
                  </div>
                </div>

                {/* Writing — directly under the about */}
                <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/10 w-full max-w-xl">
                  <h2 className="text-base sm:text-lg font-semibold text-black dark:text-white mb-3">
                    writing
                  </h2>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        to="/writing/a-letter-of-dedication-to-ambition"
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors block relative group cursor-pointer"
                      >
                        a letter of dedication to ambition
                        <HighlightSpan color="bg-rose-300/40 dark:bg-rose-400/30" />
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Scenes from my life — under writing, horizontal scroll */}
                <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/10 w-full max-w-xl">
                  <h2 className="text-base sm:text-lg font-semibold text-black dark:text-white mb-3">
                    scenes from my life
                  </h2>
                  <div className="group relative overflow-hidden">
                    <div
                      ref={sliderRef}
                      className={`flex flex-row overflow-x-auto overflow-y-hidden gap-3 py-1 -mx-1 w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden select-none touch-pan-x overscroll-contain ${sliderDragging ? "cursor-grabbing" : "cursor-grab"}`}
                      style={{ contain: "layout paint", overscrollBehavior: "contain" }}
                      onMouseDown={onSliderMouseDown}
                      onTouchStart={onSliderTouchStart}
                      onWheel={onScenesWheel}
                    >
                      {sliderMedia.map((item) => (
                        <div
                          key={item.id}
                          className="flex-shrink-0 w-36 sm:w-44 flex flex-col gap-1 rounded-xl group/item"
                        >
                          <div className="w-full aspect-[4/3] flex items-center justify-center overflow-hidden rounded-lg">
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
                                alt=""
                                src={item.url}
                                loading="lazy"
                                decoding="async"
                                draggable={false}
                              />
                            )}
                          </div>
                          <p className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 text-center px-0.5 opacity-80 group-hover/item:opacity-100 truncate max-w-full" title={"label" in item ? item.label : sliderItemLabel(item.url)}>
                            {"label" in item ? item.label : sliderItemLabel(item.url)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
