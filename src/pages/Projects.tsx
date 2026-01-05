import { Projects } from "@/components/Projects";
import Cubes from "@/components/Cubes";
import Dock from "@/components/Dock";
import { useDockItems } from "@/lib/dockItems";

export default function ProjectsPage() {
  const dockItems = useDockItems();

  return (
    <div className="min-h-screen relative bg-white text-black dark:bg-black dark:text-white">
      {/* Cubes background animation */}
      <div className="fixed inset-0 z-0">
        <Cubes />
      </div>

      {/* Semi-transparent backdrop for text readability */}
      <div className="fixed inset-0 z-[1] bg-white/60 dark:bg-black/60 backdrop-blur-sm pointer-events-none"></div>

      {/* Content wrapper */}
      <div className="relative z-10 min-h-screen">
        {/* Dock Navigation */}
        <Dock 
          items={dockItems}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />
        
        <main className="px-4 sm:px-6 py-8 sm:py-12">
          <div className="max-w-7xl section-spacing">
            <Projects />
          </div>
        </main>
      </div>
    </div>
  );
}

