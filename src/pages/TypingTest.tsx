
import { useState, useRef, useEffect } from "react";
// Local storage helpers
const BEST_KEY = 'typingtest_best_scores_v1';
type BestScore = { wpm: number; accuracy: number; cpm: number; date: string };
type BestScores = { [mode: string]: BestScore };


type Mode = "time" | "words" | "custom" | "practice";

const MODES: { label: string; value: Mode; desc: string }[] = [
  { label: "Time", value: "time", desc: "15/30/60s" },
  { label: "Words", value: "words", desc: "10/25/50" },
  { label: "Custom", value: "custom", desc: "Your own" },
  { label: "Practice", value: "practice", desc: "Hints" },
];

const TypingTest: React.FC = () => {
  const [mode, setMode] = useState<Mode>("time");

  // Mode state
  const [duration, setDuration] = useState(30); // seconds for time mode
  const [wordCount, setWordCount] = useState(25); // for words mode
  const [customText, setCustomText] = useState("");
  const [passage, setPassage] = useState<string>("");
  const [passageSource, setPassageSource] = useState<'builtin' | 'api' | 'custom'>("builtin");
  const [started, setStarted] = useState(false);
  const [input, setInput] = useState("");
  const [bestScores, setBestScores] = useState<BestScores>({});
  const [finished, setFinished] = useState(false);
  // Load best scores from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(BEST_KEY);
      if (raw) setBestScores(JSON.parse(raw));
    } catch {}
  }, []);

  // Save best score if improved
  useEffect(() => {
    if (!finished) return;
    const prev = bestScores[mode] || { wpm: 0, accuracy: 0, cpm: 0, date: '' };
    if (wpm > prev.wpm || (wpm === prev.wpm && accuracy > prev.accuracy)) {
      const updated: BestScores = {
        ...bestScores,
        [mode]: { wpm, accuracy, cpm, date: new Date().toISOString() },
      };
      setBestScores(updated);
      localStorage.setItem(BEST_KEY, JSON.stringify(updated));
    }
  }, [finished]);
  const [inputTimes, setInputTimes] = useState<number[]>([]); // per-char timestamps
  const [backspaceCount, setBackspaceCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [charErrors, setCharErrors] = useState<number[]>([]); // error heatmap
  const [timer, setTimer] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  // Built-in corpus
  const builtinCorpus = [
    "The quick brown fox jumps over the lazy dog.",
    "Practice makes perfect. Keep typing to improve your speed and accuracy.",
    "React and TypeScript make building modern web apps a joy.",
    "Accessibility is not optional. Build for everyone.",
    "Minimal, beautiful, and fast. That's the goal.",
    "Keyboard-first, mobile-friendly, and screen reader accessible.",
    "Persistence lets you track your best scores over time.",
    "MonkeyType inspired, but built from scratch for your portfolio.",
    "Stay focused, breathe, and type with confidence.",
    "Every keystroke counts. Good luck!"
  ];

  // Fetch passage based on mode/source
  const fetchPassage = async () => {
    if (passageSource === "builtin") {
      // Pick random from corpus
      let text = builtinCorpus[Math.floor(Math.random() * builtinCorpus.length)];
      if (mode === "words") {
        // Repeat/cut to wordCount
        const words = text.split(/\s+/);
        while (words.length < wordCount) words.push(...words);
        text = words.slice(0, wordCount).join(" ");
      }
      setPassage(text);
    } else if (passageSource === "api") {
      // API stub
      try {
        const url = `/api/passages?mode=${mode}&count=${mode === "words" ? wordCount : duration}`;
        const res = await fetch(url);
        const data = await res.json();
        setPassage(data.passage || builtinCorpus[0]);
      } catch {
        setPassage(builtinCorpus[0]);
      }
    } else if (passageSource === "custom") {
      setPassage(customText.trim() || builtinCorpus[0]);
    }
  };

  // Fetch passage on mode/source change
  useEffect(() => {
    if (mode === "custom") return; // Wait for user input
    fetchPassage();
    // eslint-disable-next-line
  }, [mode, wordCount, duration, passageSource]);

  // For custom mode, update passage when customText changes
  useEffect(() => {
    if (mode === "custom") setPassage(customText.trim());
    // eslint-disable-next-line
  }, [customText, mode]);

  // Focus input on start
  useEffect(() => {
    if (started && inputRef.current) {
      inputRef.current.focus();
    }
  }, [started]);
  // Focus input on start and trap focus during test
  useEffect(() => {
    if (started && inputRef.current) {
      inputRef.current.focus();
    }
    if (!started) return;
    const handleFocus = (e: FocusEvent) => {
      if (mainRef.current && !mainRef.current.contains(e.target as Node)) {
        inputRef.current?.focus();
      }
    };
    window.addEventListener('focusin', handleFocus);
    return () => window.removeEventListener('focusin', handleFocus);
  }, [started]);

  // Timer logic (for time mode)
  useEffect(() => {
    if (!started || finished) return;
    if (mode === "time") {
      if (timer >= duration) {
        setFinished(true);
        return;
      }
      const id = setTimeout(() => setTimer((t) => t + 1), 1000);
      return () => clearTimeout(id);
    }
    if (mode === "words" && input.trim().split(/\s+/).length >= wordCount) {
      setFinished(true);
      return;
    }
    if (mode === "custom" && input.length >= passage.length) {
      setFinished(true);
      return;
    }
    // Practice mode: never auto-finish
  }, [started, timer, finished, mode, duration, wordCount, input, passage.length]);

  // Handle input change
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!started) setStarted(true);
    // Ignore paste
    if (e.nativeEvent instanceof InputEvent && e.nativeEvent.inputType === "insertFromPaste") {
      return;
    }
    const val = e.target.value;
    // Backspace count
    if (val.length < input.length) setBackspaceCount((b) => b + 1);
    // Error count and streaks
    let errors = 0;
    let currentStreak = 0;
    let maxStreak = longestStreak;
    const newCharErrors = Array(passage.length).fill(0);
    for (let i = 0; i < val.length; i++) {
      if (val[i] === passage[i]) {
        currentStreak++;
        if (currentStreak > maxStreak) maxStreak = currentStreak;
      } else {
        errors++;
        currentStreak = 0;
        newCharErrors[i] = 1;
      }
    }
    setErrorCount(errors);
    setStreak(currentStreak);
    setLongestStreak(maxStreak);
    setCharErrors(newCharErrors);
    setInput(val);
    // Per-char timing
    if (!finished) {
      setInputTimes((prev) => {
        const now = Date.now();
        const arr = prev.slice();
        if (val.length > input.length) {
          arr.push(now);
        } else if (val.length < input.length) {
          arr.pop();
        }
        return arr;
      });
    }
  };

  // Reset test
  const handleReset = () => {
    setInput("");
    setStarted(false);
    setTimer(0);
    setFinished(false);
    setBackspaceCount(0);
    setErrorCount(0);
    setStreak(0);
    setLongestStreak(0);
    setCharErrors([]);
    setInputTimes([]);
    if (inputRef.current) inputRef.current.focus();
    fetchPassage();
  };

  // Retry with same passage
  const handleRetrySame = () => {
    setInput("");
    setStarted(false);
    setTimer(0);
    setFinished(false);
    setBackspaceCount(0);
    setErrorCount(0);
    setStreak(0);
    setLongestStreak(0);
    setCharErrors([]);
    setInputTimes([]);
    if (inputRef.current) inputRef.current.focus();
  };

  // Render passage as per-character tokens with error heatmap and feedback
  const renderPassage = () => {
    return (
      <div
        className="font-mono text-lg md:text-xl flex flex-wrap gap-1 select-none"
        aria-label="Typing passage"
        role="textbox"
        aria-live="polite"
      >
        {passage.split("").map((char, idx) => {
          let className = "px-0.5 py-0.5 rounded transition-colors duration-100";
          if (input[idx] === undefined) className += " text-muted-foreground";
          else if (input[idx] === char) className += " text-primary";
          else className += " bg-destructive/20 text-destructive animate-shake";
          if (idx === input.length && !finished) className += " bg-accent animate-pulse";
          // Error heatmap after test
          if (finished && charErrors[idx]) className += " ring-2 ring-destructive/40";
          return (
            <span key={idx} className={className}>
              {char === " " ? <span className="inline-block w-3"> </span> : char}
            </span>
          );
        })}
      </div>
    );
  };

  // Metrics
  const elapsed = timer;
  const cpm = Math.round((input.length / Math.max(elapsed, 1)) * 60);
  const wpm = Math.round((input.trim().split(/\s+/).length / Math.max(elapsed, 1)) * 60);
  const accuracy = passage.length
    ? Math.round((input.split("").filter((c, i) => c === passage[i]).length / passage.length) * 100)
    : 100;

  return (
    <main
      ref={mainRef}
      className="flex flex-col items-center justify-center min-h-screen bg-background px-2"
      tabIndex={-1}
      aria-label="Typing test main area"
    >
      <h1 className="text-3xl font-bold mb-4" tabIndex={0} aria-label="Typing Test">Typing Test</h1>
      {/* Best scores */}
      <div className="mb-4 text-xs text-muted-foreground">
        <span className="font-semibold">Best:</span>{' '}
        {['time', 'words', 'custom', 'practice'].map((m) =>
          bestScores[m] ? (
            <span key={m} className="mr-3">
              <span className="capitalize">{m}</span>: {bestScores[m].wpm} WPM, {bestScores[m].accuracy}%
            </span>
          ) : null
        )}
      </div>
    <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Mode selection">
        {MODES.map((m) => (
          <button
            key={m.value}
            className={`px-4 py-2 rounded border text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors ${mode === m.value ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-accent"}`}
            onClick={() => setMode(m.value)}
            aria-pressed={mode === m.value}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Mode options */}
    <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Mode options">
        {mode === "time" && (
          <>
            {[15, 30, 60].map((d) => (
              <button
                key={d}
                className={`px-3 py-1 rounded border text-xs ${duration === d ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-accent"}`}
                onClick={() => setDuration(d)}
              >
                {d}s
              </button>
            ))}
          </>
        )}
        {mode === "words" && (
          <>
            {[10, 25, 50].map((w) => (
              <button
                key={w}
                className={`px-3 py-1 rounded border text-xs ${wordCount === w ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-accent"}`}
                onClick={() => setWordCount(w)}
              >
                {w} words
              </button>
            ))}
          </>
        )}
        <select
          className="px-2 py-1 rounded border text-xs bg-muted"
          value={passageSource}
          onChange={e => setPassageSource(e.target.value as any)}
          aria-label="Passage source"
        >
          <option value="builtin">Built-in</option>
          <option value="api">API</option>
          <option value="custom">Custom</option>
        </select>
        {passageSource === "custom" && (
          <input
            className="px-2 py-1 rounded border text-xs bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            value={customText}
            onChange={e => setCustomText(e.target.value)}
            placeholder="Paste or type your own text"
            aria-label="Custom passage"
          />
        )}
      </div>

      {/* Passage display & input or summary */}
      {!finished ? (
        <>
          <section className="mb-6 w-full max-w-2xl" tabIndex={-1}>
            {renderPassage()}
          </section>
          <input
            ref={inputRef}
            type="text"
            className="w-full max-w-2xl border rounded px-3 py-2 font-mono text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary mb-4"
            value={input}
            onChange={handleInput}
            disabled={finished}
            aria-label="Typing input"
            autoFocus
            spellCheck={false}
            autoComplete="off"
            inputMode="text"
            aria-live="polite"
            aria-describedby="typing-desc"
          />
          <span id="typing-desc" className="sr-only">Type the passage above. Only backspace to correct the last character. Paste is disabled. IME input is supported.</span>
      {/* Reduced motion and high-contrast support */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .animate-shake, .animate-pulse, .animate-fade-in { animation: none !important; }
        }
        @media (prefers-contrast: more) {
          .bg-muted, .bg-accent, .bg-primary, .bg-card { filter: contrast(1.2); }
        }
      `}</style>
      {/* Passage display & input or summary */}
          {/* Metrics */}
          <div className="flex flex-wrap gap-6 mb-4 text-sm">
            <div><strong>WPM:</strong> {wpm}</div>
            <div><strong>CPM:</strong> {cpm}</div>
            <div><strong>Accuracy:</strong> {accuracy}%</div>
            <div><strong>Errors:</strong> {errorCount}</div>
            <div><strong>Backspaces:</strong> {backspaceCount}</div>
            <div><strong>Streak:</strong> {streak}</div>
            <div><strong>Longest Streak:</strong> {longestStreak}</div>
            <div><strong>Time:</strong> {mode === "time" ? `${timer}s / ${duration}s` : timer + "s"}</div>
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 rounded bg-muted hover:bg-accent border text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </>
      ) : (
        <section className="w-full max-w-2xl bg-card border rounded-lg p-6 shadow-lg animate-fade-in">
          <h2 className="text-xl font-bold mb-2">Test Summary</h2>
          <div className="flex flex-wrap gap-6 mb-4 text-sm">
            <div><strong>WPM:</strong> {wpm}</div>
            <div><strong>CPM:</strong> {cpm}</div>
            <div><strong>Accuracy:</strong> {accuracy}%</div>
            <div><strong>Errors:</strong> {errorCount}</div>
            <div><strong>Backspaces:</strong> {backspaceCount}</div>
            <div><strong>Longest Streak:</strong> {longestStreak}</div>
            <div><strong>Elapsed:</strong> {elapsed}s</div>
            {bestScores[mode] && (
              <div className="text-xs text-muted-foreground">
                <span className="font-semibold">Best:</span> {bestScores[mode].wpm} WPM, {bestScores[mode].accuracy}%
              </div>
            )}
          </div>
          {/* Per-word timing histogram */}
          <div className="mb-4">
            <h3 className="font-semibold mb-1">Per-word Timing</h3>
            <div className="flex gap-1 items-end h-16">
              {(() => {
                const words = passage.split(/\s+/);
                const times: number[] = [];
                let lastIdx = 0;
                for (let i = 0; i < words.length; i++) {
                  const wordLen = words[i].length + 1; // +1 for space
                  const endIdx = lastIdx + wordLen - 1;
                  if (inputTimes[endIdx]) {
                    const t = (inputTimes[endIdx] - (inputTimes[lastIdx - 1] || inputTimes[0] || 0)) / 1000;
                    times.push(Math.max(0, t));
                  } else {
                    times.push(0);
                  }
                  lastIdx = endIdx + 1;
                }
                const max = Math.max(...times, 1);
                return times.map((t, i) => (
                  <div key={i} className="bg-primary/60 rounded w-3 mx-0.5" style={{ height: `${(t / max) * 60 + 8}px` }} title={`Word ${i + 1}: ${t.toFixed(2)}s`} />
                ));
              })()}
            </div>
          </div>
          {/* Error map */}
          <div className="mb-4">
            <h3 className="font-semibold mb-1">Error Map</h3>
            <div className="flex flex-wrap gap-1">
              {passage.split("").map((char, idx) => (
                <span key={idx} className={`px-0.5 py-0.5 rounded ${charErrors[idx] ? "bg-destructive/40 text-destructive" : "bg-muted text-muted-foreground"}`}>{char === " " ? <span className="inline-block w-3"> </span> : char}</span>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              className="px-4 py-2 rounded bg-muted hover:bg-accent border text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={handleRetrySame}
            >
              Retry Same
            </button>
            <button
              className="px-4 py-2 rounded bg-muted hover:bg-accent border text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onClick={handleReset}
            >
              New Passage
            </button>
          </div>
        </section>
      )}
    </main>
  );
};

export default TypingTest;
