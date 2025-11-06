import { ChevronDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const Dither = dynamic(() => import("react-bits/backgrounds").then(m => m.Dither), { ssr: false });

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      <div style={{ width: '100%', height: '600px', position: 'absolute', inset: 0, zIndex: 0 }}>
        <Dither
          waveColor={[0.5, 0.5, 0.5]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.3}
          colorNum={4}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.05}
        />
      </div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 text-white">Hi, I'm Muhib Waqar</h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto">
          Fullstack, cybersecurity, and machine learning engineering, approaching problems with a creative mindset
        </p>
        <p className="text-lg text-muted-foreground mb-2">
          ✨ University of Waterloo Math • Been working on tech since I was 11
        </p>
        <div className="inline-block glass px-6 py-3 rounded-lg mb-6 border-2 border-primary animate-pulse">
          <p className="text-lg font-bold text-primary">
            🚀 Actively seeking Summer 2026 internships in SWE, Cybersecurity & Product
          </p>
        </div>
        <Button 
          variant="outline" 
          size="lg"
          className="glass hover-lift mb-8 border-primary/50"
          asChild
        >
          <a href="/muhib_waqar_resume.pdf" download="Muhib_Waqar_Resume.pdf">
            <Download className="w-5 h-5 mr-2" />
            Download Resume
          </a>
        </Button>
      </div>
    </section>
  );
}
