import { useEffect } from "react";
import Dock from "@/components/Dock";
import { useDockItems } from "@/lib/dockItems";

export default function Resume() {
  const dockItems = useDockItems();

  useEffect(() => {
    document.title = "Resume | Muhib Waqar";
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f0f] transition-colors duration-300 relative overflow-hidden pb-32">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-[1]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-black dark:text-white">Resume</h1>
          <p className="text-muted-foreground">
            Download or share: <span className="font-mono text-sm">muhib-makes-things.com/resume</span>
          </p>
        </div>

        <div className="bg-white dark:bg-black border border-border/50 rounded-lg overflow-hidden shadow-lg">
          <iframe
            src="/muhib_waqar_resume_app.pdf"
            className="w-full h-[calc(100vh-200px)] min-h-[600px]"
            title="Muhib Waqar Resume"
          />
        </div>

        <div className="mt-6 flex gap-4 justify-center">
          <a
            href="/muhib_waqar_resume_app.pdf"
            download="muhib_waqar_resume_app.pdf"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Download PDF
          </a>
          <a
            href="/muhib_waqar_resume_app.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
          >
            Open in New Tab
          </a>
        </div>
      </div>

      <Dock items={dockItems} />
    </div>
  );
}

