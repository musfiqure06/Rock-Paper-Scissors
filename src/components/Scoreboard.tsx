import { motion } from 'framer-motion';

export type ScoreboardProps = {
  wins: number;
  losses: number;
  draws: number;
  onReset: () => void;
};

const Item = ({ label, value }: { label: string; value: number }) => (
  <div className="relative flex flex-1 flex-col items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-6 py-4 text-center backdrop-blur">
    <span className="font-orbitron text-xs uppercase tracking-[0.4em] text-[var(--text-secondary)]">
      {label}
    </span>
    <span className="text-3xl font-semibold text-white drop-shadow-[0_0_24px_rgba(93,242,255,0.45)]">
      {value.toString().padStart(2, '0')}
    </span>
  </div>
);

export const Scoreboard = ({ wins, losses, draws, onReset }: ScoreboardProps) => {
  return (
    <motion.div
      className="glass-panel flex w-full flex-col gap-5 rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="flex flex-col gap-4 lg:flex-row">
        <Item label="Wins" value={wins} />
        <Item label="Losses" value={losses} />
        <Item label="Draws" value={draws} />
      </div>
      <motion.button
        onClick={onReset}
        className="relative overflow-hidden rounded-full bg-[var(--accent-strong)] px-6 py-3 font-orbitron text-xs uppercase tracking-[0.5em] text-white shadow-lg backdrop-blur transition hover:shadow-[0_0_35px_rgba(93,242,255,0.55)]"
        whileTap={{ scale: 0.94 }}
      >
        <span className="relative z-10">Reset Record</span>
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </motion.button>
    </motion.div>
  );
};
