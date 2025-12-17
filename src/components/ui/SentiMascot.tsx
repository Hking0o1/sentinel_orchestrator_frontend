import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SentiMascotProps {
  className?: string;
}

export const SentiMascot = ({ className }: SentiMascotProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setShowTooltip(true);
    // Play "Excited" animation or speed up loop
    if (videoRef.current) videoRef.current.playbackRate = 1.5;
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowTooltip(false);
    if (videoRef.current) videoRef.current.playbackRate = 1.0;
  };

  return (
    <div 
      className={`fixed bottom-8 right-8 z-50 flex flex-col items-end ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Chat Bubble / Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="mb-4 mr-4 bg-white text-primary-dark p-3 rounded-2xl rounded-br-none shadow-xl border border-accent-gold max-w-[200px]"
          >
            <p className="text-sm font-semibold">
              👋 Hi, I'm Senti!
            </p>
            <p className="text-xs text-gray-600 mt-1">
              I'm monitoring your scans. Everything looks good!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Container */}
      <div 
        className="relative w-32 h-32 md:w-40 md:h-40 cursor-pointer transition-transform duration-300 hover:scale-110"
        onClick={() => alert("Senti says: 'Run a scan to see me work!'")}
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-accent-gold/20 blur-3xl rounded-full opacity-0 hover:opacity-100 transition-opacity duration-500"></div>

        {/* The Video */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-contain drop-shadow-2xl"
          // Transparent video source is ideal here
          src="/videos/idle_senti.mp4" 
        />
      </div>
    </div>
  );
};s