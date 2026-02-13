import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';

type Particle = {
  id: number;
  size: number;
  x: number;
  y: number;
  z: number;
  delay: number;
};

const generateParticles = (count: number): Particle[] => {
  return new Array(count).fill(null).map((_, index) => ({
    id: index,
    size: Math.random() * 6 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    z: Math.random() * 200 - 100,
    delay: Math.random() * 6,
  }));
};

const ParticleFieldComponent = () => {
  const particles = useMemo(() => generateParticles(60), []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-white/10 backdrop-blur-sm"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            filter: 'blur(0.5px)',
            perspective: '800px',
            transform: `translateZ(${particle.z}px)`
          }}
          animate={{
            y: [0, -40, -80],
            opacity: [0.2, 0.7, 0],
            scale: [0.8, 1.3, 0.7],
          }}
          transition={{
            repeat: Infinity,
            duration: 12,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export const ParticleField = memo(ParticleFieldComponent);
