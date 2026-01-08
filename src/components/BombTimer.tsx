import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Bomb } from "lucide-react";

interface BombTimerProps {
  duration: number; // in seconds
  onComplete: () => void;
}

export const BombTimer = ({ duration, onComplete }: BombTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPulsing, setIsPulsing] = useState(false);

  // Reset timer when duration changes
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  useEffect(() => {
    // Pulse animation when time is running low
    if (timeLeft <= 3) {
      setIsPulsing(true);
    } else {
      setIsPulsing(false);
    }
  }, [timeLeft]);

  const progress = (timeLeft / duration) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center pointer-events-none"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
        <motion.div
          className="relative flex flex-col items-center justify-center"
          style={{
            position: 'relative',
            zIndex: 99999,
          }}
          animate={isPulsing ? {
            scale: [1, 1.1, 1],
          } : {}}
          transition={{
            duration: 0.5,
            repeat: isPulsing ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          {/* Bomb Icon */}
          <motion.div
            className="relative mb-3 sm:mb-4"
            animate={isPulsing ? {
              rotate: [0, -5, 5, -5, 0],
            } : {}}
            transition={{
              duration: 0.3,
              repeat: isPulsing ? Infinity : 0,
            }}
          >
            <Bomb 
              className={`w-16 h-16 sm:w-24 sm:h-24 ${isPulsing ? 'text-red-500' : 'text-black dark:text-white'}`}
            />
            {/* Fuse spark effect */}
            {isPulsing && (
              <motion.div
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                }}
              />
            )}
          </motion.div>

          {/* Timer Display */}
          <motion.div
            className="text-4xl sm:text-6xl font-bold mb-3 sm:mb-4 text-black dark:text-white px-4"
            style={{
              fontFamily: "'Share Tech Mono', 'Courier New', monospace",
              letterSpacing: "0.15em",
              fontVariantNumeric: "tabular-nums",
            }}
            animate={isPulsing ? {
              color: ["#ef4444", "#fbbf24", "#ef4444"],
            } : {}}
            transition={{
              duration: 0.5,
              repeat: isPulsing ? Infinity : 0,
            }}
          >
            {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
          </motion.div>

          {/* Progress Bar */}
          <div className="w-48 sm:w-64 h-2 bg-gray-700 rounded-full overflow-hidden mx-4">
            <motion.div
              className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-red-500"
              initial={{ width: "100%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </div>
        </motion.div>
      </motion.div>
  );
};

