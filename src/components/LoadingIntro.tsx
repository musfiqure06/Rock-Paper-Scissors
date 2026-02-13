import { motion } from 'framer-motion';

export const LoadingIntro = ({ onComplete }: { onComplete: () => void }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 1.8, duration: 0.6, ease: 'easeInOut' }}
      onAnimationComplete={onComplete}
    >
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <motion.div
          className="font-orbitron text-4xl uppercase tracking-[0.6em] text-white"
          animate={{
            textShadow: [
              '0 0 12px rgba(93,242,255,0.3)',
              '0 0 32px rgba(93,242,255,0.7)',
              '0 0 12px rgba(93,242,255,0.3)',
            ],
          }}
          transition={{ repeat: Infinity, duration: 1.6 }}
        >
          Musfiqure Rahman
        </motion.div>
        <motion.div
          className="h-[2px] w-40 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
        <motion.span
          className="text-sm uppercase tracking-[0.4em] text-white/70"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
        >
          Initializing arena
        </motion.span>
      </motion.div>
    </motion.div>
  );
};
