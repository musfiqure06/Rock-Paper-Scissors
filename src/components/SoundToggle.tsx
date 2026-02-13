import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

type SoundToggleProps = {
  muted: boolean;
  onToggle: () => void;
};

export const SoundToggle = ({ muted, onToggle }: SoundToggleProps) => {
  return (
    <motion.button
      onClick={onToggle}
      className="glass-panel relative flex items-center gap-2 rounded-full px-4 py-2 text-sm uppercase tracking-[0.2em] text-[var(--text-secondary)] shadow-lg transition hover:text-[var(--text-primary)]"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.93 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      {muted ? 'Sound Off' : 'Sound On'}
    </motion.button>
  );
};
