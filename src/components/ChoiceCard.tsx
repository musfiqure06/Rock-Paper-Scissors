import { motion } from 'framer-motion';
import { useCallback, useRef, useState } from 'react';
import type { Choice } from '../lib/gameLogic';

const icons: Record<Choice, string> = {
  rock: '🪨',
  paper: '📜',
  scissors: '✂️',
};

type ChoiceCardProps = {
  choice: Choice;
  label: string;
  onSelect: (choice: Choice, ripple: { x: number; y: number }) => void;
  disabled: boolean;
  active: boolean;
};

export const ChoiceCard = ({ choice, label, onSelect, disabled, active }: ChoiceCardProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      const rect = ref.current?.getBoundingClientRect();
      const ripple = rect
        ? {
            x: ((event.clientX - rect.left) / rect.width) * 100,
            y: ((event.clientY - rect.top) / rect.height) * 100,
          }
        : { x: 50, y: 50 };
      onSelect(choice, ripple);
    },
    [choice, disabled, onSelect],
  );

  return (
    <motion.button
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      className={`button-3d relative flex h-48 w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br px-6 text-white shadow-2xl transition focus:outline-none focus:ring-2 focus:ring-cyan-400/60 disabled:cursor-not-allowed disabled:opacity-60 lg:h-56 ${
        active ? 'ring-2 ring-cyan-300/80' : ''
      }`}
      style={{
        backgroundImage:
          choice === 'rock'
            ? 'linear-gradient(180deg, rgba(78, 197, 255, 0.5), rgba(20, 40, 70, 0.7))'
            : choice === 'paper'
              ? 'linear-gradient(180deg, rgba(192, 132, 252, 0.5), rgba(32, 22, 48, 0.7))'
              : 'linear-gradient(180deg, rgba(250, 204, 21, 0.5), rgba(68, 40, 10, 0.7))',
      }}
      whileHover={{ y: -6, rotateX: 6, rotateY: -4 }}
      whileTap={{ scale: 0.96 }}
      animate={hovered ? { boxShadow: '0px 25px 65px rgba(93, 242, 255, 0.2)' } : {}}
      transition={{ type: 'spring', stiffness: 200, damping: 16 }}
      disabled={disabled}
    >
      <motion.div
        className="relative text-6xl drop-shadow-[0_0_22px_rgba(93,242,255,0.65)]"
        animate={{ scale: active ? 1.2 : 1, rotate: hovered ? [0, -6, 6, 0] : 0 }}
        transition={{ repeat: hovered ? Infinity : 0, duration: 2 }}
      >
        {icons[choice]}
      </motion.div>
      <motion.span
        className="mt-4 font-orbitron text-sm uppercase tracking-[0.4em] text-white/80"
        layout
      >
        {label}
      </motion.span>
    </motion.button>
  );
};
