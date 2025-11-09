import { useEffect, useRef } from 'react';

interface DitherProps {
  waveColor?: [number, number, number];
  disableAnimation?: boolean;
  enableMouseInteraction?: boolean;
  mouseRadius?: number;
  colorNum?: number;
  waveAmplitude?: number;
  waveFrequency?: number;
  waveSpeed?: number;
}

export default function Dither({
  waveColor = [0.5, 0.5, 0.5],
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 0.3,
  colorNum = 4,
  waveAmplitude = 0.3,
  waveFrequency = 3,
  waveSpeed = 0.05
}: DitherProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      // Use viewport dimensions for full screen background
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    
    let time = 0;
    let mouseX = 0.5;
    let mouseY = 0.5;
    let needsRedraw = true;

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width;
      mouseY = (e.clientY - rect.top) / rect.height;
    };

    const handleResize = () => {
      updateCanvasSize();
      needsRedraw = true;
    };

    window.addEventListener('resize', handleResize);

    if (enableMouseInteraction) {
      canvas.addEventListener('mousemove', handleMouseMove);
    }

    const draw = () => {
      if (disableAnimation && time > 0 && !needsRedraw) return;

      const width = canvas.width;
      const height = canvas.height;
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;
      needsRedraw = false;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const index = (y * width + x) * 4;
          
          const nx = x / width;
          const ny = y / height;
          
          // Wave pattern
          let wave = Math.sin((nx * waveFrequency + time * waveSpeed) * Math.PI * 2) * waveAmplitude;
          wave += Math.sin((ny * waveFrequency + time * waveSpeed * 0.7) * Math.PI * 2) * waveAmplitude;
          
          // Mouse interaction
          if (enableMouseInteraction) {
            const dx = nx - mouseX;
            const dy = ny - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const influence = Math.max(0, 1 - dist / mouseRadius);
            wave += influence * waveAmplitude * 0.5;
          }
          
          // Base color with wave
          let r = waveColor[0] + wave;
          let g = waveColor[1] + wave;
          let b = waveColor[2] + wave;
          
          // Clamp values
          r = Math.max(0, Math.min(1, r));
          g = Math.max(0, Math.min(1, g));
          b = Math.max(0, Math.min(1, b));
          
          // Dithering - quantize to colorNum levels
          r = Math.floor(r * (colorNum - 1)) / (colorNum - 1);
          g = Math.floor(g * (colorNum - 1)) / (colorNum - 1);
          b = Math.floor(b * (colorNum - 1)) / (colorNum - 1);
          
          data[index] = r * 255;
          data[index + 1] = g * 255;
          data[index + 2] = b * 255;
          data[index + 3] = 255;
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      
      if (!disableAnimation) {
        time += 0.01;
        animationFrameRef.current = requestAnimationFrame(draw);
      }
    };

    // Initial draw
    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (enableMouseInteraction) {
        canvas.removeEventListener('mousemove', handleMouseMove);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [waveColor, disableAnimation, enableMouseInteraction, mouseRadius, colorNum, waveAmplitude, waveFrequency, waveSpeed]);

  return (
    <canvas
      ref={canvasRef}
      style={{ 
        width: '100vw', 
        height: '100vh', 
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 0
      }}
    />
  );
}

