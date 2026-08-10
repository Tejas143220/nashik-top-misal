import confetti from 'canvas-confetti';

export const triggerConfetti = () => {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#ea580c', '#f59e0b', '#e11d48', '#10b981'],
  });
};

export default triggerConfetti;
