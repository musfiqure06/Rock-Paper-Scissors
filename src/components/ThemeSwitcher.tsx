import { motion } from 'framer-motion';

const themes = [
  { id: 'default', label: 'Neon Cyber' },
  { id: 'dark', label: 'Dark Arena' },
  { id: 'glass', label: 'Glassmorphism' },
] as const;

type ThemeSwitcherProps = {
  current: string;
  onChange: (theme: string) => void;
};

export const ThemeSwitcher = ({ current, onChange }: ThemeSwitcherProps) => {
  return (
    <div className="glass-panel flex items-center gap-3 rounded-full px-5 py-3 text-xs uppercase tracking-[0.35em] text-[var(--text-secondary)]">
      {themes.map((theme) => {
        const active = current === theme.id;
        return (
          <motion.button
            key={theme.id}
            onClick={() => onChange(theme.id)}
            className={`relative overflow-hidden rounded-full px-4 py-1 font-semibold transition ${
              active
                ? 'text-[var(--text-primary)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            whileTap={{ scale: 0.92 }}
          >
            {active && (
              <motion.span
                layoutId="themeActive"
                className="absolute inset-0 rounded-full bg-[var(--accent-strong)]"
                transition={{ type: 'spring', stiffness: 230, damping: 24 }}
              />
            )}
            <span className="relative z-10 font-orbitron text-[10px] tracking-[0.3em]">
              {theme.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};
