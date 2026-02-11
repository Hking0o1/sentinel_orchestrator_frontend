import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SentiMascotProps {
  className?: string;
}

export const SentiMascot = ({ className }: SentiMascotProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
    if (videoRef.current) videoRef.current.playbackRate = 1.35;
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    if (videoRef.current) videoRef.current.playbackRate = 1.0;
  };

  return (
    <div
      className={`fixed bottom-8 right-8 z-50 flex flex-col items-end ${className ?? ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.92 }}
            className="mb-3 mr-3 max-w-[220px] rounded-2xl rounded-br-none border border-accent-gold bg-white p-3 text-primary-dark shadow-xl"
          >
            <p className="text-sm font-semibold">Hi, I am Senti.</p>
            <p className="mt-1 text-xs text-gray-600">
              Monitoring your scans and surfacing high-priority risks.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="relative h-28 w-28 cursor-pointer transition-transform duration-300 hover:scale-110 md:h-36 md:w-36"
        aria-label="Senti mascot"
      >
        <div className="absolute inset-0 rounded-full bg-accent-gold/20 blur-3xl opacity-0 transition-opacity duration-500 hover:opacity-100" />
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-contain drop-shadow-2xl"
          src="/videos/idel_senti.mp4"
        />
      </div>
    </div>
  );
};
