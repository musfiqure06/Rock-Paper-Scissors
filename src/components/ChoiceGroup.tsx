import { AnimatePresence, motion } from 'framer-motion';
import { ChoiceCard } from './ChoiceCard';
import type { Choice } from '../lib/gameLogic';
import { useRipple } from '../hooks/useRipple';

type ChoiceGroupProps = {
  onSelect: (choice: Choice) => void;
  disabled: boolean;
  activeChoice?: Choice;
};

export const ChoiceGroup = ({ onSelect, disabled, activeChoice }: ChoiceGroupProps) => {
  const { ripples, createRipple } = useRipple();

  const handleSelect = (choice: Choice, coords: { x: number; y: number }) => {
    createRipple(coords);
    onSelect(choice);
  };

  return (
    <div className="relative grid gap-5 md:grid-cols-3">
      {(['rock', 'paper', 'scissors'] as Choice[]).map((choice) => (
        <div key={choice} className="relative">
          <ChoiceCard
            choice={choice}
            label={choice.toUpperCase()}
            onSelect={(value, ripple) => handleSelect(value, ripple)}
            disabled={disabled}
            active={activeChoice === choice}
          />
          <AnimatePresence>
            {ripples.map((ripple) => (
              <motion.span
                key={ripple.id}
                className="ripple"
                style={{ left: `${ripple.x}%`, top: `${ripple.y}%` }}
                initial={{ opacity: 0.45, scale: 0.2 }}
                animate={{ opacity: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            ))}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};
