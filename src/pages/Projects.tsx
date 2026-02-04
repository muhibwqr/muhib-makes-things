import { Projects } from "@/components/Projects";
import Cubes from "@/components/Cubes";
import Dock from "@/components/Dock";
import { useDockItems } from "@/lib/dockItems";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ProjectsPage() {
  const dockItems = useDockItems();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen relative bg-white dark:bg-[#0f0f0f] text-black dark:text-white">
      {/* Black overlay for dark mode */}
      <div className="absolute inset-0 z-[1] hidden dark:block bg-black/60 pointer-events-none"></div>

      {/* Content wrapper */}
      <div className="relative z-10 min-h-screen">
        {/* Dock Navigation — smaller on mobile */}
        <Dock 
          items={dockItems}
          panelHeight={isMobile ? 56 : 68}
          baseItemSize={isMobile ? 42 : 50}
          magnification={70}
        />
        
        <main className="px-3 sm:px-6 py-6 sm:py-12 pb-24 sm:pb-12">
          <div className="max-w-7xl section-spacing">
            <Projects />
          </div>
        </main>
      </div>
    </div>
  );
}

