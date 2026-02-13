import { motion } from 'framer-motion';

export const BotStatus = ({ thinking }: { thinking: boolean }) => {
  return (
    <motion.div
      className="glass-panel flex items-center gap-3 rounded-full px-5 py-3 text-xs uppercase tracking-[0.4em] text-[var(--text-secondary)]"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.span
        className="flex h-2 w-2 rounded-full bg-[var(--accent)]"
        animate={{ opacity: thinking ? [0.4, 1, 0.4] : 1 }}
        transition={{ repeat: thinking ? Infinity : 0, duration: 1.4 }}
      />
      {thinking ? 'Bot is choosing...' : 'Awaiting challenge'}
    </motion.div>
  );
};
