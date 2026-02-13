export type SoundKey =
  | 'click'
  | 'countdown'
  | 'win'
  | 'loss'
  | 'draw'
  | 'toggle';

const audioContext =
  typeof window !== 'undefined' ? new AudioContext() : undefined;

const soundProfiles: Record<SoundKey, { frequencies: number[]; duration: number }> = {
  click: { frequencies: [420], duration: 0.08 },
  countdown: { frequencies: [520, 480, 440], duration: 0.5 },
  win: { frequencies: [660, 880, 990], duration: 0.9 },
  loss: { frequencies: [220, 180], duration: 0.6 },
  draw: { frequencies: [440, 420], duration: 0.4 },
  toggle: { frequencies: [320, 420], duration: 0.3 },
};

export const playSound = (key: SoundKey, muted?: boolean) => {
  if (muted || !audioContext) return;
  void audioContext.resume().catch(() => undefined);

  const { frequencies, duration } = soundProfiles[key];
  const now = audioContext.currentTime + 0.02;
  const gain = audioContext.createGain();
  gain.connect(audioContext.destination);
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.35, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  frequencies.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(frequency, now + index * (duration / frequencies.length));
    oscillator.frequency.exponentialRampToValueAtTime(
      frequency * 0.92,
      now + ((index + 1) * duration) / frequencies.length,
    );
    oscillator.connect(gain);
    oscillator.start(now + index * 0.05);
    oscillator.stop(now + duration + 0.05);
  });
};

export const preloadSounds = () => {
  if (!audioContext) return;
  const silentOsc = audioContext.createOscillator();
  const silentGain = audioContext.createGain();
  silentGain.gain.value = 0;
  silentOsc.connect(silentGain).connect(audioContext.destination);
  silentOsc.start();
  silentOsc.stop(audioContext.currentTime + 0.01);
};
