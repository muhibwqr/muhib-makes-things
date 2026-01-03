import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence
} from 'framer-motion';
import React, { Children, cloneElement, useEffect, useRef, useState } from 'react';
import './Dock.css';

export type DockItemData = {
  icon: React.ReactNode;
  label: React.ReactNode;
  onClick: () => void;
  className?: string;
  previewImage?: string;
  previewVideo?: string;
  previewAlt?: string;
};

export type DockProps = {
  items: DockItemData[];
  className?: string;
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
  dockHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
};

type DockItemProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  mouseX: MotionValue<number>;
  spring: SpringOptions;
  distance: number;
  baseItemSize: number;
  magnification: number;
  previewImage?: string;
  previewVideo?: string;
  previewAlt?: string;
};

function DockItem({
  children,
  className = '',
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
  previewImage,
  previewVideo,
  previewAlt
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, val => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize
    };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
  const size = useSpring(targetSize, spring);

  return (
    <div className="dock-item-wrapper">
      <motion.div
        ref={ref}
        style={{
          width: size,
          height: size
        }}
        onHoverStart={() => isHovered.set(1)}
        onHoverEnd={() => isHovered.set(0)}
        onFocus={() => isHovered.set(1)}
        onBlur={() => isHovered.set(0)}
        onClick={onClick}
        className={`dock-item ${className}`}
        tabIndex={0}
        role="button"
        aria-haspopup="true"
      >
        {Children.map(children, child =>
          React.isValidElement(child)
            ? cloneElement(child as React.ReactElement<{ 
                isHovered?: MotionValue<number>;
                previewImage?: string;
                previewVideo?: string;
                previewAlt?: string;
              }>, { 
                isHovered,
                previewImage,
                previewVideo,
                previewAlt
              })
            : child
        )}
      </motion.div>
    </div>
  );
}

type DockLabelProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
};

function DockLabel({ children, className = '', isHovered }: DockLabelProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on('change', latest => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`dock-label ${className}`}
          role="tooltip"
          style={{ x: '-50%' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type DockIconProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
  previewImage?: string;
  previewVideo?: string;
  previewAlt?: string;
};

function DockIcon({ children, className = '', isHovered, previewImage, previewVideo, previewAlt }: DockIconProps) {
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      setShowPreview(false);
      return;
    }
    const unsubscribe = isHovered.on('change', latest => {
      if (previewImage || previewVideo) {
        setShowPreview(latest === 1);
      } else {
        setShowPreview(false);
      }
    });
    return () => unsubscribe();
  }, [isHovered, previewImage, previewVideo]);

  return (
    <div className={`dock-icon ${className}`}>
      {showPreview && (previewImage || previewVideo) ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={previewVideo ? 'video' : 'image'}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="dock-icon-preview"
          >
            {previewVideo ? (
              <video
                src={previewVideo}
                className="dock-icon-preview-media"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : previewImage ? (
              <img 
                src={previewImage} 
                alt={previewAlt || 'Preview'} 
                className="dock-icon-preview-media"
              />
            ) : null}
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}

export default function Dock({
  items,
  className = '',
  spring = { mass: 0.2, stiffness: 100, damping: 20 },
  magnification = 70,
  distance = 2000,
  panelHeight = 69,
  dockHeight = 256,
  baseItemSize = 50
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={containerRef}
      className="dock-outer"
      onMouseLeave={() => {
        mouseX.set(Infinity);
      }}
    >
      <motion.div
        onMouseMove={({ pageX }) => {
          mouseX.set(pageX);
        }}
        className={`dock-panel ${className}`}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            onClick={item.onClick}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
            previewImage={item.previewImage}
            previewVideo={item.previewVideo}
            previewAlt={item.previewAlt}
          >
            <DockIcon 
              previewImage={item.previewImage}
              previewVideo={item.previewVideo}
              previewAlt={item.previewAlt}
            >
              {item.icon}
            </DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </div>
  );
}

