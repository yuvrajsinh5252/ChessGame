export const playMoveSound = () => {
  const audio = new Audio("/audio/piece-move.mp3");
  audio.play().catch((err) => console.error("Failed to play sound:", err));
};
