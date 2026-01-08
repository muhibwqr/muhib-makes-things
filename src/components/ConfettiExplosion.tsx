import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SpriteProps {
  dimensions: number;
  color: string;
  angle: number;
  length: number;
  duration: number;
  speed: number;
  gravity: number;
  index: number;
}

const Sprite = ({ dimensions, color, angle, length, duration, speed, gravity, index }: SpriteProps) => {
  const spriteRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!spriteRef.current) return;

    const sprite = spriteRef.current;
    const halfDuration = duration / 2;
    const rotationX = 720 + Math.random() * 720;
    const rotationZ = 720 + Math.random() * 720;
    const velocity = (100 + Math.random() * 250) * speed;
    const gravityValue = 800 * gravity;
    const angleDeg = (angle * 180) / Math.PI;
    const friction = 0.1 + Math.random() * 0.05;

    // Initial position
    const startX = Math.cos(angle) * length;
    const startY = Math.sin(angle) * length;

    sprite.style.backgroundColor = color;
    sprite.style.width = `${dimensions}px`;
    sprite.style.height = `${dimensions}px`;
    sprite.style.position = "absolute";
    sprite.style.left = "50%";
    sprite.style.top = "50%";
    sprite.style.transform = `translate(${startX - dimensions/2}px, ${startY - dimensions/2}px)`;
    sprite.style.opacity = "0";
    sprite.style.visibility = "hidden";

    // Animation using requestAnimationFrame for physics
    let startTime: number | null = null;
    let opacityPhase = 0; // 0 = fade out, 1 = visible, 2 = fade out again

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = (currentTime - startTime) / 1000; // Convert to seconds

      if (elapsed < halfDuration) {
        // Fade out phase
        opacityPhase = 0;
        const progress = elapsed / halfDuration;
        sprite.style.opacity = String(1 - progress);
      } else if (elapsed < duration) {
        // Visible and physics phase
        if (opacityPhase === 0) {
          sprite.style.visibility = "visible";
          sprite.style.opacity = "1";
          setIsVisible(true);
          opacityPhase = 1;
        }

        const physicsTime = elapsed - halfDuration;
        const physicsDuration = duration - halfDuration;
        const progress = physicsTime / physicsDuration;

        // Physics calculations
        const vx = velocity * Math.cos(angle);
        const vy = velocity * Math.sin(angle) - gravityValue * physicsTime;
        const x = vx * physicsTime * (1 - friction * progress);
        const y = vy * physicsTime + 0.5 * gravityValue * physicsTime * physicsTime;

        const rotationXValue = -rotationX * progress;
        const rotationZValue = rotationZ * progress;

        sprite.style.transform = `translate(${startX + x - dimensions/2}px, ${startY + y - dimensions/2}px) rotateX(${rotationXValue}deg) rotateZ(${rotationZValue}deg)`;
      } else {
        // Final fade out
        if (opacityPhase === 1) {
          opacityPhase = 2;
        }
        const fadeProgress = (elapsed - duration) / 1.25;
        if (fadeProgress < 1) {
          sprite.style.opacity = String(1 - fadeProgress);
        } else {
          setIsVisible(false);
          return;
        }
      }

      if (elapsed < duration + 1.25) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [dimensions, color, angle, length, duration, speed, gravity]);

  return (
    <div
      ref={spriteRef}
      className="sprite absolute rounded-sm"
      style={{
        backgroundColor: color,
        width: `${dimensions}px`,
        height: `${dimensions}px`,
        transformOrigin: "center center",
        position: "absolute",
      }}
    />
  );
};

interface SpriteContainerProps {
  spriteCount: number;
  emitterSize: number;
  spriteSizes: { min: number; max: number };
  speed: number;
  gravity: number;
  position: { x: number; y: number };
  onComplete?: () => void;
}

