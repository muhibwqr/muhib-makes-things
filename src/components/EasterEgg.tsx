import { useState } from "react";
import { Sparkles } from "lucide-react";

export function EasterEgg() {
  const [found, setFound] = useState(false);
  const [clicks, setClicks] = useState(0);

  const handleClick = () => {
    setClicks(prev => prev + 1);
    if (clicks >= 4) {
      setFound(true);
      setTimeout(() => setFound(false), 3000);
      setClicks(0);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="fixed bottom-4 left-4 w-3 h-3 rounded-full bg-accent/20 hover:bg-accent/40 transition-all cursor-pointer border-none p-0"
        aria-label="Easter egg"
      />
      
      {found && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="glass p-8 rounded-2xl glow animate-fade-in text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-accent animate-spin" />
            <h3 className="text-2xl font-bold gradient-text mb-2">You found me! 🎉</h3>
            <p className="text-muted-foreground">Thanks for exploring!</p>
          </div>
        </div>
      )}
    </>
  );
}
