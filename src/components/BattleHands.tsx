import { motion, useAnimationControls } from 'framer-motion';
import { useEffect } from 'react';
import type { Choice } from '../lib/gameLogic';
import { getHandVector } from '../lib/handModels';

const choiceLabels: Record<Choice, string> = {
  rock: 'ROCK',
  paper: 'PAPER',
  scissors: 'SCISSORS',
};

type BattleHandsProps = {
  playerChoice?: Choice;
  botChoice?: Choice;
  reveal: boolean;
  onRevealComplete: () => void;
};

const gradientClasses: Record<Choice, string> = {
  rock: 'bg-gradient-to-br from-cyan-400/70 via-cyan-500/30 to-slate-900/40',
  paper: 'bg-gradient-to-br from-purple-400/70 via-indigo-500/20 to-slate-900/40',
  scissors: 'bg-gradient-to-br from-amber-400/70 via-orange-500/25 to-slate-900/40',
};

export const BattleHands = ({
  playerChoice,
  botChoice,
  reveal,
  onRevealComplete,
}: BattleHandsProps) => {
  const playerControls = useAnimationControls();
  const botControls = useAnimationControls();

  useEffect(() => {
    if (!playerChoice || !botChoice || !reveal) return;

    const sequence = async () => {
      await Promise.all([
        playerControls.start({
          x: ['-40%', '-12%', '-5%'],
          rotateZ: [0, 6, 2],
          transition: { duration: 0.6, ease: 'easeOut' },
        }),
        botControls.start({
          x: ['40%', '12%', '5%'],
          rotateZ: [0, -6, -2],
          transition: { duration: 0.6, ease: 'easeOut' },
        }),
      ]);

      for (let i = 0; i < 2; i += 1) {
        await Promise.all([
          playerControls.start({
            rotateZ: [2, -12, 2],
            transition: { duration: 0.5, ease: 'easeInOut' },
          }),
          botControls.start({
            rotateZ: [-2, 12, -2],
            transition: { duration: 0.5, ease: 'easeInOut' },
          }),
        ]);
      }

      await Promise.all([
        playerControls.start({
          rotateX: [0, 25, 0],
          scale: [1, 1.08, 1],
          transition: { duration: 0.4, ease: 'easeInOut' },
        }),
        botControls.start({
          rotateX: [0, -25, 0],
          scale: [1, 1.08, 1],
          transition: { duration: 0.4, ease: 'easeInOut' },
        }),
      ]);

      onRevealComplete();
    };

    void sequence();
  }, [playerChoice, botChoice, reveal, playerControls, botControls, onRevealComplete]);

  const baseClass =
    'pointer-events-none absolute top-1/2 h-44 w-40 -translate-y-1/2 rounded-2xl border border-white/10 backdrop-blur-[18px] shadow-[0_15px_45px_rgba(0,0,0,0.55)] button-3d flex flex-col items-center justify-center gap-4 overflow-hidden';

  return (
    <div className="relative flex h-60 items-center justify-center overflow-visible">
      <motion.div
        animate={playerControls}
        initial={{ x: '-60%', rotateZ: 0, rotateX: 0, scale: 1 }}
        className={`${baseClass} left-0 ${playerChoice ? gradientClasses[playerChoice] : 'bg-white/10'}`}
      >
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-orbitron text-sm tracking-[0.5em] text-white/60">
          PLAYER
        </span>
        <div className="flex h-full flex-col items-center justify-center gap-4">
          <span className="text-2xl font-semibold tracking-[0.3em] text-white">
            {playerChoice ? choiceLabels[playerChoice] : 'READY'}
          </span>
          <motion.svg
            viewBox="0 0 36 36"
            className="h-20 w-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: playerChoice ? 1 : 0.4, scale: playerChoice ? 1 : 0.8 }}
            transition={{ duration: 0.4 }}
          >
            <defs>
              <linearGradient id={`playerHandGradient-${playerChoice ?? 'neutral'}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(93,242,255,1)" />
                <stop offset="100%" stopColor="rgba(192,132,252,0.8)" />
              </linearGradient>
            </defs>
            <path
              d={getHandVector(playerChoice ?? 'rock')}
              fill={`url(#playerHandGradient-${playerChoice ?? 'neutral'})`}
              stroke="rgba(255,255,255,0.35)"
              strokeWidth={0.6}
              filter="drop-shadow(0 0 12px rgba(93,242,255,0.5))"
            />
          </motion.svg>
        </div>
      </motion.div>

      <motion.div
        animate={botControls}
        initial={{ x: '60%', rotateZ: 0, rotateX: 0, scale: 1 }}
        className={`${baseClass} right-0 ${botChoice ? gradientClasses[botChoice] : 'bg-white/10'}`}
      >
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-orbitron text-sm tracking-[0.5em] text-white/60">
          BOT
        </span>
        <div className="flex h-full flex-col items-center justify-center gap-4">
          <span className="text-2xl font-semibold tracking-[0.3em] text-white">
            {botChoice ? choiceLabels[botChoice] : 'WAIT'}
          </span>
          <motion.svg
            viewBox="0 0 36 36"
            className="h-20 w-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: botChoice ? 1 : 0.4, scale: botChoice ? 1 : 0.8 }}
            transition={{ duration: 0.4 }}
          >
            <defs>
              <linearGradient id={`botHandGradient-${botChoice ?? 'neutral'}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(250,204,21,0.9)" />
                <stop offset="100%" stopColor="rgba(251,113,133,0.9)" />
              </linearGradient>
            </defs>
            <path
              d={getHandVector(botChoice ?? 'rock')}
              fill={`url(#botHandGradient-${botChoice ?? 'neutral'})`}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth={0.6}
              filter="drop-shadow(0 0 12px rgba(251,113,133,0.5))"
            />
          </motion.svg>
        </div>
      </motion.div>
    </div>
  );
};
