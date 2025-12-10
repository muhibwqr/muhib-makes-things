// src/components/face-nav/useFaceNav.ts
import { useState, useRef, useEffect, useCallback } from 'react';
import { calculateFaceMetrics } from './gesture-math';

export type GestureType = 'none' | 'tongue_out' | 'smile' | 'head_shake_left' | 'head_shake_right';

interface UseFaceNavProps {
  enabled: boolean;
  debugMode: boolean; // Toggles the "Green Mesh" visual
}

export const useFaceNav = ({ enabled, debugMode }: UseFaceNavProps) => {
  const [gesture, setGesture] = useState<GestureType>('none');
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [error, setError] = useState('');
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cameraRef = useRef<any>(null);

  const processLandmarks = useCallback((landmarks: any) => {
    const metrics = calculateFaceMetrics(landmarks);
    if (!metrics) return;

    const { mouthAspectRatio, normalizedMouthOpen, centerDelta } = metrics;

    // --- DETECTION LOGIC ---
    // 1. Head Shake (Navigation)
    if (Math.abs(centerDelta) > 0.2) {
      setGesture(centerDelta < 0 ? 'head_shake_left' : 'head_shake_right');
    } 
    // 2. Tongue Out (Scroll Down) - The "IShowSpeed"
    // High aspect ratio (tall) AND open relative to face height
    else if (mouthAspectRatio > 0.4 && normalizedMouthOpen > 0.08) {
      setGesture('tongue_out');
    } 
    // 3. Smile (Scroll Up)
    // Low aspect ratio (wide) AND mostly closed relative to face height
    else if (mouthAspectRatio < 0.3 && normalizedMouthOpen < 0.04) {
      setGesture('smile');
    } 
    else {
      setGesture('none');
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      if (cameraRef.current) cameraRef.current.stop();
      return;
    }

    let isActive = true;

    const init = async () => {
      try {
        // Check if camera is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setError('Camera not supported. Please use HTTPS or a modern browser.');
          return;
        }

        // Check if we're on HTTPS (required for camera in most browsers)
        if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
          setError('Camera requires HTTPS. Please use a secure connection.');
          return;
        }

        // Check camera permission status (non-intrusive)
        try {
          const permissionStatus = await navigator.permissions?.query({ name: 'camera' as PermissionName });
          if (permissionStatus?.state === 'denied') {
            setError('Camera permission denied. Please allow camera access in your browser settings.');
            return;
          }
        } catch (permCheckErr) {
          // Permission API not supported or other error - continue anyway
          console.log('Permission API check failed, continuing...', permCheckErr);
        }

        // Load MediaPipe modules (dynamic imports to avoid SSR errors)
        const { FaceMesh } = await import('@mediapipe/face_mesh');
        const { Camera } = await import('@mediapipe/camera_utils');
        const { drawConnectors } = await import('@mediapipe/drawing_utils');
        const { FACEMESH_TESSELATION } = await import('@mediapipe/face_mesh');

        // Initialize FaceMesh with local files from public folder
        // This avoids CDN issues and works in production
        const faceMesh = new FaceMesh({
          locateFile: (file: string) => {
            // Use local files from public/mediapipe folder
            // This works in both dev and production
            return `/mediapipe/${file}`;
          },
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.4, // Lower confidence = Fails fast when you push friend out
        });

        faceMesh.onResults((results) => {
          if (!isActive) return;

          // Drawing Logic (The "Matrix" Effect) - Cyberpunk Green
          if (debugMode && canvasRef.current && videoRef.current) {
             const canvas = canvasRef.current;
             const ctx = canvas.getContext('2d');
             if (ctx) {
                ctx.save();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Only draw if we have results
                if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
                    for (const landmarks of results.multiFaceLandmarks) {
                        drawConnectors(ctx, landmarks, FACEMESH_TESSELATION, { 
                            color: '#00FF00', // Cyberpunk Green
                            lineWidth: 1 
                        });
                    }
                }
                ctx.restore();
             }
          }

          if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            setIsFaceDetected(true);
            processLandmarks(results.multiFaceLandmarks[0]);
          } else {
            setIsFaceDetected(false);
            setGesture('none');
          }
        });

        // Wait a bit for video element to be ready
        const initCamera = () => {
          if (!videoRef.current) {
            setError('Video element not found');
            return;
          }

          // Ensure video element has proper attributes
          videoRef.current.setAttribute('autoplay', '');
          videoRef.current.setAttribute('playsinline', '');
          videoRef.current.setAttribute('muted', '');
          
          try {
            const camera = new Camera(videoRef.current, {
              onFrame: async () => {
                if (videoRef.current && isActive) {
                  await faceMesh.send({ image: videoRef.current });
                }
              },
              width: 640, 
              height: 480
            });
            
            camera.start().catch((err: any) => {
              console.error('Camera start error:', err);
              if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setError('Camera permission denied. Please allow camera access.');
              } else if (err.name === 'NotFoundError') {
                setError('No camera found. Please connect a camera.');
              } else {
                setError(`Camera error: ${err.message || 'Failed to start camera'}`);
              }
            });
            
            cameraRef.current = camera;
          } catch (err: any) {
            console.error('Camera initialization error:', err);
            setError(`Failed to initialize camera: ${err.message || 'Unknown error'}`);
          }
        };

        // Small delay to ensure DOM is ready
        setTimeout(initCamera, 100);
      } catch (err: any) {
        console.error('Initialization error:', err);
        if (err.message?.includes('Failed to fetch') || err.message?.includes('network')) {
          setError('Failed to load MediaPipe. Check your internet connection.');
        } else {
          setError(`Error: ${err.message || 'Unknown error occurred'}`);
        }
      }
    };

    init();

    return () => { isActive = false; };
  }, [enabled, debugMode, processLandmarks]);

  return { gesture, isFaceDetected, error, videoRef, canvasRef };
};
