import { useEffect, useState } from "react";

export function KeyboardShortcut() {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    // Detect if user is on Mac
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  const handleClick = () => {
    // Trigger the command palette by dispatching a keyboard event
    const event = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: isMac,
      ctrlKey: !isMac,
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(event);
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-400 text-xs font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
    >
      <kbd className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 font-mono text-xs">
        {isMac ? "⌘" : "Ctrl"}
      </kbd>
      <span className="text-gray-400 dark:text-gray-500">+</span>
      <kbd className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-700 dark:text-gray-300 font-mono text-xs">
        K
      </kbd>
    </button>
  );
}

