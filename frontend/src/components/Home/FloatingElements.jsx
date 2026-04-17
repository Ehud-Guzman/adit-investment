import { useMemo } from 'react';
import { motion } from 'framer-motion';

const BLOB_COUNT = 15;

const FloatingElements = () => {
  const blobs = useMemo(() =>
    Array.from({ length: BLOB_COUNT }, (_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      width: Math.random() * 6 + 4,
      height: Math.random() * 6 + 4,
      opacity: Math.random() * 0.2 + 0.1,
      driftY: Math.random() * 40 - 20,
      driftX: Math.random() * 40 - 20,
      duration: Math.random() * 15 + 10,
    })),
  []);

  return (
    <>
      {/* ✨ Soft-floating blurred background dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {blobs.map((b, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-primary/10 to-accent/10"
            style={{
              left: `${b.left}%`,
              top: `${b.top}%`,
              width: `${b.width}rem`,
              height: `${b.height}rem`,
              opacity: b.opacity,
            }}
            animate={{
              y: [0, b.driftY],
              x: [0, b.driftX],
            }}
            transition={{
              duration: b.duration,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* 🌐 Glowing gradient blobs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl opacity-10"
        animate={{ y: [0, 40, 0], x: [0, 20, 0] }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-accent/20 to-secondary/20 blur-3xl opacity-10"
        animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
        transition={{
          duration: 20,
          delay: 5,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
      />
    </>
  );
};

export default FloatingElements;
