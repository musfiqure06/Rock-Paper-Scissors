import { useMemo } from 'react';

const colors = ['#5df2ff', '#c084fc', '#22d3ee', '#fde68a', '#38bdf8'];

export const Confetti = ({ active }: { active: boolean }) => {
  const confettiPieces = useMemo(
    () =>
      new Array(120).fill(null).map((_, index) => ({
        id: index,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      })),
    [],
  );

  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
      {confettiPieces.map((piece) => (
        <span
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        />
      ))}
    </div>
  );
};
