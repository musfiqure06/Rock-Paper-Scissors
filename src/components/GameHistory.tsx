import { motion } from 'framer-motion';
import type { Choice } from '../lib/gameLogic';

type GameHistoryProps = {
  history: Array<{
    round: number;
    player: Choice;
    bot: Choice;
    result: 'win' | 'loss' | 'draw';
  }>;
};

const resultColors: Record<'win' | 'loss' | 'draw', string> = {
  win: 'text-emerald-400',
  loss: 'text-rose-400',
  draw: 'text-sky-300',
};

const icons: Record<Choice, string> = {
  rock: '🪨',
  paper: '📜',
  scissors: '✂️',
};

export const GameHistory = ({ history }: GameHistoryProps) => {
  return (
    <div className="glass-panel relative flex h-full max-h-80 flex-col overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between px-6 py-4">
        <span className="font-orbitron text-sm uppercase tracking-[0.4em] text-[var(--text-secondary)]">
          Match Log
        </span>
        <span className="text-xs tracking-[0.3em] text-[var(--text-secondary)]">
          Last {Math.min(history.length, 10)} rounds
        </span>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {history.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm uppercase tracking-[0.4em] text-[var(--text-secondary)]">
            Awaiting first battle...
          </div>
        ) : (
          <div className="space-y-3">
            {[...history].reverse().slice(0, 10).map((item) => (
              <motion.div
                key={item.round}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm backdrop-blur-md"
              >
                <span className="text-xs tracking-[0.3em] text-[var(--text-secondary)]">
                  Round {item.round.toString().padStart(2, '0')}
                </span>
                <div className="flex items-center gap-2 text-lg">
                  <span>{icons[item.player]}</span>
                  <span className="text-xs tracking-[0.3em] text-[var(--text-secondary)]">
                    vs
                  </span>
                  <span>{icons[item.bot]}</span>
                </div>
                <span className={`text-xs font-semibold tracking-[0.3em] ${resultColors[item.result]}`}>
                  {item.result.toUpperCase()}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
