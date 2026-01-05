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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import './Dock.css';

export type DockItemData = {
  icon: React.ReactNode;
  label: React.ReactNode;
  onClick: () => void;
  className?: string;
  previewImage?: string;
  previewVideo?: string;
  previewAlt?: string;
  isDropdown?: boolean;
  dropdownItems?: Array<{
    icon: React.ReactNode;
    label: string;
    href: string;
    previewVideo?: string;
    previewImage?: string;
  }>;
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
  isDropdown?: boolean;
  dropdownItems?: Array<{
    icon: React.ReactNode;
    label: string;
    href: string;
    previewVideo?: string;
    previewImage?: string;
  }>;
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
  previewAlt,
  isDropdown,
  dropdownItems
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

  const dockItemContent = (
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
      onClick={!isDropdown ? onClick : undefined}
      className={`dock-item ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup={isDropdown ? "true" : "false"}
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
  );

  if (isDropdown && dropdownItems) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [hoveredItemIndex, setHoveredItemIndex] = useState<number | null>(null);

    return (
      <div 
        className="dock-item-wrapper"
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => {
          setIsDropdownOpen(false);
          setHoveredItemIndex(null);
        }}
      >
        {dockItemContent}
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 min-w-[160px] bg-popover border rounded-md shadow-lg p-1 z-50 backdrop-blur-xl"
            style={{ transformOrigin: 'bottom center' }}
          >
            {dropdownItems.map((item, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredItemIndex(idx)}
                onMouseLeave={() => setHoveredItemIndex(null)}
                className="relative"
              >
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent cursor-pointer relative overflow-hidden min-h-[36px]"
                >
                  <AnimatePresence mode="wait">
                    {hoveredItemIndex === idx && (item.previewVideo || item.previewImage) ? (
                      <motion.div
                        key="preview"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute inset-0 flex items-center justify-center w-full h-full"
                      >
                        {item.previewVideo ? (
                          <video
                            src={item.previewVideo}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover rounded-sm"
                          />
                        ) : item.previewImage ? (
                          <img
                            src={item.previewImage}
                            alt={item.label}
                            className="w-full h-full object-cover rounded-sm"
                          />
                        ) : null}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 w-full"
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </a>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="dock-item-wrapper">
      {dockItemContent}
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
            isDropdown={item.isDropdown}
            dropdownItems={item.dropdownItems}
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

