import { AnimatePresence, motion } from 'framer-motion';
import type { TargetAndTransition, Target } from 'framer-motion';

const resultConfig: Record<
  'win' | 'loss' | 'draw',
  {
    label: string;
    description: string;
    className: string;
    animation: TargetAndTransition;
    secondaryAnimation?: TargetAndTransition;
  }
> = {
  win: {
    label: 'Victory',
    description: 'You outsmarted the arena AI',
    className:
      'text-emerald-300 drop-shadow-[0_0_30px_rgba(16,185,129,0.7)]',
    animation: {
      scale: [0.8, 1.2, 1],
      rotateY: [65, 0],
      transition: { duration: 0.7, ease: 'easeOut' },
    },
    secondaryAnimation: {
      opacity: [0, 1, 0.6],
      y: [20, 0, -6],
      transition: { duration: 1.4, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.5 },
    },
  },
  loss: {
    label: 'Defeat',
    description: 'The bot foresaw your strategy',
    className: 'text-rose-400 drop-shadow-[0_0_30px_rgba(251,113,133,0.7)]',
    animation: {
      x: [0, -8, 8, -6, 6, -4, 4, 0],
      transition: { duration: 0.6, ease: 'easeInOut' },
    },
    secondaryAnimation: {
      opacity: [0.6, 1, 0.6],
      transition: { duration: 0.8, ease: 'easeInOut', repeat: Infinity },
    },
  },
  draw: {
    label: 'Stalemate',
    description: 'Evenly matched minds clash',
    className: 'text-sky-300 drop-shadow-[0_0_30px_rgba(125,211,252,0.7)]',
    animation: {
      scale: [0.9, 1.1, 0.9, 1],
      transition: { duration: 0.9, ease: 'easeInOut' },
    },
    secondaryAnimation: {
      y: [0, -4, 0],
      transition: { duration: 1.1, ease: 'easeInOut', repeat: Infinity },
    },
  },
} as const;

type ResultBannerProps = {
  result?: 'win' | 'loss' | 'draw';
};

export const ResultBanner = ({ result }: ResultBannerProps) => {
  return (
    <AnimatePresence>
      {result ? (
        <motion.div
          key={result}
          className="pointer-events-none absolute inset-x-0 top-10 flex flex-col items-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.span
            className={`font-orbitron text-4xl uppercase tracking-[0.6em] ${resultConfig[result].className}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ opacity: 1, ...(resultConfig[result].animation as Target) }}
            exit={{ opacity: 0, scale: 0.85 }}
          >
            {resultConfig[result].label}
          </motion.span>
          <motion.span
            className="mt-3 text-xs uppercase tracking-[0.4em] text-white/70"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {resultConfig[result].description}
          </motion.span>
          {result === 'win' ? (
            <motion.div
              className="mt-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.5em] text-emerald-200/80"
              animate={resultConfig[result].secondaryAnimation as Target}
            >
              <span className="h-px w-10 bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent" />
              Arena Champion
              <span className="h-px w-10 bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent" />
            </motion.div>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
