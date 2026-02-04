import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Dock from "@/components/Dock";
import { useDockItems } from "@/lib/dockItems";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import DotGrid from "@/components/DotGrid";

// Highlight span component
const HighlightSpan = ({ color }: { color: string }) => (
  <span className={`absolute inset-0 ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out -z-10`} />
);

const Index = () => {
  const dockItems = useDockItems();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#0f0f0f] relative text-black dark:text-white">
      {/* DotGrid Background - Light mode (dark dots) */}
      <div className="absolute inset-0 z-0 hidden dark:hidden">
        <DotGrid
          dotSize={4}
          gap={20}
          baseColor="rgba(0, 0, 0, 0.15)"
          activeColor="rgba(0, 0, 0, 0.15)"
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
        {/* Dock Navigation */}
        <Dock 
          items={dockItems}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />
        
        <div className="relative z-10">
          {/* Header - Minimal */}
          <header className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-2xl">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-20 h-20 rounded-none border border-black/20 dark:border-white/20 flex-shrink-0">
                <AvatarImage src="/profile.jpeg" alt="Muhib Waqar" className="rounded-none" />
                <AvatarFallback className="bg-gray-200 text-black dark:bg-gray-800 dark:text-white rounded-none">
                  MW
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 relative">
                <h1 className="hero-title text-black dark:text-white mb-1">
                  muhib waqar
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  math & business @ uwaterloo • swe • security • product management
                </p>
              </div>
            </div>
          </header>

          {/* Main Content - Timeline Layout */}
          <main className="container mx-auto px-4 sm:px-6 pt-0 pb-8 sm:pb-12 max-w-2xl">
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
                      <span className="text-black dark:text-white font-medium">4th place toronto wrestling</span>
                      <span className="text-gray-500 dark:text-gray-400"> → I had to discipline myself insanely, and am applying that to other aspects of my life.</span>
                    </div>
                  </div>
                </div>
              </section>

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
                </div>
              </section>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
