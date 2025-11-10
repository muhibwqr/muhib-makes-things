import { CSSProperties, useEffect, useRef } from "react";

export interface GhostCursorProps {
  color?: string;
  brightness?: number;
  edgeIntensity?: number;
  trailLength?: number;
  inertia?: number;
  grainIntensity?: number;
  bloomStrength?: number;
  bloomRadius?: number;
  bloomThreshold?: number;
  fadeDelayMs?: number;
  fadeDurationMs?: number;
  haloColor?: string;
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_PROPS: Required<Omit<GhostCursorProps, "className" | "style">> = {
  color: "#FFFFFF",
  brightness: 1,
  edgeIntensity: 0.2,
  trailLength: 40,
  inertia: 0.4,
  grainIntensity: 0.04,
  bloomStrength: 0.1,
  bloomRadius: 0.9,
  bloomThreshold: 0.05,
  fadeDelayMs: 1200,
  fadeDurationMs: 1200,
  haloColor: "#B19EEF"
};

export default function GhostCursor({
  color = DEFAULT_PROPS.color,
  brightness = DEFAULT_PROPS.brightness,
  edgeIntensity = DEFAULT_PROPS.edgeIntensity,
  trailLength = DEFAULT_PROPS.trailLength,
  inertia = DEFAULT_PROPS.inertia,
  grainIntensity = DEFAULT_PROPS.grainIntensity,
  bloomStrength = DEFAULT_PROPS.bloomStrength,
  bloomRadius = DEFAULT_PROPS.bloomRadius,
  bloomThreshold = DEFAULT_PROPS.bloomThreshold,
  fadeDelayMs = DEFAULT_PROPS.fadeDelayMs,
  fadeDurationMs = DEFAULT_PROPS.fadeDurationMs,
  haloColor = DEFAULT_PROPS.haloColor,
  className,
  style
}: GhostCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = rect ? rect.width : window.innerWidth;
      height = rect ? rect.height : window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    const pointer = { x: width / 2, y: height / 2 };
    const target = { x: width / 2, y: height / 2 };
    const trail: Array<{ x: number; y: number }> = [];
    let lastMove = performance.now();

    const handleMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      target.x = event.clientX - rect.left;
      target.y = event.clientY - rect.top;
      lastMove = performance.now();
    };

    const handleLeave = () => {
      lastMove = performance.now();
    };

    const render = () => {
      const now = performance.now();
      pointer.x += (target.x - pointer.x) * (1 - inertia);
      pointer.y += (target.y - pointer.y) * (1 - inertia);

      trail.unshift({ x: pointer.x, y: pointer.y });
      if (trail.length > trailLength) {
        trail.pop();
      }

      ctx.clearRect(0, 0, width, height);

      const idleTime = now - lastMove;
      const fade = idleTime <= fadeDelayMs
        ? 1
        : Math.max(
            0,
            1 - (idleTime - fadeDelayMs) / Math.max(1, fadeDurationMs)
          );

      if (fade > 0) {
        trail.forEach((point, index) => {
          const t = index / Math.max(1, trailLength - 1);
          const intensity = (1 - t) * brightness * fade;
          if (intensity <= 0) return;

          const radius = 24 + (1 - t) * 32 * bloomRadius;
          const gradient = ctx.createRadialGradient(
            point.x,
            point.y,
            0,
            point.x,
            point.y,
            radius
          );
          const baseAlpha = Math.max(
            bloomThreshold,
            intensity * 0.25 * (1 + bloomStrength)
          );
          gradient.addColorStop(0, hexToRgba(color, baseAlpha));
          gradient.addColorStop(
            Math.min(0.35 + bloomStrength * 0.5, 0.9),
            hexToRgba(color, baseAlpha * 0.6)
          );
          gradient.addColorStop(
            Math.min(0.85 + bloomStrength * 0.25, 1),
            hexToRgba(haloColor, baseAlpha * 0.45)
          );
          gradient.addColorStop(1, hexToRgba(haloColor, 0));

          ctx.save();
          ctx.globalCompositeOperation = "source-over";
          ctx.shadowColor = hexToRgba(haloColor, baseAlpha * 0.8);
          ctx.shadowBlur = radius * 0.65;
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          if (edgeIntensity > 0) {
            ctx.globalCompositeOperation = "source-over";
            ctx.strokeStyle = hexToRgba(
              haloColor,
              baseAlpha * Math.max(0.15, edgeIntensity)
            );
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(point.x, point.y, radius * 0.6, 0, Math.PI * 2);
            ctx.stroke();
          }
        });

        if (grainIntensity > 0) {
          ctx.globalCompositeOperation = "overlay";
          const grainCount = Math.floor(
            (width * height) * 0.0001 * grainIntensity * 200
          );
          for (let i = 0; i < grainCount; i++) {
            const gx = Math.random() * width;
            const gy = Math.random() * height;
            const alpha = Math.random() * 0.15 * grainIntensity;
            ctx.fillStyle = hexToRgba(color, alpha);
            ctx.fillRect(gx, gy, 1, 1);
          }
        }
      }

      animationRef.current = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);
    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current != null) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, [
    color,
    brightness,
    edgeIntensity,
    trailLength,
    inertia,
    grainIntensity,
    bloomStrength,
    bloomRadius,
    bloomThreshold,
    fadeDelayMs,
    fadeDurationMs
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        mixBlendMode: "normal",
        ...style
      }}
    />
  );
}

function hexToRgba(hex: string, alpha: number) {
  let normalized = hex.replace("#", "");
  if (normalized.length === 3) {
    normalized = normalized
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const intVal = parseInt(normalized, 16);
  const r = (intVal >> 16) & 255;
  const g = (intVal >> 8) & 255;
  const b = intVal & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

