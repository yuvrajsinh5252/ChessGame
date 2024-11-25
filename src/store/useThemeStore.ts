import { defaultBoardTheme } from "@/utils/boardThemes/board-themes";
import { create } from "zustand";

export type pieceThemes = "default" | "classic";
export type boardThemes = {
  name: "default" | "wood" | "marble" | "blue-white" | "green-white";
  light: string;
  dark: string;
  selected: string;
  highlight: string;
  lastMove: string;
};

interface ThemeStore {
  boardTheme: boardThemes;
  pieceTheme: pieceThemes;
  setBoardTheme: (theme: boardThemes) => void;
  setPieceTheme: (theme: "default") => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  boardTheme: defaultBoardTheme,
  pieceTheme: "default",
  setBoardTheme: (theme) => set({ boardTheme: theme }),
  setPieceTheme: (theme) => set({ pieceTheme: theme }),
}));
