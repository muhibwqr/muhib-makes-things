import { useEffect, useState } from "react";

export function KeyboardShortcut() {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    // Detect if user is on Mac
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-900/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-800 text-gray-300 text-xs font-medium">
        <kbd className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 font-mono text-xs">
          {isMac ? "⌘" : "Ctrl"}
        </kbd>
        <span className="text-gray-400">+</span>
        <kbd className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 font-mono text-xs">
          K
        </kbd>
      </div>
    </div>
  );
}

