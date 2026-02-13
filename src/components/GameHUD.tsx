import { Cpu, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Difficulty } from '../lib/gameLogic';

type GameHUDProps = {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
};

const difficulties: Array<{ value: Difficulty; label: string }> = [
  { value: 'easy', label: 'Easy' },
  { value: 'normal', label: 'Normal' },
  { value: 'smart', label: 'Smart Bot' },
];

export const GameHUD = ({ difficulty, onDifficultyChange }: GameHUDProps) => {
  return (
    <div className="glass-panel flex flex-col gap-4 rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-[var(--accent)]" />
          <span className="font-orbitron text-sm uppercase tracking-[0.4em] text-white/80">
            Arena Controls
          </span>
        </div>
        <motion.div
          className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/70"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Cpu className="h-4 w-4" />
          AI Active
        </motion.div>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {difficulties.map((option) => {
          const active = option.value === difficulty;
          return (
            <motion.button
              key={option.value}
              onClick={() => onDifficultyChange(option.value)}
              className={`relative flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-xs uppercase tracking-[0.3em] text-white/70 transition ${
                active ? 'shadow-[0_0_25px_rgba(93,242,255,0.35)]' : ''
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {active && (
                <motion.span
                  layoutId="difficultyActive"
                  className="absolute inset-0 rounded-xl bg-[var(--accent-strong)]"
                  transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                />
              )}
              <span className="relative z-10 font-orbitron text-[11px] uppercase">
                {option.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
