import { create } from "zustand";

type pieceThemes = "default";
type boardThemes = "default";

interface ThemeStore {
  boardTheme: boardThemes;
  pieceTheme: pieceThemes;
  setBoardTheme: (theme: "default") => void;
  setPieceTheme: (theme: "default") => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  boardTheme: "default",
  pieceTheme: "default",
  setBoardTheme: (theme: "default") => set({ boardTheme: theme }),
  setPieceTheme: (theme: "default") => set({ pieceTheme: theme }),
}));
