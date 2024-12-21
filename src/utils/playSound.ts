const playMoveSound = () => {
  const audio = new Audio("/audio/move.mp3");
  audio.play().catch((err) => console.error("Failed to play sound:", err));
};

const captureSound = () => {
  const audio = new Audio("/audio/capture.mp3");
  audio.play().catch((err) => console.error("Failed to play sound:", err));
};

const checkSound = () => {
  const audio = new Audio("/audio/check.mp3");
  audio.play().catch((err) => console.error("Failed to play sound:", err));
};

const checkmateSound = () => {
  const audio = new Audio("/audio/checkmate.mp3");
  audio.play().catch((err) => console.error("Failed to play sound:", err));
};

const incorrectMoveSound = () => {
  const audio = new Audio("/audio/incorrect-move.mp3");
  audio.play().catch((err) => console.error("Failed to play sound:", err));
};

const promotionSound = () => {
  const audio = new Audio("/audio/promote.mp3");
  audio.play().catch((err) => console.error("Failed to play sound:", err));
};

const castleSound = () => {
  const audio = new Audio("/audio/castling.mp3");
  audio.play().catch((err) => console.error("Failed to play sound:", err));
};

export type SoundType =
  | "move"
  | "capture"
  | "check"
  | "checkmate"
  | "incorrect-move"
  | "promotion"
  | "castle";

export const playSound = (type: SoundType) => {
  switch (type) {
    case "move":
      playMoveSound();
      break;
    case "capture":
      captureSound();
      break;
    case "check":
      checkSound();
      break;
    case "checkmate":
      checkmateSound();
      break;
    case "incorrect-move":
      incorrectMoveSound();
      break;
    case "promotion":
      promotionSound();
      break;
    case "castle":
      castleSound();
      break;
  }
};
