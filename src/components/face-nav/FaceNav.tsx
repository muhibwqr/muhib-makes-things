import { useState, useEffect, useRef } from 'react';
import { useFaceNav } from './useFaceNav';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

interface FaceNavProps {
  debugMode?: boolean; // Pass true to see the wireframe
}

export default function FaceNav({ debugMode = false }: FaceNavProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const { gesture, isFaceDetected, error, videoRef, canvasRef } = useFaceNav({ enabled: isEnabled, debugMode });
  const navigate = useNavigate();
  const location = useLocation();
  
  // Cooldown Refs
  const lastActionTime = useRef(0);
  const lastNavTime = useRef(0);

  // --- ACTIONS ---
  useEffect(() => {
    if (!isEnabled || gesture === 'none') return;
    const now = Date.now();

    // Scroll Actions (Fast)
    if (now - lastActionTime.current > 50) {
      if (gesture === 'tongue_out') {
        window.scrollBy({ top: 50, behavior: 'smooth' });
        lastActionTime.current = now;
      } else if (gesture === 'smile') {
        window.scrollBy({ top: -50, behavior: 'smooth' });
        lastActionTime.current = now;
      }
    }

    // Navigation Actions (Slow / Debounced)
    // Tongue out (speed face) = Switch pages
    if (now - lastNavTime.current > 2000) {
      if (gesture === 'tongue_out') {
        // Cycle through pages: / -> /projects -> /updates -> /
        const isHome = location.pathname === '/';
        if (isHome) {
          navigate('/projects');
        } else if (location.pathname === '/projects') {
          navigate('/updates');
        } else {
          navigate('/');
        }
        lastNavTime.current = now;
      } else if (gesture === 'head_shake_left' || gesture === 'head_shake_right') {
         // Head shake also navigates
         const isHome = location.pathname === '/';
         if (isHome) {
           navigate('/projects');
         } else if (location.pathname === '/projects') {
           navigate('/updates');
         } else {
           navigate('/');
         }
         lastNavTime.current = now;
      }
    }
  }, [gesture, isEnabled, navigate, location.pathname]);

  // Handle Error (Camera Denied) - return null gracefully
  if (error && isEnabled) {
    return (
      <div className="fixed bottom-6 right-6 z-50 bg-red-500 text-white px-5 py-3 rounded-lg shadow-xl max-w-sm">
        <p className="text-sm font-bold mb-2">⚠️ {error}</p>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              setIsEnabled(false);
              // Reset after a moment to allow retry
              setTimeout(() => setIsEnabled(true), 500);
            }}
            className="text-xs underline hover:no-underline"
          >
            Retry
          </button>
          <button 
            onClick={() => setIsEnabled(false)}
            className="text-xs underline hover:no-underline ml-auto"
          >
            Close
          </button>
        </div>
        {error.includes('permission') && (
          <p className="text-xs mt-2 opacity-90">
            Tip: Check your browser's camera permissions in settings
          </p>
        )}
      </div>
    );
  }

  // --- UI: ENABLE BUTTON ---
  if (!isEnabled) {
    return (
      <>
        <motion.button 
          onClick={() => setIsEnabled(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 bg-black text-white px-5 py-3 rounded-full font-bold shadow-xl transition-all flex items-center gap-2 border border-gray-800 dark:bg-white dark:text-black dark:border-gray-200"
        >
          <span>👁️</span> Enable AI Nav
        </motion.button>
        {/* Pre-render video element so ref is available */}
        <video 
          ref={videoRef} 
          className="hidden" 
          playsInline 
          muted 
          autoPlay
          style={{ transform: 'scaleX(-1)' }}
        />
      </>
    );
  }

  // --- UI: ACTIVE HUD ---
  const statusConfig = {
    'none': { text: 'Scanning...', color: 'gray', emoji: '👀' },
    'tongue_out': { text: '👅 Scroll Down', color: 'green', emoji: '👅' },
    'smile': { text: '😊 Scroll Up', color: 'blue', emoji: '😊' },
    'head_shake_left': { text: '⬅️ Switch Page', color: 'purple', emoji: '⬅️' },
    'head_shake_right': { text: '➡️ Switch Page', color: 'purple', emoji: '➡️' }
  };

  const currentStatus = statusConfig[gesture] || statusConfig['none'];

  return (
    <>
      {/* 1. STATUS PILL (Top Center) - with framer-motion */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={gesture}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className={clsx(
              'flex items-center gap-4 px-6 py-3 rounded-full shadow-2xl backdrop-blur-md border transition-all duration-300',
              isFaceDetected 
                ? 'bg-white/90 dark:bg-neutral-900/90 border-green-500' 
                : 'bg-red-50/90 border-red-400',
              currentStatus.color === 'green' && 'border-green-500',
              currentStatus.color === 'blue' && 'border-blue-500',
              currentStatus.color === 'purple' && 'border-purple-500'
            )}
          >
            <div className={clsx(
              'w-3 h-3 rounded-full animate-pulse',
              isFaceDetected ? 'bg-green-500' : 'bg-red-500'
            )} />
            <span className="font-mono font-bold w-32 text-center text-sm text-gray-800 dark:text-gray-200">
              {currentStatus.text}
            </span>
            <button 
              onClick={() => setIsEnabled(false)} 
              className="ml-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs text-gray-500"
            >✕</button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2. DEBUG OVERLAY (Bottom Right - The "Cyberpunk" View) */}
      {debugMode && (
         <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           className="fixed bottom-4 right-4 z-40 w-64 h-48 rounded-xl overflow-hidden border-2 border-green-500/50 bg-black shadow-2xl"
         >
            <canvas ref={canvasRef} width={640} height={480} className="w-full h-full object-cover opacity-80" />
         </motion.div>
      )}

      {/* 3. HIDDEN VIDEO (Required for Logic) */}
      <video 
        ref={videoRef} 
        className="hidden" 
        playsInline 
        muted 
        autoPlay
        style={{ transform: 'scaleX(-1)' }} // Mirror for better UX
      />
    </>
  );
}
