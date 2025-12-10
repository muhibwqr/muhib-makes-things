import { useState, useEffect, useRef } from 'react';
import { useFaceNav } from './useFaceNav';
import { useNavigate, useLocation } from 'react-router-dom';

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

    // Scroll Actions (Fast) - Only smile now
    if (now - lastActionTime.current > 50) {
      if (gesture === 'smile') {
        window.scrollBy({ top: -40, behavior: 'smooth' });
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

  // Handle Error (Camera Denied)
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
        <button 
          onClick={() => setIsEnabled(true)}
          className="fixed bottom-6 right-6 z-50 bg-black text-white px-5 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition-all flex items-center gap-2 border border-gray-800 dark:bg-white dark:text-black dark:border-gray-200"
        >
          <span>👁️</span> Enable AI Nav
        </button>
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
  const statusText = {
    'none': 'Scanning...',
    'tongue_out': '👅 Switch Page',
    'smile': '😊 Scroll Up',
    'head_shake_left': '⬅️ Switch Page',
    'head_shake_right': '➡️ Switch Page'
  }[gesture] || 'Scanning...';

  return (
    <>
      {/* 1. STATUS PILL (Top Center) */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
        <div className={`
          flex items-center gap-4 px-6 py-3 rounded-full shadow-2xl backdrop-blur-md border transition-all duration-300
          ${isFaceDetected ? 'bg-white/90 border-green-500 dark:bg-neutral-900/90' : 'bg-red-50/90 border-red-400'}
        `}>
          <div className={`w-3 h-3 rounded-full animate-pulse ${isFaceDetected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="font-mono font-bold w-32 text-center text-sm text-gray-800 dark:text-gray-200">{statusText}</span>
          <button 
            onClick={() => setIsEnabled(false)} 
            className="ml-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs text-gray-500"
          >✕</button>
        </div>
      </div>

      {/* 2. DEBUG OVERLAY (Bottom Right - The "Cyberpunk" View) */}
      {debugMode && (
         <div className="fixed bottom-4 right-4 z-40 w-64 h-48 rounded-xl overflow-hidden border-2 border-green-500/50 bg-black shadow-2xl">
            <canvas ref={canvasRef} width={640} height={480} className="w-full h-full object-cover opacity-80" />
         </div>
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

