import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BattleHands,
  BotStatus,
  ChoiceGroup,
  Confetti,
  GameHistory,
  GameHUD,
  GameLayout,
  LoadingIntro,
  ResultBanner,
  Scoreboard,
  SoundToggle,
  ThemeSwitcher,
} from '../components';
import { applyTheme } from '../lib/theme';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getBotChoice, getResult, type Choice, type Difficulty } from '../lib/gameLogic';
import { playSound, preloadSounds } from '../lib/audio';

const countdownSequence = [3, 2, 1];

export const Home = () => {
  const [theme, setTheme] = useLocalStorage('rps-theme', 'default');
  const [scores, setScores] = useLocalStorage('rps-scores', {
    wins: 0,
    losses: 0,
    draws: 0,
  });
  const [history, setHistory] = useLocalStorage<Array<{ round: number; player: Choice; bot: Choice; result: 'win' | 'loss' | 'draw' }>>(
    'rps-history',
    [],
  );
  const [difficulty, setDifficulty] = useLocalStorage<Difficulty>('rps-difficulty', 'normal');
  const [muted, setMuted] = useLocalStorage('rps-muted', false);
  const [loading, setLoading] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const [currentRound, setCurrentRound] = useState<number>(history.length + 1);
  const [playerChoice, setPlayerChoice] = useState<Choice>();
  const [botChoice, setBotChoice] = useState<Choice>();
  const [result, setResult] = useState<'win' | 'loss' | 'draw'>();
  const [confettiActive, setConfettiActive] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [countdown, setCountdown] = useState<number>();
  const [revealReady, setRevealReady] = useState(false);
  const revealCompleteRef = useRef<(() => void) | null>(null);
  const [battlePhase, setBattlePhase] = useState<'idle' | 'countdown' | 'reveal' | 'resolution'>('idle');

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    preloadSounds();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 2400);
    return () => clearTimeout(timeout);
  }, []);

  const smartHistory = useMemo(() => history.map((item) => item.player), [history]);

  const resetConfetti = useCallback(() => setConfettiActive(false), []);

  const handleOutcome = useCallback(
    (player: Choice, bot: Choice) => {
      const roundResult = getResult(player, bot);
      setResult(roundResult);
      revealCompleteRef.current = null;
      setRevealReady(false);

      setScores((prev) => ({
        wins: prev.wins + (roundResult === 'win' ? 1 : 0),
        losses: prev.losses + (roundResult === 'loss' ? 1 : 0),
        draws: prev.draws + (roundResult === 'draw' ? 1 : 0),
      }));

      setHistory((prev) => {
        const nextRecords: typeof prev = [
          ...prev,
          {
            round: currentRound,
            player,
            bot,
            result: roundResult,
          },
        ];
        // retain only the latest 50 rounds for performance
        return nextRecords.slice(-50);
      });

      setCurrentRound((prev) => prev + 1);

      if (roundResult === 'win') {
        setConfettiActive(true);
        setTimeout(resetConfetti, 3500);
      }

      if (roundResult === 'loss') {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 800);
      }

      playSound(roundResult === 'win' ? 'win' : roundResult === 'loss' ? 'loss' : 'draw', muted);
      setBattlePhase('resolution');
      setTimeout(() => setBattlePhase('idle'), 900);
    },
    [currentRound, muted, resetConfetti, setHistory, setScores],
  );

  const handleSelect = useCallback(
    (choice: Choice) => {
      const startRound = async () => {
        playSound('click', muted);
        setResult(undefined);
        revealCompleteRef.current = null;
        setPlayerChoice(choice);
        setBotChoice(undefined);
        setRevealReady(false);
        setCountdown(undefined);
        setConfettiActive(false);
        setBattlePhase('countdown');

        setIsThinking(true);
        const baseDelay = difficulty === 'easy' ? 800 : difficulty === 'normal' ? 1100 : 1500;
        const stagger = baseDelay / (countdownSequence.length + 1);

        for (const value of countdownSequence) {
          setCountdown(value);
          playSound('countdown', muted);
          // eslint-disable-next-line no-await-in-loop
          await new Promise((resolve) => setTimeout(resolve, stagger));
        }

        setCountdown(undefined);

        const botMove = getBotChoice(difficulty, smartHistory);
        setBotChoice(botMove);
        setIsThinking(false);
        setRevealReady(true);
        setBattlePhase('reveal');
        revealCompleteRef.current = () => handleOutcome(choice, botMove);
      };

      void startRound();
    },
    [difficulty, muted, handleOutcome, smartHistory],
  );

  const handleReset = useCallback(() => {
    setScores({ wins: 0, losses: 0, draws: 0 });
    setHistory([]);
    setCurrentRound(1);
    playSound('toggle', muted);
    setBattlePhase('idle');
  }, [muted, setHistory, setScores]);

  const toggleMute = useCallback(() => {
    setMuted((prev) => !prev);
    playSound('toggle', muted);
  }, [muted, setMuted]);

  const handleDifficultyChange = useCallback(
    (value: Difficulty) => {
      setDifficulty(value);
      playSound('toggle', muted);
    },
    [muted, setDifficulty],
  );

  const handleThemeChange = useCallback(
    (value: string) => {
      setTheme(value);
      playSound('toggle', muted);
    },
    [muted, setTheme],
  );

  const blurActive = battlePhase === 'countdown' || battlePhase === 'reveal';

  return (
    <GameLayout>
      <AnimatePresence>{loading && <LoadingIntro onComplete={() => setLoading(false)} />}</AnimatePresence>
      <Confetti active={confettiActive} />
      <AnimatePresence>
        {blurActive ? (
          <motion.div
            className="pointer-events-none fixed inset-0 z-30 bg-[rgba(3,7,18,0.58)] backdrop-blur-[12px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          />
        ) : null}
      </AnimatePresence>
      <motion.div
        className={`glass-panel relative rounded-[36px] border border-white/10 px-6 py-8 shadow-2xl transition md:px-12 ${
          isShaking ? 'animate-screen-shake' : ''
        }`}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="font-orbitron text-xs uppercase tracking-[0.6em] text-[var(--text-secondary)]">
              Musfiqure Rahman presents
            </span>
            <h1 className="mt-3 font-orbitron text-4xl uppercase tracking-[0.6em] text-white drop-shadow-[0_0_35px_rgba(93,242,255,0.55)] lg:text-5xl">
              Rock Paper Scissors Arena
            </h1>
            <p className="mt-3 text-sm uppercase tracking-[0.4em] text-[var(--text-secondary)]">
              Engage the cinematic duel
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <ThemeSwitcher current={theme} onChange={handleThemeChange} />
            <SoundToggle muted={muted} onToggle={toggleMute} />
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-10">
            <div className="glass-panel relative overflow-hidden rounded-3xl p-6">
              <div className="absolute inset-0 -z-10 backdrop-blur-2xl" />
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-orbitron text-xs uppercase tracking-[0.4em] text-white/70">
                    Choose your gesture
                  </span>
                  <p className="mt-2 text-xs uppercase tracking-[0.3em] text-[var(--text-secondary)]">
                    Rock / Paper / Scissors
                  </p>
                </div>
                <BotStatus thinking={isThinking} />
              </div>
              <div className="mt-6">
                <ChoiceGroup
                  onSelect={handleSelect}
                  disabled={isThinking || countdown !== undefined}
                  activeChoice={playerChoice}
                />
              </div>
            </div>

            <div className="glass-panel relative overflow-hidden rounded-3xl p-8">
              <div className="absolute inset-0 -z-10 backdrop-blur-2xl" />
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-orbitron text-xs uppercase tracking-[0.4em] text-white/80">
                    Battle sequence
                  </span>
                  <span className="text-xs uppercase tracking-[0.4em] text-[var(--text-secondary)]">
                    Countdown {countdown ?? '—'}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm uppercase tracking-[0.3em] text-white/70">
                  <span>Round {currentRound.toString().padStart(2, '0')}</span>
                  <span className="font-semibold">
                    {result ? result.toUpperCase() : battlePhase === 'countdown' ? 'COUNTDOWN' : battlePhase === 'reveal' ? 'DUEL' : 'READY'}
                  </span>
                </div>
              </div>
              <div className="mt-6 relative">
                <AnimatePresence mode="wait">
                  {countdown !== undefined ? (
                    <motion.div
                      key={`count-${countdown}`}
                      className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0.3 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      <motion.span
                        className="font-orbitron text-7xl uppercase tracking-[0.6em] text-white drop-shadow-[0_0_40px_rgba(93,242,255,0.75)]"
                        animate={{ scale: [1, 1.2, 0.8], opacity: [1, 0.9, 0.4] }}
                        transition={{ duration: 0.7, ease: 'easeInOut' }}
                      >
                        {countdown}
                      </motion.span>
                    </motion.div>
                  ) : null}
                  {battlePhase === 'reveal' && !result ? (
                    <motion.div
                      key="duel-phase"
                      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                    >
                      <motion.span
                        className="font-orbitron text-4xl uppercase tracking-[0.6em] text-cyan-200 drop-shadow-[0_0_30px_rgba(93,242,255,0.65)]"
                        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        Duel!
                      </motion.span>
                    </motion.div>
                  ) : null}
                  {battlePhase === 'resolution' && result ? (
                    <motion.div
                      key="resolution-phase"
                      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    >
                      <span className="font-orbitron text-3xl uppercase tracking-[0.5em] text-white/70">
                        {result.toUpperCase()}!
                      </span>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
                <BattleHands
                  playerChoice={playerChoice}
                  botChoice={botChoice}
                  reveal={revealReady}
                  onRevealComplete={() => {
                    revealCompleteRef.current?.();
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <GameHUD difficulty={difficulty} onDifficultyChange={handleDifficultyChange} />
            <Scoreboard
              wins={scores.wins}
              losses={scores.losses}
              draws={scores.draws}
              onReset={handleReset}
            />
            <GameHistory history={history} />
          </div>
        </div>
      </motion.div>
      <ResultBanner result={result} />
    </GameLayout>
  );
};
