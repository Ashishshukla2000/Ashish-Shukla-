import React, { useRef, useState } from 'react';
import { motion, useSpring } from 'motion/react';

interface GlassCard3DProps {
  children: React.ReactNode;
  className?: string;
  isDark?: boolean;
  glowColor?: string;
  depth?: number;
  id?: string;
  onClick?: () => void;
  hoverScale?: number;
}

export const GlassCard3D: React.FC<GlassCard3DProps> = ({
  children,
  className = '',
  isDark = true,
  glowColor = 'rgba(6, 182, 212, 0.15)', // cyan glow default
  depth = 12,
  id,
  onClick,
  hoverScale = 1.015,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  // Spring physics for buttery smooth 3D tilt
  const springConfig = { stiffness: 350, damping: 25 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const translateZ = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -depth;
    const rY = ((x - centerX) / centerX) * depth;

    rotateX.set(rX);
    rotateY.set(rY);
    translateZ.set(15);

    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    translateZ.set(0);
  };

  return (
    <div
      style={{ perspective: 1200 }}
      className="relative rounded-2xl"
    >
      <motion.div
        ref={cardRef}
        id={id}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: hoverScale }}
        transition={{ duration: 0.2 }}
        className={`relative rounded-2xl transition-shadow duration-300 overflow-hidden ${
          isDark ? 'glass-panel-dark text-slate-100' : 'glass-panel-light text-slate-800'
        } ${className}`}
      >
        {/* Dynamic 3D Glare & Specular Reflection Layer */}
        {isHovered && (
          <div
            className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 280px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, ${
                isDark ? '0.14' : '0.45'
              }), transparent 75%)`,
            }}
          />
        )}

        {/* Outer ambient glow halo based on card's theme */}
        <div
          className="absolute -inset-1 rounded-2xl pointer-events-none -z-10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: glowColor,
          }}
        />

        {/* Top curved glossy glass sheen */}
        <div className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none bg-gradient-to-b from-white/10 to-transparent z-0" />

        {/* Content container elevated in 3D */}
        <div className="relative z-10">{children}</div>
      </motion.div>
    </div>
  );
};
