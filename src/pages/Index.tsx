import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Dock from "@/components/Dock";
import { useDockItems } from "@/lib/dockItems";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import DotGrid from "@/components/DotGrid";

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
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [dotsHovered, setDotsHovered] = useState(false);
  const [sliderDragging, setSliderDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; scrollLeft: number } | null>(null);
  const isDraggingRef = useRef(false);

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

  // Auto-scroll slider (paused while dragging)
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

  // Drag-to-scroll handlers for slider
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
    <div className="min-h-screen w-full bg-white dark:bg-[#0f0f0f] relative text-black dark:text-white">
      {/* DotGrid Background - Light mode: grey dots by default, disappear on hover */}
      <div
        className={`absolute inset-0 z-0 block dark:hidden transition-opacity duration-300 ${
          dotsHovered ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <DotGrid
          dotSize={4}
          gap={20}
          baseColor="rgba(0, 0, 0, 0.12)"
          activeColor="rgba(0, 0, 0, 0.12)"
          proximity={120}
          shockRadius={250}
          shockStrength={3}
          resistance={500}
          returnDuration={2}
          speedTrigger={50}
        />
      </div>

      {/* DotGrid Background - Dark mode (white dots) */}
      <div className="absolute inset-0 z-0 hidden dark:block">
        <DotGrid
          dotSize={4}
          gap={20}
          baseColor="rgba(255, 255, 255, 0.25)"
          activeColor="rgba(255, 255, 255, 0.25)"
          proximity={120}
          shockRadius={250}
          shockStrength={3}
          resistance={500}
          returnDuration={2}
          speedTrigger={50}
        />
      </div>

      {/* Black overlay for dark mode */}
      <div className="absolute inset-0 z-[1] hidden dark:block bg-black/60 pointer-events-none"></div>

      {/* Content wrapper */}
      <div className="relative z-10 min-h-screen">
        {/* Dock Navigation — smaller on mobile for touch */}
        <Dock 
          items={dockItems}
          panelHeight={isMobile ? 56 : 68}
          baseItemSize={isMobile ? 42 : 50}
          magnification={70}
        />
        
        {/* Only hide dots when hovering over this center column */}
        <div
          className="relative z-10 max-w-2xl mx-auto px-3 sm:px-6 pb-24 sm:pb-0"
          onMouseEnter={() => setDotsHovered(true)}
          onMouseLeave={() => setDotsHovered(false)}
        >
          {/* Header - Minimal (responsive) */}
          <header className="py-6 sm:py-12">
            <div className="flex items-center gap-3 sm:gap-4 mb-4">
              <Avatar className="w-14 h-14 sm:w-20 sm:h-20 rounded-none border border-black/20 dark:border-white/20 flex-shrink-0">
                <AvatarImage src="/profile.jpeg" alt="Muhib Waqar" className="rounded-none" />
                <AvatarFallback className="bg-gray-200 text-black dark:bg-gray-800 dark:text-white rounded-none">
                  MW
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h1 className="hero-title text-black dark:text-white mb-1">
                  muhib waqar
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  math & business @ uwaterloo • swe • security • product management
                </p>
              </div>
            </div>
          </header>

          {/* Main Content - Timeline Layout */}
          <main className="pt-0 pb-8 sm:pb-12 min-h-[60vh]">
            {/* Timeline Container */}
            <div className="space-y-4">
              
              {/* Who am i Section */}
              <section className="-mt-2">
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-gray-400 dark:text-gray-500">→</span>
                    <div>
                      <span className="text-black dark:text-white font-medium">been in tech since age 11</span>
                      <span className="text-gray-500 dark:text-gray-400"> → from entrepreneurship and graphic design to software engineering. think beyond code.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-gray-400 dark:text-gray-500">→</span>
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
                      <span className="text-gray-500 dark:text-gray-400"> → studying to bridge technical and mathematical depth with business impact.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-gray-400 dark:text-gray-500">→</span>
                    <div>
                      <span className="text-black dark:text-white font-medium">5M+ views across platforms</span>
                      <span className="text-gray-500 dark:text-gray-400"> → built a personal brand surrounding my values, helped non-profits, and mentored creators + students. scale & focused on impact beyond my own work.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-gray-400 dark:text-gray-500">→</span>
                    <div className="flex flex-wrap items-center gap-1">
                      <span className="text-black dark:text-white font-medium">certified & experienced</span>
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
                        className="inline-flex items-center gap-1 cursor-pointer relative group"
                        onClick={(e) => e.preventDefault()}
                      >
                        <span className="text-gray-500 dark:text-gray-400">founding backend engineer @</span>
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
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-gray-400 dark:text-gray-500">→</span>
                    <div>
                      <a
                        href="https://www.instagram.com/reel/DE3VipVx8UT/?igsh=MWtpYWprbmRzdGFncQ=="
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex gap-1 relative group cursor-pointer"
                      >
                        <span className="text-black dark:text-white font-medium">4th place toronto wrestling</span>
                        <HighlightSpan color="bg-yellow-300/40 dark:bg-yellow-400/30" />
                      </a>
                      <span className="text-gray-500 dark:text-gray-400"> → I had to discipline myself insanely, and am applying that to other aspects of my life.</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Image slider + Check my projects (responsive) */}
              <section className="pt-4 flex flex-col gap-3 sm:gap-4 relative z-[9999]">
                <h2 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">scenes from my life</h2>
                <div className="group relative overflow-hidden -mx-3 sm:mx-0">
                  <div
                    ref={sliderRef}
                    className={`images-container flex overflow-x-auto gap-2 sm:gap-3 min-w-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden select-none touch-pan-x ${sliderDragging ? "cursor-grabbing" : "cursor-grab"}`}
                    style={{ contain: "layout paint" }}
                    onMouseDown={onSliderMouseDown}
                    onTouchStart={onSliderTouchStart}
                  >
                    {sliderMedia.map((item) => (
                      <div
                        key={item.id}
                        className="flex-shrink-0 w-[140px] sm:w-[180px] flex flex-col gap-1 sm:gap-1.5 rounded-none group/item"
                      >
                        <div className="w-full h-[88px] sm:h-[112px] flex items-center justify-center overflow-hidden rounded-none">
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
                        <p className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 text-center px-0.5 opacity-80 group-hover/item:opacity-100 group-hover/item:scale-[1.02] transition-all duration-200 origin-left truncate max-w-full" title={"label" in item ? item.label : sliderItemLabel(item.url)}>
                          {"label" in item ? item.label : sliderItemLabel(item.url)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <motion.a
                  href="/projects"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/projects');
                  }}
                  className="group relative inline-flex items-center justify-center gap-3 px-5 py-3.5 sm:px-6 sm:py-4 w-full sm:w-auto min-h-[44px] bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-black/10 dark:border-white/10 text-black dark:text-white font-medium text-sm hover:border-blue-400/50 dark:hover:border-blue-400/50 transition-colors duration-200 hero-title touch-manipulation"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <span className="relative z-10">checkout my projects</span>
                </motion.a>
              </section>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