const SpriteContainer = ({ 
  spriteCount, 
  emitterSize, 
  spriteSizes, 
  speed, 
  gravity,
  position,
  onComplete 
}: SpriteContainerProps) => {
  const [sprites, setSprites] = useState<Array<{
    dimensions: number;
    color: string;
    angle: number;
    length: number;
    duration: number;
  }>>([]);

  useEffect(() => {
    const newSprites = [];
    for (let i = 0; i < spriteCount; i++) {
      const dimensions = spriteSizes.min + Math.random() * (spriteSizes.max - spriteSizes.min);
      const angle = (0.65 + Math.random() * 0.2) * Math.PI * 2;
      const length = Math.random() * (emitterSize / 2 - dimensions / 2);
      const duration = 3 + Math.random();
      
      const r = 30 + Math.random() * 225;
      const g = 30 + Math.random() * 200;
      const b = 30 + Math.random() * 200;
      const color = `rgb(${r}, ${g}, ${b})`;

      newSprites.push({ dimensions, angle, length, duration, color });
    }
    setSprites(newSprites);

    // Call onComplete after all animations finish
    const maxDuration = Math.max(...newSprites.map(s => s.duration + 1.25));
    const timer = setTimeout(() => {
      onComplete?.();
    }, maxDuration * 1000);

    return () => clearTimeout(timer);
  }, [spriteCount, emitterSize, spriteSizes, onComplete]);

  return (
    <div
      className="sprite-container absolute"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -50%)",
      }}
    >
      {sprites.map((sprite, index) => (
        <Sprite
          key={index}
          dimensions={sprite.dimensions}
          color={sprite.color}
          angle={sprite.angle}
          length={sprite.length}
          duration={sprite.duration}
          speed={speed}
          gravity={gravity}
          index={index}
        />
      ))}
    </div>
  );
};

interface ConfettiExplosionProps {
  size?: number;
  explosionCount?: number;
  spriteCount?: number;
  spriteSizes?: { min: number; max: number };
  speed?: number;
  gravity?: number;
  onComplete?: () => void;
}

export const ConfettiExplosion = forwardRef<{ explode: (delay?: number) => void }, ConfettiExplosionProps>(({
  size = 20,
  explosionCount = 5,
  spriteCount = 40,
  spriteSizes = { min: 6, max: 8 },
  speed = 2.4,
  gravity = 0.7,
  onComplete,
}, ref) => {
  const emitterRef = useRef<HTMLDivElement>(null);
  const [explosions, setExplosions] = useState<Array<{ id: number; position: { x: number; y: number } }>>([]);
  const [completedExplosions, setCompletedExplosions] = useState(0);

  const explode = (delay: number = 250) => {
    if (!emitterRef.current) return;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let intervalCount = 0;
    const interval = setInterval(() => {
      if (intervalCount < explosionCount) {
        // Distribute explosions around all edges of the screen
        let x: number, y: number;
        const side = intervalCount % 4; // 0: top, 1: right, 2: bottom, 3: left
        
        switch (side) {
          case 0: // Top edge
            x = Math.random() * windowWidth;
            y = 0;
            break;
          case 1: // Right edge
            x = windowWidth;
            y = Math.random() * windowHeight;
            break;
          case 2: // Bottom edge
            x = Math.random() * windowWidth;
            y = windowHeight;
            break;
          case 3: // Left edge
            x = 0;
            y = Math.random() * windowHeight;
            break;
          default:
            x = windowWidth / 2;
            y = windowHeight / 2;
        }
        
        // Add some randomness to spread them out more
        if (side === 0 || side === 2) {
          x += (Math.random() - 0.5) * 100;
        } else {
          y += (Math.random() - 0.5) * 100;
        }

        setExplosions((prev) => [
          ...prev,
          {
            id: Date.now() + intervalCount,
            position: { x, y },
          },
        ]);
        intervalCount++;
      } else {
        clearInterval(interval);
      }
    }, delay);
  };

  useImperativeHandle(ref, () => ({
    explode,
  }));

  const handleExplosionComplete = () => {
    setCompletedExplosions((prev) => {
      const newCount = prev + 1;
      if (newCount >= explosionCount) {
        onComplete?.();
      }
      return newCount;
    });
  };

  return (
    <div className="explosion-wrapper fixed inset-0 pointer-events-none z-[9998]">
      <div 
        ref={emitterRef} 
        className="emitter absolute top-1/2 left-1/2 w-0 h-0"
        style={{
          transform: 'translate(-50%, -50%)',
        }}
      />
      {explosions.map((explosion) => (
        <SpriteContainer
          key={explosion.id}
          spriteCount={spriteCount}
          spriteSizes={spriteSizes}
          emitterSize={size}
          speed={speed}
          gravity={gravity}
          position={explosion.position}
          onComplete={handleExplosionComplete}
        />
      ))}
    </div>
  );
});

ConfettiExplosion.displayName = "ConfettiExplosion";

// Hook to use the explosion
export const useConfettiExplosion = () => {
  const explosionRef = useRef<{ explode: (delay?: number) => void }>(null);

  const trigger = (delay: number = 250) => {
    if (explosionRef.current) {
      explosionRef.current.explode(delay);
    }
  };

  return { explosionRef, trigger };
};

