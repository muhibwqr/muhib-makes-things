import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Dock from "@/components/Dock";
import { KeyboardShortcut } from "@/components/KeyboardShortcut";
import { useDockItems } from "@/lib/dockItems";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { BombTimer } from "@/components/BombTimer";
import { ConfettiExplosion } from "@/components/ConfettiExplosion";
import { incrementMysteryCount, getMysteryCount } from "@/lib/mysteryCount";

// Animation transition constants
const MELT_TRANSITION = {
  duration: 4,
  ease: [0.4, 0, 0.2, 1] as const,
};

const RESET_TRANSITION = {
  duration: 1.5,
  ease: "easeOut" as const,
};

const getTransition = (isMelting: boolean, delay: number = 0, times?: number[]) => ({
  duration: isMelting ? MELT_TRANSITION.duration : RESET_TRANSITION.duration,
  ease: isMelting ? MELT_TRANSITION.ease : RESET_TRANSITION.ease,
  delay: isMelting ? delay : 0,
  ...(times && isMelting && { times }),
});

// Link helper function
const getLinkProps = (isMelting: boolean) => ({
  className: `inline-flex items-center gap-1 relative group ${isMelting ? 'pointer-events-none cursor-default' : 'cursor-pointer'}`,
  onClick: isMelting ? (e: React.MouseEvent) => e.preventDefault() : undefined,
});

// Highlight span component
const HighlightSpan = ({ color }: { color: string }) => (
  <span className={`absolute inset-0 ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out -z-10`} />
);

