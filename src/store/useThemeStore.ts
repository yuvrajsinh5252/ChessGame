import { create } from "zustand";

export type pieceThemes = "default" | "classic";
export type boardThemes = "default" | "classic";

interface ThemeStore {
  boardTheme: boardThemes;
  pieceTheme: pieceThemes;
  setBoardTheme: (theme: "default") => void;
  setPieceTheme: (theme: "default") => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  boardTheme: "default",
  pieceTheme: "default",
  setBoardTheme: (theme) => set({ boardTheme: theme }),
  setPieceTheme: (theme) => set({ pieceTheme: theme }),
}));
