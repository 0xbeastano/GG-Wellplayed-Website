import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export const TiltCard: React.FC<TiltCardProps> = ({ children, className = "", glowColor = "rgba(0, 217, 255, 0.3)" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate percentage position
    const xPct = x / rect.width;
    const yPct = y / rect.height;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Rotation calculation (Max 15 degrees)
    const rotateXValue = ((y - centerY) / centerY) * -15; 
    const rotateYValue = ((x - centerX) / centerX) * 15;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
    setGlarePosition({ x: xPct * 100, y: yPct * 100 });
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setOpacity(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative preserve-3d transition-transform duration-200 ease-out will-change-transform ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1, 1, 1)`
      }}
    >
      <div style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>
      
      {/* Holographic Glare Overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[inherit] z-50 mix-blend-overlay transition-opacity duration-300"
        style={{
          opacity: opacity,
          background: `
            radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.4) 0%, transparent 60%),
            linear-gradient(105deg, transparent 40%, ${glowColor} 45%, rgba(255,255,255,0.2) 50%, ${glowColor} 55%, transparent 60%)
          `
        }}
      />
      
      {/* Border Glow */}
      <div 
        className="absolute inset-0 rounded-[inherit] z-40 opacity-0 transition-opacity duration-300"
        style={{
          opacity: opacity * 0.5,
          boxShadow: `0 0 20px ${glowColor}`
        }}
      />
    </motion.div>
  );
};