const Index = () => {
  const dockItems = useDockItems();
  const navigate = useNavigate();
  const [isMelting, setIsMelting] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [mysteryCount, setMysteryCount] = useState(0);
  const [showCountMessage, setShowCountMessage] = useState(false);
  const confettiRef = useRef<{ explode: (delay?: number) => void }>(null);
  const TIMER_DURATION = 5;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Fetch initial count on mount
    getMysteryCount().then(setMysteryCount).catch(console.error);
  }, []);

  const handleMysteryClick = () => {
    if (showTimer || showConfetti) {
      // Reset everything
      setShowTimer(false);
      setShowConfetti(false);
      setIsMelting(false);
      setShowCountMessage(false);
    } else {
      // Start the mystery feature - timer and melt start together
      setIsMelting(true);
      setShowTimer(true);
    }
  };

  const handleTimerComplete = async () => {
    setShowTimer(false);
    
    // Show confetti first, then trigger explosion
    setShowConfetti(true);
    
    // Small delay to ensure confetti component is mounted
    setTimeout(() => {
      if (confettiRef.current) {
        confettiRef.current.explode(250);
      }
    }, 100);
    
    // Increment count and show message
    const newCount = await incrementMysteryCount();
    setMysteryCount(newCount);
    
    // Show count message after a short delay
    setTimeout(() => {
      setShowCountMessage(true);
    }, 500);
    
    // Auto-reset after confetti completes
    setTimeout(() => {
      setShowConfetti(false);
      setIsMelting(false);
      setShowCountMessage(false);
    }, 8000);
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#0f0f0f] relative text-black dark:text-white">
      {/* Light mode - Subtle Crosshatch */}
      <div
        className="absolute inset-0 z-0 pointer-events-none dark:hidden"
        style={{
          backgroundImage: `
            repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(0, 0, 0, 0.08) 2px, rgba(0, 0, 0, 0.08) 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(0, 0, 0, 0.05) 2px, rgba(0, 0, 0, 0.05) 3px, transparent 3px, transparent 8px)
          `,
        }}
      />
      
      {/* Dark mode - Crosshatch Art Pattern */}
      <div
        className="absolute inset-0 z-0 pointer-events-none hidden dark:block"
        style={{
          backgroundImage: `
            repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(16, 185, 129, 0.18) 2px, rgba(16, 185, 129, 0.18) 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(245, 101, 101, 0.10) 2px, rgba(245, 101, 101, 0.10) 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(234, 179, 8, 0.08) 2px, rgba(234, 179, 8, 0.08) 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(249, 115, 22, 0.06) 2px, rgba(249, 115, 22, 0.06) 3px, transparent 3px, transparent 8px)
          `,
        }}
      />
      
      {/* Black overlay for dark mode */}
      <div className="absolute inset-0 z-[1] hidden dark:block bg-black/60 pointer-events-none"></div>

      {/* Content wrapper */}
      <motion.div 
        className="relative z-10 min-h-screen"
        animate={isMelting ? {
          filter: "blur(12px) brightness(0.8)",
        } : {
          filter: "blur(0px) brightness(1)",
        }}
        transition={{ duration: isMelting ? 2.5 : 1.2, ease: "easeInOut" }}
      >
        {/* Dock Navigation */}
        <motion.div
          animate={isMelting ? {
            y: [0, -10, -25, -45],
            rotate: [0, -1.5, 1.5, -2.5, 2.5],
            scale: [1, 0.97, 0.93, 0.88],
            opacity: [1, 0.9, 0.75, 0.55],
            x: [0, 2, -2, 3],
          } : {}}
          transition={getTransition(isMelting, 0.35, [0, 0.33, 0.66, 1])}
        >
          <Dock 
            items={dockItems}
            panelHeight={68}
            baseItemSize={50}
            magnification={70}
          />
        </motion.div>
        
        <div className="relative z-10">
          {/* Header - Minimal */}
          <motion.header 
            className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-2xl"
            animate={isMelting ? {
              y: [0, 20, 60, 120, 200],
              rotate: [0, 1, -1, 2, -2, 3],
              scale: [1, 0.98, 0.95, 0.88, 0.75],
              opacity: [1, 0.95, 0.85, 0.7, 0.4],
              skewX: [0, 2, -2, 3, -3, 4],
              x: [0, 5, -5, 8, -8, 10],
            } : {}}
            transition={getTransition(isMelting, 0, [0, 0.25, 0.5, 0.75, 1])}
          >
            <div className="flex items-center gap-4 mb-4">
              <motion.div
                animate={isMelting ? {
                  y: [0, 15, 40, 80, 150],
                  rotate: [0, 8, -8, 12, -12, 18],
                  scale: [1, 0.96, 0.9, 0.82, 0.7],
                  opacity: [1, 0.9, 0.75, 0.6, 0.3],
                  x: [0, 3, -3, 5, -5],
                } : {}}
                transition={getTransition(isMelting, 0.15, [0, 0.25, 0.5, 0.75, 1])}
              >
                <Avatar className="w-20 h-20 border border-black/20 dark:border-white/20 flex-shrink-0">
                <AvatarImage src="/profile.jpeg" alt="Muhib Waqar" />
                <AvatarFallback className="bg-gray-200 text-black dark:bg-gray-800 dark:text-white">
                  MW
                </AvatarFallback>
              </Avatar>
              </motion.div>
              <motion.div 
                className="flex-1 relative"
                animate={isMelting ? {
                  y: [0, 12, 35, 70, 130],
                  rotate: [0, -2, 2, -3, 3, -4],
                  scale: [1, 0.97, 0.92, 0.85, 0.75],
                  opacity: [1, 0.92, 0.8, 0.65, 0.4],
                  x: [0, -2, 2, -3, 3],
                } : {}}
                transition={getTransition(isMelting, 0.2, [0, 0.25, 0.5, 0.75, 1])}
              >
                <div className="absolute right-16 top-6">
                  <KeyboardShortcut />
                </div>
                <motion.h1 
                  className="hero-title text-black dark:text-white mb-1"
                  animate={isMelting ? {
                    color: ["#ef4444", "#dc2626", "#ef4444"],
                  } : {}}
                  transition={{
                    duration: 0.5,
                    repeat: isMelting ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                >
                  muhib waqar
                </motion.h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  math & business @ uwaterloo • swe • security • product management
                </p>
              </motion.div>
            </div>
          </motion.header>

          {/* Main Content - Timeline Layout */}
          <motion.main 
            className="container mx-auto px-4 sm:px-6 pt-0 pb-8 sm:pb-12 max-w-2xl"
            animate={isMelting ? {
              y: [0, 15, 45, 90, 160],
              rotate: [0, -1, 1, -1.5, 1.5, -2],
              scale: [1, 0.98, 0.94, 0.88, 0.78],
              opacity: [1, 0.93, 0.82, 0.68, 0.45],
              skewY: [0, 1.5, -1.5, 2, -2],
              x: [0, 3, -3, 5, -5],
            } : {}}
            transition={getTransition(isMelting, 0.25, [0, 0.25, 0.5, 0.75, 1])}
          >
            {/* Timeline Container */}
            <div className="space-y-4">
              
              {/* Who am i Section */}
            <motion.section 
              className="-mt-2"
              animate={isMelting ? {
                y: [0, 10, 30, 60, 110],
                rotate: [0, 0.5, -0.5, 1, -1, 1.5],
                scale: [1, 0.98, 0.94, 0.89, 0.82],
                opacity: [1, 0.92, 0.8, 0.65, 0.45],
                skewX: [0, 1, -1, 1.5, -1.5],
                x: [0, 2, -2, 3, -3],
              } : {}}
              transition={getTransition(isMelting, 0.45, [0, 0.25, 0.5, 0.75, 1])}
            >
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
                        {...getLinkProps(isMelting)}
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
                        {...getLinkProps(isMelting)}
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
                        {...getLinkProps(isMelting)}
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
                        {...getLinkProps(isMelting)}
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
                        {...getLinkProps(isMelting)}
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
                        {...getLinkProps(isMelting)}
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
                        {...getLinkProps(isMelting)}
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
                        {...getLinkProps(isMelting)}
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
                      <span className="text-black dark:text-white font-medium">4th place toronto wrestling</span>
                      <span className="text-gray-500 dark:text-gray-400"> → I had to discipline myself insanely, and am applying that to other aspects of my life.</span>
                </div>
                </div>
              </div>
            </motion.section>

            {/* Projects Button */}
            <section className="pt-4">
              <div className="flex flex-col sm:flex-row gap-3 flex-wrap relative z-[9999]">
                <motion.a
                  href="/projects"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/projects');
                  }}
                  className="group relative inline-flex items-center justify-center gap-3 px-6 py-4 w-full sm:w-auto bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-black/10 dark:border-white/10 text-black dark:text-white font-medium text-sm hover:border-blue-400/50 dark:hover:border-blue-400/50 transition-all duration-300 overflow-hidden hero-title touch-manipulation"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  animate={isMelting ? {
                    y: [0, 40, 90, 150, 240],
                    rotate: [0, 3, -3, 5, -5, 8],
                    scale: [1, 0.92, 0.84, 0.74, 0.6],
                    opacity: [1, 0.85, 0.7, 0.5, 0.2],
                    skewX: [0, 4, -4, 6, -6],
                    x: [0, 5, -5, 8, -8],
                  } : {}}
                  transition={getTransition(isMelting, 0, [0, 0.25, 0.5, 0.75, 1])}
                >
                  {/* Animated gradient background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    style={{
                      backgroundSize: '200% 100%',
                    }}
                  />
                  
                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
                    style={{
                      background: 'radial-gradient(circle, rgba(74, 158, 255, 0.4) 0%, transparent 70%)',
                    }}
                  />
                  
                  {/* Content */}
                  <div className="relative z-10 flex items-center gap-3">
                    <span>checkout my projects</span>
              </div>
                </motion.a>

                <motion.button
                  onClick={handleMysteryClick}
                  className="group relative inline-flex items-center justify-center gap-3 px-6 py-4 w-full sm:w-auto bg-white/10 dark:bg-white/5 backdrop-blur-xl border-2 border-cyan-400/50 dark:border-cyan-400/50 text-black dark:text-white font-medium text-sm hover:border-cyan-400 dark:hover:border-cyan-400 transition-all duration-300 overflow-hidden z-50 hero-title touch-manipulation"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    position: 'relative',
                    zIndex: 9999,
                  }}
                >
                  {/* Animated gradient background - more visible when active */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-sky-500/30 to-cyan-500/30"
                    animate={isMelting ? {
                      opacity: [0.5, 0.8, 0.5],
                    } : {
                      opacity: 0,
                    }}
                    transition={{
                      duration: 2,
                      repeat: isMelting ? Infinity : 0,
                      ease: 'easeInOut',
                    }}
                    style={{
                      backgroundSize: '200% 100%',
                    }}
                  />
                  
                  {/* Glow effect - stronger when active */}
                  <motion.div
                    className="absolute inset-0 blur-xl"
                    animate={isMelting ? {
                      opacity: [0.3, 0.6, 0.3],
                    } : {
                      opacity: 0,
                    }}
                    transition={{
                      duration: 2,
                      repeat: isMelting ? Infinity : 0,
                      ease: 'easeInOut',
                    }}
                    style={{
                      background: 'radial-gradient(circle, rgba(34, 211, 238, 0.6) 0%, transparent 70%)',
                    }}
                  />
                  
                  {/* Content */}
                  <div className="relative z-10 flex items-center gap-3">
                    {showTimer || showConfetti ? (
                      <span>reset</span>
                    ) : (
                      <span>try out the mystery feature</span>
                    )}
                  </div>
                </motion.button>
              </div>
            </section>

            </div>
          </motion.main>
        </div>
      </motion.div>

      {/* Bomb Timer */}
      <AnimatePresence>
        {showTimer && (
          <BombTimer 
            key="bomb-timer"
            duration={TIMER_DURATION} 
            onComplete={handleTimerComplete} 
          />
        )}
      </AnimatePresence>

      {/* Confetti Explosion */}
      {showConfetti && (
        <>
          <ConfettiExplosion
            ref={confettiRef}
            key="confetti"
            size={20}
            explosionCount={isMobile ? 10 : 15}
            spriteCount={isMobile ? 80 : 120}
            spriteSizes={{ min: 6, max: 8 }}
            speed={2.4}
            gravity={0.7}
          />
          
          {/* Count Message */}
          <AnimatePresence>
            {showCountMessage && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="fixed inset-0 z-[99998] flex items-center justify-center pointer-events-none"
              >
                <motion.div>
                  <p className="text-lg sm:text-2xl font-bold text-center text-black dark:text-white hero-title px-4">
                    you are the {mysteryCount}{getOrdinalSuffix(mysteryCount)} person to test ts out
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

// Helper function to get ordinal suffix (1st, 2nd, 3rd, etc.)
const getOrdinalSuffix = (n: number): string => {
  const j = n % 10;
  const k = n % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
};

export default Index;

