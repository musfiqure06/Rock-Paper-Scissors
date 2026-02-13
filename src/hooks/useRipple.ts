import { useEffect, useState } from 'react';

type Ripple = {
  id: number;
  x: number;
  y: number;
};

export const useRipple = () => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    if (ripples.length === 0) return;
    const timeout = setTimeout(() => {
      setRipples((current) => current.slice(1));
    }, 700);
    return () => clearTimeout(timeout);
  }, [ripples]);

  const createRipple = (coords: { x: number; y: number }) => {
    setRipples((current) => [...current, { id: Date.now(), ...coords }]);
  };

  return { ripples, createRipple };
};
