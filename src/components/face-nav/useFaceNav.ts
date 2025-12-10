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
        const { FaceMesh } = await import('@mediapipe/face_mesh');
        const { Camera } = await import('@mediapipe/camera_utils');
        const { drawConnectors } = await import('@mediapipe/drawing_utils');
        const { FACEMESH_TESSELATION } = await import('@mediapipe/face_mesh');

        const faceMesh = new FaceMesh({
          locateFile: (file) => `https://unpkg.com/@mediapipe/face_mesh/${file}`,
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.4, // Lower confidence = Fails fast when you push friend out
        });

        faceMesh.onResults((results) => {
          if (!isActive) return;

          // Drawing Logic (The "Matrix" Effect)
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
                            color: '#00FF0040', // Semi-transparent Matrix Green
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

        if (videoRef.current) {
          const camera = new Camera(videoRef.current, {
            onFrame: async () => {
              if (videoRef.current) await faceMesh.send({ image: videoRef.current });
            },
            width: 640, height: 480
          });
          camera.start();
          cameraRef.current = camera;
        }
      } catch (err) {
        setError('Camera denied or API error');
        console.error(err);
      }
    };

    init();

    return () => { isActive = false; };
  }, [enabled, debugMode, processLandmarks]);

  return { gesture, isFaceDetected, error, videoRef, canvasRef };
};

