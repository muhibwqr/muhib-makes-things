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
            src="/Muhib_waqar_swe.pdf"
            className="w-full h-[calc(100vh-200px)] min-h-[600px]"
            title="Muhib Waqar Resume"
          />
        </div>

        <div className="mt-6 flex gap-4 justify-center">
          <a
            href="/Muhib_waqar_swe.pdf"
            download="Muhib_waqar_swe.pdf"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Download PDF
          </a>
          <a
            href="/Muhib_waqar_swe.pdf"
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

