export type Choice = 'rock' | 'paper' | 'scissors';
export type Difficulty = 'easy' | 'normal' | 'smart';

const choiceOrder: Choice[] = ['rock', 'paper', 'scissors'];
const winMap: Record<Choice, Choice> = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper',
};

export const getResult = (player: Choice, bot: Choice) => {
  if (player === bot) return 'draw' as const;
  return winMap[player] === bot ? 'win' : 'loss';
};

export const getBotChoice = (difficulty: Difficulty, history: Choice[]): Choice => {
  if (difficulty === 'easy' || history.length === 0) {
    return randomChoice();
  }

  if (difficulty === 'normal') {
    const last = history[history.length - 1];
    return counterChoice(last);
  }

  // smart difficulty: weighted prediction based on frequency
  const frequency = history.reduce(
    (acc, choice) => {
      acc[choice] += 1;
      return acc;
    },
    { rock: 0, paper: 0, scissors: 0 } as Record<Choice, number>,
  );

  const total = history.length;
  const probabilities = choiceOrder.map((choice) => ({
    choice,
    weight: frequency[choice] / total,
  }));

  probabilities.sort((a, b) => b.weight - a.weight);
  const predicted = probabilities[0].choice;
  return counterChoice(predicted);
};

const counterChoice = (choice: Choice): Choice => {
  switch (choice) {
    case 'rock':
      return 'paper';
    case 'paper':
      return 'scissors';
    case 'scissors':
      return 'rock';
  }
};

export const randomChoice = (): Choice => {
  const index = Math.floor(Math.random() * choiceOrder.length);
  return choiceOrder[index];
};
