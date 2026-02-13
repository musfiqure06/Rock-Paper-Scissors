import type { Choice } from './gameLogic';

const vectors: Record<Choice, string> = {
  rock: 'M18 2c-6 0-10 3-12 8 0 3-1 14 12 14s12-11 12-14c-2-5-6-8-12-8z',
  paper: 'M12 2c-4 0-7 3-7 7v10c0 2.2 1.8 4 4 4h14c2.2 0 4-1.8 4-4V7c0-4-3-7-7-7H12z',
  scissors:
    'M6 4c-2.2 0-4 1.8-4 4s1.8 4 4 4a4 4 0 0 0 1-.13l3 3L6 18c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4l5-5 5 5c0 2.2 1.8 4 4 4s4-1.8 4-4-1.8-4-4-4L16 14l3-3a4 4 0 0 0 2 .13c2.2 0 4-1.8 4-4s-1.8-4-4-4a4 4 0 0 0-3 1.38L16 7l-3-3A4 4 0 0 0 10 2c-2.2 0-4 1.8-4 4z',
};

export const getHandVector = (choice: Choice) => vectors[choice];
