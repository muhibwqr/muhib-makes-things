import { Navbar } from "@/components/Navbar";
import { Updates } from "@/components/Updates";
import LiquidEther from "@/components/LiquidEther";

export default function UpdatesPage() {
  return (
    <div className="min-h-screen relative bg-white text-black dark:bg-black dark:text-white">
      {/* LiquidEther background animation */}
      <div className="fixed inset-0 z-0">
        <LiquidEther
          colors={["#4A9EFF", "#9FF5FF", "#B1D4FF"]}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      {/* Semi-transparent backdrop for text readability */}
      <div className="fixed inset-0 z-[1] bg-white/60 dark:bg-black/60 backdrop-blur-sm pointer-events-none"></div>

      {/* Content wrapper */}
      <div className="relative z-10 min-h-screen">
        <Navbar />
        
        <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl pt-20 sm:pt-24">
          <Updates />
        </main>
      </div>
    </div>
  );
}

