import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ParticleField } from './ParticleField';

export const GameLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <ParticleField />
      <motion.div
        className="pointer-events-none fixed inset-0 z-20 bg-gradient-to-b from-white/5 via-transparent to-black/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />
      <div className="relative z-30 mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 pb-20 pt-12 md:px-10 lg:px-16">
        {children}
      </div>
    </div>
  );
};
